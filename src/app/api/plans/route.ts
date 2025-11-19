import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { plans } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const activePlans = await db
      .select()
      .from(plans)
      .where(eq(plans.isActive, true));

    return NextResponse.json({ plans: activePlans });
  } catch (error) {
    console.error("Failed to fetch plans:", error);
    return NextResponse.json(
      { error: "Failed to fetch plans" },
      { status: 500 }
    );
  }
}
