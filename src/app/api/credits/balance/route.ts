import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { creditsLedger } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the latest balance from credits ledger
    const latestEntry = await db
      .select()
      .from(creditsLedger)
      .where(eq(creditsLedger.userId, session.user.id))
      .orderBy(desc(creditsLedger.createdAt))
      .limit(1);

    const balance = latestEntry.length > 0 ? latestEntry[0].balanceAfter : 0;

    return NextResponse.json({ balance });
  } catch (error) {
    console.error("Failed to fetch credits balance:", error);
    return NextResponse.json(
      { error: "Failed to fetch balance" },
      { status: 500 }
    );
  }
}
