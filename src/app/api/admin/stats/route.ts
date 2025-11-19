import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { user, jobs, products, socialPosts } from "@/db/schema";
import { sql, gte } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Total users
    const [totalUsersResult] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(user);
    const totalUsers = totalUsersResult?.count || 0;

    // Active users (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const [activeUsersResult] = await db
      .select({ count: sql<number>`count(distinct ${user.id})::int` })
      .from(user)
      .where(gte(user.createdAt, sevenDaysAgo.toISOString()));
    const activeUsers = activeUsersResult?.count || 0;

    // Total jobs
    const [totalJobsResult] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(jobs);
    const totalJobs = totalJobsResult?.count || 0;

    // Jobs by status
    const jobsByStatus = await db
      .select({
        status: jobs.status,
        count: sql<number>`count(*)::int`,
      })
      .from(jobs)
      .groupBy(jobs.status);

    // Total products
    const [totalProductsResult] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(products);
    const totalProducts = totalProductsResult?.count || 0;

    // Total social posts
    const [totalPostsResult] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(socialPosts);
    const totalPosts = totalPostsResult?.count || 0;

    // Total credits distributed
    const [totalCreditsResult] = await db
      .select({ total: sql<number>`sum(${user.creditsBalance})::int` })
      .from(user);
    const totalCredits = totalCreditsResult?.total || 0;

    return NextResponse.json({
      totalUsers,
      activeUsers,
      totalJobs,
      jobsByStatus,
      totalProducts,
      totalPosts,
      totalCredits,
    });
  } catch (error) {
    console.error("Failed to fetch admin stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
