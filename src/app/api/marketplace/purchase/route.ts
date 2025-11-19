import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { orders, products, creditsLedger } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { productId } = body;

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID required" },
        { status: 400 }
      );
    }

    // Get product details
    const [product] = await db
      .select()
      .from(products)
      .where(eq(products.id, productId))
      .limit(1);

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
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
    const creditsRequired = Math.ceil(product.price / 10); // 1 credit = $0.10

    if (currentBalance < creditsRequired) {
      return NextResponse.json(
        { error: "Insufficient credits" },
        { status: 402 }
      );
    }

    // Create order
    const now = new Date().toISOString();
    const [order] = await db
      .insert(orders)
      .values({
        buyerId: session.user.id,
        productId: product.id,
        amount: product.price,
        status: "completed",
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    // Deduct credits
    await db.insert(creditsLedger).values({
      userId: session.user.id,
      amount: -creditsRequired,
      type: "usage",
      referenceId: order.id.toString(),
      balanceAfter: currentBalance - creditsRequired,
      createdAt: now,
    });

    // Update product sales count
    await db
      .update(products)
      .set({ 
        salesCount: product.salesCount + 1,
        updatedAt: now,
      })
      .where(eq(products.id, product.id));

    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    console.error("Failed to process purchase:", error);
    return NextResponse.json(
      { error: "Purchase failed" },
      { status: 500 }
    );
  }
}
