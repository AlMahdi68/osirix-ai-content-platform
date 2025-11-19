import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { jobs, creditsLedger } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "50");

    const userJobs = await db
      .select()
      .from(jobs)
      .where(eq(jobs.userId, session.user.id))
      .orderBy(desc(jobs.createdAt))
      .limit(limit);

    return NextResponse.json({ jobs: userJobs });
  } catch (error) {
    console.error("Failed to fetch jobs:", error);
    return NextResponse.json(
      { error: "Failed to fetch jobs" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { type, inputData, creditsRequired } = body;

    if (!type || !inputData || !creditsRequired) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check credits balance
    const latestCredit = await db
      .select()
      .from(creditsLedger)
      .where(eq(creditsLedger.userId, session.user.id))
      .orderBy(desc(creditsLedger.createdAt))
      .limit(1);

    const currentBalance = latestCredit.length > 0 ? latestCredit[0].balanceAfter : 0;

    if (currentBalance < creditsRequired) {
      return NextResponse.json(
        { error: "Insufficient credits" },
        { status: 402 }
      );
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

    return NextResponse.json({ job }, { status: 201 });
  } catch (error) {
    console.error("Failed to create job:", error);
    return NextResponse.json(
      { error: "Failed to create job" },
      { status: 500 }
    );
  }
}
