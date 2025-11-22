// OZ AI Assistant - Personalized Recommendations
import { NextRequest } from 'next/server';
import { withErrorHandler } from '@/lib/api-handler';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { AuthenticationError } from '@/lib/errors';
import { ozAssistant } from '@/lib/services/oz-assistant';
import { db } from '@/db';
import { jobs, socialAccounts } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';
import { rateLimiter } from '@/lib/rate-limiter';

async function GET(req: NextRequest) {
  // Check authentication
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    throw new AuthenticationError();
  }

  // Rate limiting
  await rateLimiter.enforceLimit('api:ai', session.user.id);

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
    currentPlan: 'Free', // Update with actual plan from payments
    creditsRemaining: 100, // Update with actual credits
    accountAge: userDetails?.createdAt
      ? Math.floor((Date.now() - new Date(userDetails.createdAt).getTime()) / (1000 * 60 * 60 * 24))
      : 0,
  };

  // Generate recommendations
  const recommendations = await ozAssistant.generateRecommendations(profile);

  return {
    recommendations,
    profile: {
      connectedPlatforms: profile.connectedPlatforms.length,
      totalContent: Object.values(profile.contentHistory).reduce((a, b) => a + b, 0),
      accountAge: profile.accountAge,
    },
  };
}

async function POST(req: NextRequest) {
  // Check authentication
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    throw new AuthenticationError();
  }

  // Rate limiting
  await rateLimiter.enforceLimit('api:ai', session.user.id);

  const body = await req.json();
  const { action, context } = body;

  // Get quick tip for user action
  const tip = await ozAssistant.getQuickTip(action, context);

  return { tip };
}

export const GET = withErrorHandler(GET);
export const POST = withErrorHandler(POST);
