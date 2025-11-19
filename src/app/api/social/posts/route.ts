import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { socialPosts } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userPosts = await db
      .select()
      .from(socialPosts)
      .where(eq(socialPosts.userId, session.user.id))
      .orderBy(desc(socialPosts.createdAt));

    return NextResponse.json({ posts: userPosts });
  } catch (error) {
    console.error("Failed to fetch social posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
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
    const { platform, content, scheduledAt, mediaUrls } = body;

    if (!platform || !content) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    const [post] = await db
      .insert(socialPosts)
      .values({
        userId: session.user.id,
        platform,
        content,
        mediaUrls: mediaUrls || [],
        scheduledAt: scheduledAt || null,
        status: scheduledAt ? "scheduled" : "draft",
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    return NextResponse.json({ post }, { status: 201 });
  } catch (error) {
    console.error("Failed to create social post:", error);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}
