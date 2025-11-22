// OZ - The Intelligent AI Assistant for Money-Making Strategies
import { generateChatCompletion } from '../ai-clients';
import { logger } from '../logger';

interface UserProfile {
  userId: string;
  connectedPlatforms: string[];
  contentHistory: {
    logos: number;
    products: number;
    characters: number;
    videos: number;
    campaigns: number;
  };
  currentPlan: string;
  creditsRemaining: number;
  accountAge: number; // days
}

interface OZRecommendation {
  priority: 'critical' | 'high' | 'medium' | 'low';
  category: string;
  title: string;
  description: string;
  actionSteps: string[];
  estimatedRevenue: string;
  timeToImplement: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export class OZAssistant {
  // Analyze user profile and generate personalized recommendations
  async generateRecommendations(profile: UserProfile): Promise<OZRecommendation[]> {
    logger.info({
      service: 'OZ Assistant',
      action: 'generate_recommendations',
      userId: profile.userId,
    });

    const prompt = this.buildRecommendationPrompt(profile);
    
    try {
      const response = await generateChatCompletion(
        [
          {
            role: 'system',
            content: `You are OZ, the Wizard of Osirix - an expert AI business consultant specializing in helping creators make money online. You provide data-driven, actionable recommendations based on user behavior, platform connections, and content creation history. Always be specific, realistic, and focus on monetization strategies.`,
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        {
          model: 'gpt-4-turbo',
          temperature: 0.8,
          maxTokens: 2000,
        }
      );

      // Parse AI response into structured recommendations
      const recommendations = this.parseRecommendations(response);
      
      logger.info({
        service: 'OZ Assistant',
        action: 'recommendations_generated',
        userId: profile.userId,
        count: recommendations.length,
      });

      return recommendations;
    } catch (error) {
      logger.error({
        service: 'OZ Assistant',
        action: 'generate_recommendations_failed',
        userId: profile.userId,
        error: error instanceof Error ? error.message : String(error),
      });
      
      // Return fallback recommendations
      return this.getFallbackRecommendations(profile);
    }
  }

  // Get personalized strategy based on user goals
  async getPersonalizedStrategy(
    profile: UserProfile,
    goal: string,
    timeframe: '30days' | '90days' | '1year'
  ): Promise<{
    overview: string;
    phases: Array<{
      phase: string;
      duration: string;
      goals: string[];
      actions: string[];
      expectedRevenue: string;
    }>;
    keyMetrics: string[];
    commonPitfalls: string[];
  }> {
    logger.info({
      service: 'OZ Assistant',
      action: 'generate_strategy',
      userId: profile.userId,
      goal,
      timeframe,
    });

    const prompt = `User Profile:
- Connected Platforms: ${profile.connectedPlatforms.join(', ') || 'None'}
- Content Created: ${profile.contentHistory.logos} logos, ${profile.contentHistory.products} products, ${profile.contentHistory.characters} characters, ${profile.contentHistory.videos} videos, ${profile.contentHistory.campaigns} campaigns
- Current Plan: ${profile.currentPlan}
- Credits: ${profile.creditsRemaining}
- Account Age: ${profile.accountAge} days

Goal: ${goal}
Timeframe: ${timeframe}

Create a detailed ${timeframe} action plan to achieve this goal. Include specific phases, milestones, and revenue projections. Format as JSON with structure:
{
  "overview": "brief overview",
  "phases": [{"phase": "Phase 1", "duration": "X weeks", "goals": [], "actions": [], "expectedRevenue": "$X-Y"}],
  "keyMetrics": ["metric1", "metric2"],
  "commonPitfalls": ["pitfall1", "pitfall2"]
}`;

    try {
      const response = await generateChatCompletion(
        [
          {
            role: 'system',
            content: `You are OZ, an expert business strategist. Create actionable, realistic plans with specific revenue projections based on industry data.`,
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        {
          model: 'gpt-4-turbo',
          temperature: 0.7,
        }
      );

      return this.parseStrategy(response);
    } catch (error) {
      logger.error({
        service: 'OZ Assistant',
        action: 'generate_strategy_failed',
        error: error instanceof Error ? error.message : String(error),
      });
      
      return this.getFallbackStrategy(timeframe);
    }
  }

  // Analyze content performance and suggest improvements
  async analyzeContent(
    contentType: string,
    contentData: any,
    performanceMetrics?: {
      views?: number;
      engagement?: number;
      conversions?: number;
    }
  ): Promise<{
    score: number;
    strengths: string[];
    improvements: string[];
    optimizedVersion?: string;
  }> {
    logger.info({
      service: 'OZ Assistant',
      action: 'analyze_content',
      contentType,
    });

    const prompt = `Analyze this ${contentType} content and provide actionable feedback:

Content: ${JSON.stringify(contentData)}
${performanceMetrics ? `Performance: ${JSON.stringify(performanceMetrics)}` : ''}

Provide:
1. Quality score (0-100)
2. Top 3 strengths
3. Top 5 actionable improvements
4. Optimized version (if applicable)

Format as JSON.`;

    try {
      const response = await generateChatCompletion(
        [
          {
            role: 'system',
            content: `You are OZ, an expert content analyst. Provide specific, actionable feedback to maximize engagement and monetization.`,
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        {
          model: 'gpt-4-turbo',
          temperature: 0.6,
        }
      );

      return this.parseContentAnalysis(response);
    } catch (error) {
      logger.error({
        service: 'OZ Assistant',
        action: 'analyze_content_failed',
        error: error instanceof Error ? error.message : String(error),
      });
      
      return {
        score: 70,
        strengths: ['Good foundation'],
        improvements: ['Optimize for SEO', 'Add clear CTA', 'Improve headline'],
      };
    }
  }

  // Get quick tips based on user action
  async getQuickTip(action: string, context?: any): Promise<string> {
    const tips: Record<string, string> = {
      'create_logo': '💡 Tip: Logos with 2-3 colors perform 47% better. Include your brand name for instant recognition!',
      'create_product': '💡 Tip: Products priced between $27-$97 convert best. Include social proof and clear benefits!',
      'create_video': '💡 Tip: First 3 seconds are critical! Hook viewers immediately with a bold statement or question.',
      'schedule_post': '💡 Tip: Best posting times: Instagram 11am-1pm, Twitter 12pm-3pm, LinkedIn 8am-10am weekdays.',
      'create_campaign': '💡 Tip: Multi-platform campaigns generate 3.2x more engagement. Start with 2-3 complementary platforms!',
    };

    return tips[action] || '💡 Tip: Consistency is key! Daily content creation builds momentum and audience trust.';
  }

  // Private helper methods

  private buildRecommendationPrompt(profile: UserProfile): string {
    const platformAnalysis = profile.connectedPlatforms.length > 0
      ? `User has connected: ${profile.connectedPlatforms.join(', ')}`
      : 'User has not connected any platforms yet';

    const contentAnalysis = `Content created: ${profile.contentHistory.logos} logos, ${profile.contentHistory.products} products, ${profile.contentHistory.characters} characters, ${profile.contentHistory.videos} videos, ${profile.contentHistory.campaigns} campaigns`;

    return `Analyze this creator's profile and provide 5 specific, actionable recommendations to maximize their earnings:

${platformAnalysis}
${contentAnalysis}
Plan: ${profile.currentPlan}
Credits: ${profile.creditsRemaining}
Experience: ${profile.accountAge} days

For each recommendation, provide:
1. Priority level (critical/high/medium/low)
2. Category (platform, content, automation, monetization, marketing)
3. Clear title
4. Detailed description
5. Step-by-step action steps
6. Estimated monthly revenue potential
7. Time to implement
8. Difficulty level

Focus on highest ROI opportunities based on their current assets and connections.`;
  }

  private parseRecommendations(aiResponse: string): OZRecommendation[] {
    // Try to parse JSON response
    try {
      const jsonMatch = aiResponse.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (error) {
      // Fall through to text parsing
    }

    // Fallback: Parse text response
    const recommendations: OZRecommendation[] = [];
    const sections = aiResponse.split(/\d+\./);

    sections.slice(1, 6).forEach((section, index) => {
      recommendations.push({
        priority: index === 0 ? 'high' : index === 1 ? 'medium' : 'low',
        category: this.extractCategory(section),
        title: this.extractTitle(section),
        description: this.extractDescription(section),
        actionSteps: this.extractActionSteps(section),
        estimatedRevenue: this.extractRevenue(section),
        timeToImplement: this.extractTimeframe(section),
        difficulty: 'medium',
      });
    });

    return recommendations;
  }

  private parseStrategy(aiResponse: string): any {
    try {
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (error) {
      // Return fallback
    }

    return this.getFallbackStrategy('90days');
  }

  private parseContentAnalysis(aiResponse: string): any {
    try {
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (error) {
      // Return fallback
    }

    return {
      score: 75,
      strengths: ['Clear message', 'Good structure'],
      improvements: ['Add more engaging hook', 'Include data/statistics', 'Strengthen call-to-action'],
    };
  }

  private extractCategory(text: string): string {
    const categories = ['platform', 'content', 'automation', 'monetization', 'marketing'];
    for (const cat of categories) {
      if (text.toLowerCase().includes(cat)) return cat;
    }
    return 'general';
  }

  private extractTitle(text: string): string {
    const lines = text.split('\n');
    return lines[0].trim().substring(0, 100);
  }

  private extractDescription(text: string): string {
    return text.substring(0, 300).trim();
  }

  private extractActionSteps(text: string): string[] {
    const steps: string[] = [];
    const lines = text.split('\n');
    
    lines.forEach(line => {
      if (line.match(/^[-•*\d]/)) {
        steps.push(line.replace(/^[-•*\d.)\s]+/, '').trim());
      }
    });

    return steps.slice(0, 5);
  }

  private extractRevenue(text: string): string {
    const match = text.match(/\$[\d,]+-[\d,]+/);
    return match ? match[0] : '$500-2000';
  }

  private extractTimeframe(text: string): string {
    if (text.includes('1-2 weeks')) return '1-2 weeks';
    if (text.includes('2-4 weeks')) return '2-4 weeks';
    if (text.includes('1 month')) return '1 month';
    return '2-3 weeks';
  }

  private getFallbackRecommendations(profile: UserProfile): OZRecommendation[] {
    const recommendations: OZRecommendation[] = [];

    // No platforms connected
    if (profile.connectedPlatforms.length === 0) {
      recommendations.push({
        priority: 'critical',
        category: 'platform',
        title: 'Connect Your First Social Media Platform',
        description: 'Start monetizing by connecting at least one platform. YouTube and Instagram offer the highest earning potential for creators.',
        actionSteps: [
          'Go to Social Media page',
          'Click "Connect Account" for YouTube or Instagram',
          'Authorize Osirix to post on your behalf',
          'Verify connection is successful',
        ],
        estimatedRevenue: '$0-500/month initially',
        timeToImplement: '10 minutes',
        difficulty: 'easy',
      });
    }

    // Low content creation
    if (profile.contentHistory.logos < 3) {
      recommendations.push({
        priority: 'high',
        category: 'content',
        title: 'Create Professional Logos to Sell',
        description: 'Logo design is in high demand. Create 10-20 logo variations to build your portfolio and start selling.',
        actionSteps: [
          'Use AI Logo Generator to create 5 logos daily',
          'Focus on popular niches: tech, fitness, food',
          'List logos on marketplace at $50-200 each',
          'Promote on connected social platforms',
        ],
        estimatedRevenue: '$500-2000/month',
        timeToImplement: '2-3 weeks',
        difficulty: 'medium',
      });
    }

    // No automation
    if (profile.contentHistory.campaigns === 0) {
      recommendations.push({
        priority: 'high',
        category: 'automation',
        title: 'Set Up Your First Automated Campaign',
        description: 'Automate content posting to work while you sleep. Campaigns generate consistent engagement and sales.',
        actionSteps: [
          'Create a 30-day content calendar',
          'Use AI Manager to schedule daily posts',
          'Set up automated product promotions',
          'Monitor performance weekly',
        ],
        estimatedRevenue: '$300-1500/month',
        timeToImplement: '1 week',
        difficulty: 'medium',
      });
    }

    // Monetization opportunity
    recommendations.push({
      priority: 'medium',
      category: 'monetization',
      title: 'Launch Your Digital Product Store',
      description: 'Turn your AI-generated content into sellable digital products. Average creators earn $1000-5000/month.',
      actionSteps: [
        'Create 10 high-quality digital products',
        'Set competitive pricing ($10-$100)',
        'List on Osirix marketplace',
        'Drive traffic from social media',
        'Offer limited-time discounts',
      ],
      estimatedRevenue: '$1000-5000/month',
      timeToImplement: '2-4 weeks',
      difficulty: 'medium',
    });

    return recommendations.slice(0, 5);
  }

  private getFallbackStrategy(timeframe: string): any {
    return {
      overview: `Build a sustainable content business over ${timeframe} by leveraging AI tools, social media, and marketplace sales.`,
      phases: [
        {
          phase: 'Foundation (Weeks 1-2)',
          duration: '2 weeks',
          goals: ['Connect 2-3 social platforms', 'Create first 20 pieces of content', 'Set up marketplace profile'],
          actions: [
            'Connect YouTube and Instagram accounts',
            'Generate 10 logos and 10 product concepts',
            'Complete marketplace seller profile',
            'Post daily on connected platforms',
          ],
          expectedRevenue: '$0-200',
        },
        {
          phase: 'Growth (Weeks 3-6)',
          duration: '4 weeks',
          goals: ['Build audience to 1000 followers', 'Make first 10 sales', 'Launch automated campaign'],
          actions: [
            'Post 2-3 times daily',
            'Engage with audience comments',
            'List 50 products on marketplace',
            'Run promotional campaigns',
          ],
          expectedRevenue: '$500-1500',
        },
        {
          phase: 'Scale (Weeks 7-12)',
          duration: '6 weeks',
          goals: ['Reach 5000 followers', 'Generate $3000+/month', 'Fully automate content'],
          actions: [
            'Use AI Manager for 100% automation',
            'Expand to all major platforms',
            'Launch premium product line',
            'Build email list for marketing',
          ],
          expectedRevenue: '$2000-5000',
        },
      ],
      keyMetrics: ['Follower growth rate', 'Engagement rate', 'Conversion rate', 'Revenue per post', 'Product sales'],
      commonPitfalls: ['Posting inconsistently', 'Ignoring audience feedback', 'Pricing too low', 'Not tracking metrics'],
    };
  }
}

export const ozAssistant = new OZAssistant();
