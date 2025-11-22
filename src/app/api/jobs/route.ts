import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { jobs, creditsLedger } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { withErrorHandler } from "@/lib/api-handler";
import { AuthenticationError, InsufficientCreditsError } from "@/lib/errors";
import { validateRequest, createJobSchema } from "@/lib/validators";
import { rateLimiter } from "@/lib/rate-limiter";
import { jobProcessor } from "@/lib/services/job-processor";
import { logger } from "@/lib/logger";

async function handleGET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  
  if (!session?.user) {
    throw new AuthenticationError();
  }

  // Rate limiting
  await rateLimiter.enforceLimit('api:standard', session.user.id);

  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get("limit") || "50");
  const status = searchParams.get("status");
  const type = searchParams.get("type");

  let query = db
    .select()
    .from(jobs)
    .where(eq(jobs.userId, session.user.id))
    .orderBy(desc(jobs.createdAt))
    .limit(limit);

  const userJobs = await query;

  // Filter by status and type if provided
  let filteredJobs = userJobs;
  if (status) {
    filteredJobs = filteredJobs.filter(job => job.status === status);
  }
  if (type) {
    filteredJobs = filteredJobs.filter(job => job.type === type);
  }

  return { 
    jobs: filteredJobs,
    total: filteredJobs.length,
  };
}

async function handlePOST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  
  if (!session?.user) {
    throw new AuthenticationError();
  }

  // Rate limiting for job creation
  await rateLimiter.enforceLimit('user:jobs', session.user.id);

  const body = await request.json();
  
  // Validate input
  const validatedData = await validateRequest(createJobSchema, body);
  const { type, inputData, creditsRequired } = validatedData;

  // Check credits balance
  const latestCredit = await db
    .select()
    .from(creditsLedger)
    .where(eq(creditsLedger.userId, session.user.id))
    .orderBy(desc(creditsLedger.createdAt))
    .limit(1);

  const currentBalance = latestCredit.length > 0 ? latestCredit[0].balanceAfter : 0;

  if (currentBalance < creditsRequired) {
    throw new InsufficientCreditsError(creditsRequired, currentBalance);
  }

  // Create job
  const now = new Date().toISOString();
  const [job] = await db
    .insert(jobs)
    .values({
      userId: session.user.id,
      type,
      status: "pending",
      inputData,
      creditsReserved: creditsRequired,
      progress: 0,
      createdAt: now,
      updatedAt: now,
    })
    .returning();

  // Reserve credits
  await db.insert(creditsLedger).values({
    userId: session.user.id,
    amount: -creditsRequired,
    type: "reservation",
    referenceId: job.id.toString(),
    balanceAfter: currentBalance - creditsRequired,
    createdAt: now,
  });

  logger.info({
    action: 'job_created',
    jobId: job.id,
    userId: session.user.id,
    type: job.type,
    creditsReserved: creditsRequired,
  });

  // Process job asynchronously
  // In production, this would be sent to a job queue
  jobProcessor.processJob(job.id).catch(error => {
    logger.error({
      action: 'job_processing_failed',
      jobId: job.id,
      error: error instanceof Error ? error.message : String(error),
    });
  });

  return { 
    job: {
      id: job.id,
      type: job.type,
      status: job.status,
      progress: job.progress,
      createdAt: job.createdAt,
    },
    message: 'Job created and processing started',
  };
}

export const GET = withErrorHandler(handleGET);
export const POST = withErrorHandler(handlePOST);