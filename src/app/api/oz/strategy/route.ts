// OZ AI Assistant - Personalized Strategy
import { NextRequest } from 'next/server';
import { withErrorHandler } from '@/lib/api-handler';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { AuthenticationError, ValidationError } from '@/lib/errors';
import { ozAssistant } from '@/lib/services/oz-assistant';
import { db } from '@/db';
import { jobs, socialAccounts } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';
import { rateLimiter } from '@/lib/rate-limiter';
import { z } from 'zod';

const strategySchema = z.object({
  goal: z.string().min(10, 'Goal must be at least 10 characters'),
  timeframe: z.enum(['30days', '90days', '1year']),
});

async function POST(req: NextRequest) {
  // Check authentication
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    throw new AuthenticationError();
  }

  // Rate limiting
  await rateLimiter.enforceLimit('api:ai', session.user.id);

  const body = await req.json();
  
  // Validate input
  let validatedData;
  try {
    validatedData = strategySchema.parse(body);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string[]> = {};
      error.errors.forEach((err) => {
        const path = err.path.join('.');
        if (!errors[path]) errors[path] = [];
        errors[path].push(err.message);
      });
      throw new ValidationError(errors);
    }
    throw error;
  }

  const userId = session.user.id;

  // Gather user profile data
  const [connectedAccounts, contentStats, userDetails] = await Promise.all([
    db
      .select()
      .from(socialAccounts)
      .where(eq(socialAccounts.userId, userId)),
    
    db
      .select({
        type: jobs.type,
        count: sql<number>`count(*)`,
      })
      .from(jobs)
      .where(eq(jobs.userId, userId))
      .groupBy(jobs.type),
    
    db.query.user.findFirst({
      where: (user: any) => eq(user.id, userId),
    }),
  ]);

  // Build user profile
  const profile = {
    userId,
    connectedPlatforms: connectedAccounts.map((acc) => acc.platform),
    contentHistory: {
      logos: contentStats.find((s) => s.type === 'logo')?.count || 0,
      products: contentStats.find((s) => s.type === 'product')?.count || 0,
      characters: contentStats.find((s) => s.type === 'character')?.count || 0,
      videos: contentStats.find((s) => s.type === 'video')?.count || 0,
      campaigns: contentStats.find((s) => s.type === 'campaign')?.count || 0,
    },
    currentPlan: 'Free',
    creditsRemaining: 100,
    accountAge: userDetails?.createdAt
      ? Math.floor((Date.now() - new Date(userDetails.createdAt).getTime()) / (1000 * 60 * 60 * 24))
      : 0,
  };

  // Generate personalized strategy
  const strategy = await ozAssistant.getPersonalizedStrategy(
    profile,
    validatedData.goal,
    validatedData.timeframe
  );

  return {
    strategy,
    goal: validatedData.goal,
    timeframe: validatedData.timeframe,
  };
}

export const POST = withErrorHandler(POST);
