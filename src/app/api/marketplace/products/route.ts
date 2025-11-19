import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { products } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const allProducts = await db
      .select()
      .from(products)
      .orderBy(desc(products.salesCount));

    return NextResponse.json({ products: allProducts });
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
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
    const { title, description, price, category, fileUrl, previewUrl, tags } = body;

    if (!title || !description || !price || !category || !fileUrl) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    const [product] = await db
      .insert(products)
      .values({
        sellerId: session.user.id,
        title,
        description,
        price,
        category,
        fileUrl,
        previewUrl: previewUrl || null,
        tags: tags || [],
        isPublished: false,
        salesCount: 0,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    console.error("Failed to create product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
