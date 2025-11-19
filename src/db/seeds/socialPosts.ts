import { db } from '@/db';
import { socialPosts } from '@/db/schema';

async function main() {
    const now = new Date();
    const twoDaysFromNow = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);
    twoDaysFromNow.setHours(10, 0, 0, 0);
    
    const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
    threeDaysAgo.setHours(14, 0, 0, 0);
    
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    tomorrow.setHours(17, 0, 0, 0);
    
    const fiveDaysAgo = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000);
    fiveDaysAgo.setHours(9, 0, 0, 0);

    const samplePosts = [
        {
            userId: 'demo-user-1',
            platform: 'twitter',
            content: 'Just created my first AI avatar video in minutes! 🤖✨ The lip-sync feature is incredibly realistic. Game-changer for content creators! #AIContent #VideoCreation #Osirix',
            mediaUrls: ['https://storage.osirix.ai/social/twitter-demo-1.mp4'],
            scheduledAt: twoDaysFromNow.toISOString(),
            publishedAt: null,
            status: 'scheduled',
            platformPostId: null,
            errorMessage: null,
            createdAt: now.toISOString(),
            updatedAt: now.toISOString(),
        },
        {
            userId: 'demo-user-1',
            platform: 'facebook',
            content: 'Excited to share my experience with AI-powered video creation! I\'ve been using Osirix to create professional training videos for my team, and the results are amazing. The text-to-speech quality is top-notch, and the avatar customization options are endless. Highly recommend for anyone looking to scale their video content production! 🎥✨',
            mediaUrls: ['https://storage.osirix.ai/social/facebook-demo-1.mp4', 'https://storage.osirix.ai/social/facebook-demo-1-thumb.jpg'],
            scheduledAt: threeDaysAgo.toISOString(),
            publishedAt: threeDaysAgo.toISOString(),
            status: 'published',
            platformPostId: 'fb_post_123456789',
            errorMessage: null,
            createdAt: new Date(threeDaysAgo.getTime() - 60 * 60 * 1000).toISOString(),
            updatedAt: threeDaysAgo.toISOString(),
        },
        {
            userId: 'demo-user-2',
            platform: 'instagram',
            content: 'New video alert! 📹 Using AI avatars to create engaging content has never been easier. Check out my latest tutorial on maximizing your content creation workflow. Link in bio! #ContentCreator #AITools #VideoMarketing #TechTips',
            mediaUrls: ['https://storage.osirix.ai/social/instagram-demo-1.mp4', 'https://storage.osirix.ai/social/instagram-demo-1-cover.jpg'],
            scheduledAt: tomorrow.toISOString(),
            publishedAt: null,
            status: 'scheduled',
            platformPostId: null,
            errorMessage: null,
            createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
        },
        {
            userId: 'demo-user-2',
            platform: 'linkedin',
            content: 'Transforming Corporate Training with AI 🚀\n\nOur team has been leveraging AI-generated video content to scale our employee onboarding and training programs. Key results:\n• 70% reduction in video production time\n• 85% cost savings compared to traditional video shoots\n• Consistent quality across all training materials\n\nThe future of corporate learning is here, and it\'s powered by AI. Would love to hear how others are innovating in this space!\n\n#CorporateTraining #AIInnovation #LearningAndDevelopment #DigitalTransformation',
            mediaUrls: [],
            scheduledAt: fiveDaysAgo.toISOString(),
            publishedAt: fiveDaysAgo.toISOString(),
            status: 'published',
            platformPostId: 'li_post_987654321',
            errorMessage: null,
            createdAt: new Date(fiveDaysAgo.getTime() - 3 * 60 * 60 * 1000).toISOString(),
            updatedAt: fiveDaysAgo.toISOString(),
        },
        {
            userId: 'demo-user-3',
            platform: 'twitter',
            content: 'Pro tip for content creators: Batch create your social media videos on Sunday and schedule them for the week. With AI avatars, I can create 10 videos in the time it used to take me to create 1! 📊 Productivity hack unlocked. #ProductivityHacks #ContentStrategy',
            mediaUrls: [],
            scheduledAt: null,
            publishedAt: null,
            status: 'draft',
            platformPostId: null,
            errorMessage: null,
            createdAt: new Date(now.getTime() - 30 * 60 * 1000).toISOString(),
            updatedAt: new Date(now.getTime() - 30 * 60 * 1000).toISOString(),
        },
    ];

    await db.insert(socialPosts).values(samplePosts);
    
    console.log('✅ Social posts seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});