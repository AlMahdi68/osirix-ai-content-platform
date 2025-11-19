import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { user } from "@/db/schema";
import { eq, desc, sql } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const users = await db
      .select({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        creditsBalance: user.creditsBalance,
        planId: user.planId,
        createdAt: user.createdAt,
        emailVerified: user.emailVerified,
      })
      .from(user)
      .orderBy(desc(user.createdAt));

    return NextResponse.json({ users });
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
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
    const { userId, updates } = body;

    if (!userId || !updates) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const allowedFields = ["name", "role", "creditsBalance", "planId"];
    const sanitizedUpdates: Record<string, any> = {};
    
    for (const key of Object.keys(updates)) {
      if (allowedFields.includes(key)) {
        sanitizedUpdates[key] = updates[key];
      }
    }

    if (Object.keys(sanitizedUpdates).length === 0) {
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 }
      );
    }

    const [updatedUser] = await db
      .update(user)
      .set(sanitizedUpdates)
      .where(eq(user.id, userId))
      .returning();

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error("Failed to update user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}
