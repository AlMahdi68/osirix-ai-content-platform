import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { socialPosts, socialAccounts } from '@/db/schema';
import { eq, and, gte, lte, sql } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

interface PlatformMetrics {
  posts: number;
  impressions: number;
  engagements: number;
  clicks: number;
  engagementRate: number;
}

interface AnalyticsResponse {
  totalPosts: number;
  totalImpressions: number;
  totalEngagements: number;
  totalClicks: number;
  avgEngagementRate: number;
  byPlatform: Record<string, PlatformMetrics>;
  dateRange?: {
    start: string;
    end: string;
  };
}

export async function GET(request: NextRequest) {
  try {
    // Authenticate user
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const platform = searchParams.get('platform');

    // Validate date formats
    if (startDate && isNaN(Date.parse(startDate))) {
      return NextResponse.json(
        { error: 'Invalid startDate format. Expected ISO timestamp.', code: 'INVALID_START_DATE' },
        { status: 400 }
      );
    }

    if (endDate && isNaN(Date.parse(endDate))) {
      return NextResponse.json(
        { error: 'Invalid endDate format. Expected ISO timestamp.', code: 'INVALID_END_DATE' },
        { status: 400 }
      );
    }

    // Build query conditions
    const conditions = [
      eq(socialPosts.userId, userId),
      eq(socialPosts.status, 'published'),
    ];

    if (startDate) {
      conditions.push(gte(socialPosts.publishedAt, startDate));
    }

    if (endDate) {
      conditions.push(lte(socialPosts.publishedAt, endDate));
    }

    if (platform) {
      conditions.push(eq(socialPosts.platform, platform));
    }

    // Fetch all published posts for the user with filters
    const posts = await db
      .select()
      .from(socialPosts)
      .where(and(...conditions));

    // Handle no posts case
    if (posts.length === 0) {
      const response: AnalyticsResponse = {
        totalPosts: 0,
        totalImpressions: 0,
        totalEngagements: 0,
        totalClicks: 0,
        avgEngagementRate: 0,
        byPlatform: {},
      };

      if (startDate || endDate) {
        response.dateRange = {
          start: startDate || '',
          end: endDate || '',
        };
      }

      return NextResponse.json(response, { status: 200 });
    }

    // Calculate aggregated metrics
    let totalImpressions = 0;
    let totalEngagements = 0;
    let totalClicks = 0;
    const platformData: Record<string, {
      posts: number;
      impressions: number;
      engagements: number;
      clicks: number;
    }> = {};

    for (const post of posts) {
      totalImpressions += post.impressions || 0;
      totalEngagements += post.engagements || 0;
      totalClicks += post.clicks || 0;

      // Group by platform
      const platformKey = post.platform;
      if (!platformData[platformKey]) {
        platformData[platformKey] = {
          posts: 0,
          impressions: 0,
          engagements: 0,
          clicks: 0,
        };
      }

      platformData[platformKey].posts += 1;
      platformData[platformKey].impressions += post.impressions || 0;
      platformData[platformKey].engagements += post.engagements || 0;
      platformData[platformKey].clicks += post.clicks || 0;
    }

    // Calculate average engagement rate (handle division by zero)
    const avgEngagementRate = totalImpressions > 0 
      ? parseFloat(((totalEngagements / totalImpressions) * 100).toFixed(2))
      : 0;

    // Calculate by-platform metrics with engagement rates
    const byPlatform: Record<string, PlatformMetrics> = {};
    for (const [platformKey, data] of Object.entries(platformData)) {
      const platformEngagementRate = data.impressions > 0
        ? parseFloat(((data.engagements / data.impressions) * 100).toFixed(2))
        : 0;

      byPlatform[platformKey] = {
        posts: data.posts,
        impressions: data.impressions,
        engagements: data.engagements,
        clicks: data.clicks,
        engagementRate: platformEngagementRate,
      };
    }

    // Build response
    const response: AnalyticsResponse = {
      totalPosts: posts.length,
      totalImpressions,
      totalEngagements,
      totalClicks,
      avgEngagementRate,
      byPlatform,
    };

    // Add date range if filters were applied
    if (startDate || endDate) {
      response.dateRange = {
        start: startDate || '',
        end: endDate || '',
      };
    }

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('GET /api/social/analytics error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error'),
        code: 'INTERNAL_SERVER_ERROR'
      },
      { status: 500 }
    );
  }
}