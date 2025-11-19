import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { avatars } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userAvatars = await db
      .select()
      .from(avatars)
      .where(eq(avatars.userId, session.user.id))
      .orderBy(desc(avatars.createdAt));

    return NextResponse.json({ avatars: userAvatars });
  } catch (error) {
    console.error("Failed to fetch avatars:", error);
    return NextResponse.json(
      { error: "Failed to fetch avatars" },
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
    const { name, fileUrl, thumbnailUrl, fileSize, duration, mimeType, metadata } = body;

    if (!name || !fileUrl || !fileSize || !mimeType) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    const [avatar] = await db
      .insert(avatars)
      .values({
        userId: session.user.id,
        name,
        fileUrl,
        thumbnailUrl: thumbnailUrl || null,
        fileSize,
        duration: duration || null,
        mimeType,
        metadata: metadata || null,
        isDefault: false,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    return NextResponse.json({ avatar }, { status: 201 });
  } catch (error) {
    console.error("Failed to create avatar:", error);
    return NextResponse.json(
      { error: "Failed to create avatar" },
      { status: 500 }
    );
  }
}
