import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { socialPosts } from "@/db/schema";
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
    const postId = parseInt(id);

    if (isNaN(postId)) {
      return NextResponse.json({ error: "Invalid post ID" }, { status: 400 });
    }

    const [post] = await db
      .select()
      .from(socialPosts)
      .where(
        and(
          eq(socialPosts.id, postId),
          eq(socialPosts.userId, session.user.id)
        )
      );

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({ post });
  } catch (error) {
    console.error("Failed to fetch post:", error);
    return NextResponse.json(
      { error: "Failed to fetch post" },
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
    const postId = parseInt(id);

    if (isNaN(postId)) {
      return NextResponse.json({ error: "Invalid post ID" }, { status: 400 });
    }

    const body = await request.json();
    const { content, scheduledAt, status } = body;

    const [post] = await db
      .select()
      .from(socialPosts)
      .where(
        and(
          eq(socialPosts.id, postId),
          eq(socialPosts.userId, session.user.id)
        )
      );

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Prevent editing published posts
    if (post.status === "published") {
      return NextResponse.json(
        { error: "Cannot edit published posts" },
        { status: 400 }
      );
    }

    const updates: Record<string, any> = {
      updatedAt: new Date().toISOString()
    };
    if (content) updates.content = content;
    if (scheduledAt !== undefined) updates.scheduledAt = scheduledAt;
    if (status) updates.status = status;

    const [updatedPost] = await db
      .update(socialPosts)
      .set(updates)
      .where(eq(socialPosts.id, postId))
      .returning();

    return NextResponse.json({ post: updatedPost });
  } catch (error) {
    console.error("Failed to update post:", error);
    return NextResponse.json(
      { error: "Failed to update post" },
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
    const postId = parseInt(id);

    if (isNaN(postId)) {
      return NextResponse.json({ error: "Invalid post ID" }, { status: 400 });
    }

    const [post] = await db
      .select()
      .from(socialPosts)
      .where(
        and(
          eq(socialPosts.id, postId),
          eq(socialPosts.userId, session.user.id)
        )
      );

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Allow deletion of draft and scheduled posts only
    if (post.status === "published") {
      return NextResponse.json(
        { error: "Cannot delete published posts" },
        { status: 400 }
      );
    }

    await db.delete(socialPosts).where(eq(socialPosts.id, postId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete post:", error);
    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 }
    );
  }
}
