import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { db } from '@/db';
import { aiAgentActivities } from '@/db/schema';
import { eq, desc, and } from 'drizzle-orm';

const VALID_STRATEGIES = [
  'quick_wins',
  'content_empire',
  'marketplace_seller',
  'social_growth',
  'full_automation'
] as const;

type OZStrategy = typeof VALID_STRATEGIES[number];

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const body = await request.json();
    const strategy: OZStrategy = body.strategy || 'full_automation';
    const targetRevenue: number = body.targetRevenue || 1000;

    if (!VALID_STRATEGIES.includes(strategy)) {
      return NextResponse.json(
        {
          error: `Invalid strategy. Must be one of: ${VALID_STRATEGIES.join(', ')}`,
          code: 'INVALID_STRATEGY'
        },
        { status: 400 }
      );
    }

    // Check if OZ is already running
    const recentActivities = await db.select()
      .from(aiAgentActivities)
      .where(
        and(
          eq(aiAgentActivities.userId, userId),
          eq(aiAgentActivities.type, 'oz_started'),
          eq(aiAgentActivities.result, 'pending')
        )
      )
      .orderBy(desc(aiAgentActivities.createdAt))
      .limit(1);

    if (recentActivities.length > 0) {
      return NextResponse.json(
        {
          error: 'OZ Agent is already running',
          code: 'OZ_ALREADY_RUNNING'
        },
        { status: 400 }
      );
    }

    const startedAt = new Date().toISOString();
    const description = `OZ Agent started with ${strategy} strategy (Target: $${targetRevenue}/month)`;
    const metadata = {
      strategy,
      targetRevenue,
      startedAt,
      workflows: getWorkflowsForStrategy(strategy)
    };

    const newActivity = await db.insert(aiAgentActivities)
      .values({
        userId,
        type: 'oz_started',
        description,
        result: 'pending',
        metadata: JSON.stringify(metadata),
        createdAt: startedAt,
        updatedAt: startedAt
      })
      .returning();

    if (newActivity.length === 0) {
      return NextResponse.json(
        {
          error: 'Failed to create OZ activity record',
          code: 'ACTIVITY_CREATION_FAILED'
        },
        { status: 500 }
      );
    }

    // Simulate initial workflow execution
    const initialWorkflows = [
      'analyze_user_profile',
      'identify_opportunities',
      'create_action_plan',
      'initialize_automation'
    ];

    for (const workflow of initialWorkflows) {
      await db.insert(aiAgentActivities)
        .values({
          userId,
          type: 'oz_workflow',
          description: `Executing: ${workflow.replace(/_/g, ' ')}`,
          result: 'success',
          metadata: JSON.stringify({ workflow, strategy }),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
    }

    return NextResponse.json(
      {
        message: 'OZ Agent started successfully',
        ozId: newActivity[0].id,
        strategy,
        targetRevenue,
        startedAt,
        workflows: metadata.workflows
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('OZ Start error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error'),
        code: 'INTERNAL_ERROR'
      },
      { status: 500 }
    );
  }
}

function getWorkflowsForStrategy(strategy: OZStrategy): string[] {
  const workflowMap: Record<OZStrategy, string[]> = {
    quick_wins: [
      'generate_logos_for_marketplace',
      'create_digital_products',
      'list_on_marketplace',
      'optimize_pricing'
    ],
    content_empire: [
      'create_ai_characters',
      'generate_viral_videos',
      'schedule_social_posts',
      'optimize_engagement'
    ],
    marketplace_seller: [
      'research_trending_niches',
      'generate_product_bundles',
      'create_marketing_materials',
      'automate_sales_funnel'
    ],
    social_growth: [
      'analyze_audience',
      'create_content_calendar',
      'generate_posts',
      'engage_with_followers'
    ],
    full_automation: [
      'analyze_all_opportunities',
      'generate_products',
      'create_content',
      'schedule_posts',
      'optimize_campaigns',
      'track_revenue'
    ]
  };

  return workflowMap[strategy];
}
