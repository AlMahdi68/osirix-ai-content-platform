import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { jobs } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const jobId = parseInt(id);

    if (isNaN(jobId)) {
      return NextResponse.json({ error: "Invalid job ID" }, { status: 400 });
    }

    const [job] = await db
      .select()
      .from(jobs)
      .where(
        and(
          eq(jobs.id, jobId),
          eq(jobs.userId, session.user.id)
        )
      );

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    return NextResponse.json({ job });
  } catch (error) {
    console.error("Failed to fetch job:", error);
    return NextResponse.json(
      { error: "Failed to fetch job" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const jobId = parseInt(id);

    if (isNaN(jobId)) {
      return NextResponse.json({ error: "Invalid job ID" }, { status: 400 });
    }

    const [job] = await db
      .select()
      .from(jobs)
      .where(
        and(
          eq(jobs.id, jobId),
          eq(jobs.userId, session.user.id)
        )
      );

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    // Only allow deletion of completed or failed jobs
    if (!["completed", "failed", "cancelled"].includes(job.status)) {
      return NextResponse.json(
        { error: "Cannot delete active job" },
        { status: 400 }
      );
    }

    await db.delete(jobs).where(eq(jobs.id, jobId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete job:", error);
    return NextResponse.json(
      { error: "Failed to delete job" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const jobId = parseInt(id);

    if (isNaN(jobId)) {
      return NextResponse.json({ error: "Invalid job ID" }, { status: 400 });
    }

    const body = await request.json();
    const { action } = body;

    if (!action) {
      return NextResponse.json(
        { error: "Action is required" },
        { status: 400 }
      );
    }

    const [job] = await db
      .select()
      .from(jobs)
      .where(
        and(
          eq(jobs.id, jobId),
          eq(jobs.userId, session.user.id)
        )
      );

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    let updates: Record<string, any> = {};

    switch (action) {
      case "cancel":
        if (job.status === "completed" || job.status === "failed") {
          return NextResponse.json(
            { error: "Cannot cancel finished job" },
            { status: 400 }
          );
        }
        updates = { 
          status: "cancelled", 
          finishedAt: new Date().toISOString() 
        };
        break;
      case "retry":
        if (job.status !== "failed") {
          return NextResponse.json(
            { error: "Can only retry failed jobs" },
            { status: 400 }
          );
        }
        updates = { 
          status: "queued", 
          progress: 0, 
          finishedAt: null,
          startedAt: null 
        };
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
