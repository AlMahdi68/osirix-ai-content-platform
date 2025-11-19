import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { jobs, user } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const allJobs = await db
      .select({
        id: jobs.id,
        userId: jobs.userId,
        userName: user.name,
        userEmail: user.email,
        type: jobs.type,
        prompt: jobs.prompt,
        avatarId: jobs.avatarId,
        voiceId: jobs.voiceId,
        status: jobs.status,
        progress: jobs.progress,
        resultUrl: jobs.resultUrl,
        createdAt: jobs.createdAt,
        finishedAt: jobs.finishedAt,
      })
      .from(jobs)
      .leftJoin(user, eq(jobs.userId, user.id))
      .orderBy(desc(jobs.createdAt))
      .limit(100);

    return NextResponse.json({ jobs: allJobs });
  } catch (error) {
    console.error("Failed to fetch jobs:", error);
    return NextResponse.json(
      { error: "Failed to fetch jobs" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const { jobId, action } = body;

    if (!jobId || !action) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    let updates: Record<string, any> = {};

    switch (action) {
      case "cancel":
        updates = { status: "cancelled", finishedAt: new Date().toISOString() };
        break;
      case "retry":
        updates = { status: "queued", progress: 0, finishedAt: null };
        break;
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const [updatedJob] = await db
      .update(jobs)
      .set(updates)
      .where(eq(jobs.id, jobId))
      .returning();

    return NextResponse.json({ job: updatedJob });
  } catch (error) {
    console.error("Failed to update job:", error);
    return NextResponse.json(
      { error: "Failed to update job" },
      { status: 500 }
    );
  }
}
