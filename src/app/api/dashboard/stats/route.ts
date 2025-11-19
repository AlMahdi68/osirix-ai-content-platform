import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { creditsLedger, jobs, avatars, products, orders } from "@/db/schema";
import { eq, desc, and, sql } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Get credits balance
    const latestCredit = await db
      .select()
      .from(creditsLedger)
      .where(eq(creditsLedger.userId, userId))
      .orderBy(desc(creditsLedger.createdAt))
      .limit(1);

    const credits = latestCredit.length > 0 ? latestCredit[0].balanceAfter : 0;

    // Get job stats
    const allJobs = await db
      .select()
      .from(jobs)
      .where(eq(jobs.userId, userId));

    const totalJobs = allJobs.length;
    const completedJobs = allJobs.filter((j) => j.status === "completed").length;
    const failedJobs = allJobs.filter((j) => j.status === "failed").length;

    // Get avatars count
    const userAvatars = await db
      .select()
      .from(avatars)
      .where(eq(avatars.userId, userId));

    const avatarsCount = userAvatars.length;

    // Get products count
    const userProducts = await db
      .select()
      .from(products)
      .where(eq(products.sellerId, userId));

    const productsCount = userProducts.length;

    // Calculate total sales (simplified - in production would need proper join)
    let totalSales = 0;
    for (const product of userProducts) {
      const productOrders = await db
        .select()
        .from(orders)
        .where(and(eq(orders.productId, product.id), eq(orders.status, "completed")));
      
      totalSales += productOrders.reduce((sum, order) => sum + order.amount, 0);
    }

    return NextResponse.json({
      credits,
      totalJobs,
      completedJobs,
      failedJobs,
      avatarsCount,
      productsCount,
      totalSales,
    });
  } catch (error) {
    console.error("Failed to fetch dashboard stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
