import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { avatars } from "@/db/schema";
import { eq, and, or } from "drizzle-orm";

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
    const avatarId = parseInt(id);

    if (isNaN(avatarId)) {
      return NextResponse.json({ error: "Invalid avatar ID" }, { status: 400 });
    }

    const [avatar] = await db
      .select()
      .from(avatars)
      .where(
        and(
          eq(avatars.id, avatarId),
          or(
            eq(avatars.ownerUserId, session.user.id),
            eq(avatars.sourceType, "stock")
          )
        )
      );

    if (!avatar) {
      return NextResponse.json({ error: "Avatar not found" }, { status: 404 });
    }

    return NextResponse.json({ avatar });
  } catch (error) {
    console.error("Failed to fetch avatar:", error);
    return NextResponse.json(
      { error: "Failed to fetch avatar" },
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
    const avatarId = parseInt(id);

    if (isNaN(avatarId)) {
      return NextResponse.json({ error: "Invalid avatar ID" }, { status: 400 });
    }

    const body = await request.json();
    const { name, metadata } = body;

    const [avatar] = await db
      .select()
      .from(avatars)
      .where(
        and(
          eq(avatars.id, avatarId),
          eq(avatars.ownerUserId, session.user.id)
        )
      );

    if (!avatar) {
      return NextResponse.json({ error: "Avatar not found" }, { status: 404 });
    }

    const updates: Record<string, any> = {};
    if (name) updates.name = name;
    if (metadata) updates.metadata = metadata;

    const [updatedAvatar] = await db
      .update(avatars)
      .set(updates)
      .where(eq(avatars.id, avatarId))
      .returning();

    return NextResponse.json({ avatar: updatedAvatar });
  } catch (error) {
    console.error("Failed to update avatar:", error);
    return NextResponse.json(
      { error: "Failed to update avatar" },
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
    const avatarId = parseInt(id);

    if (isNaN(avatarId)) {
      return NextResponse.json({ error: "Invalid avatar ID" }, { status: 400 });
    }

    const [avatar] = await db
      .select()
      .from(avatars)
      .where(
        and(
          eq(avatars.id, avatarId),
          eq(avatars.ownerUserId, session.user.id)
        )
      );

    if (!avatar) {
      return NextResponse.json({ error: "Avatar not found" }, { status: 404 });
    }

    // Prevent deletion of stock avatars
    if (avatar.sourceType === "stock") {
      return NextResponse.json(
        { error: "Cannot delete stock avatars" },
        { status: 400 }
      );
    }

    await db.delete(avatars).where(eq(avatars.id, avatarId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete avatar:", error);
    return NextResponse.json(
      { error: "Failed to delete avatar" },
      { status: 500 }
    );
  }
}
