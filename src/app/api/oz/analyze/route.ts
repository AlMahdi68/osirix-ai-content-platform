// OZ AI Assistant - Content Analysis
import { NextRequest } from 'next/server';
import { withErrorHandler } from '@/lib/api-handler';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { AuthenticationError } from '@/lib/errors';
import { ozAssistant } from '@/lib/services/oz-assistant';
import { rateLimiter } from '@/lib/rate-limiter';

async function POST(req: NextRequest) {
  // Check authentication
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    throw new AuthenticationError();
  }

  // Rate limiting
  await rateLimiter.enforceLimit('api:ai', session.user.id);

  const body = await req.json();
  const { contentType, contentData, performanceMetrics } = body;

  if (!contentType || !contentData) {
    throw new Error('contentType and contentData are required');
  }

  // Analyze content with OZ
  const analysis = await ozAssistant.analyzeContent(
    contentType,
    contentData,
    performanceMetrics
  );

  return analysis;
}

export const POST = withErrorHandler(POST);
