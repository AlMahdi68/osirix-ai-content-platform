import { db } from '@/db';
import { sponsorshipOpportunities } from '@/db/schema';

async function main() {
    const sampleOpportunities = [
        {
            brandUserId: 'demo-user-1',
            title: 'Summer Fashion Collection Launch - Instagram Campaign',
            description: 'Premium streetwear brand seeking fashion influencers to showcase our new summer collection through Instagram posts and stories with authentic styling tips.',
            category: 'fashion',
            budgetMin: 50000,
            budgetMax: 120000,
            requirements: {
                min_followers: 25000,
                platforms: ['instagram'],
                engagement_rate: '4%',
                content_types: ['posts', 'stories', 'reels']
            },
            durationDays: 30,
            slotsAvailable: 5,
            slotsFilled: 2,
            status: 'active',
            createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
            brandUserId: 'demo-user-2',
            title: 'Tech Gadget Review Series - YouTube Partnership',
            description: 'Innovative tech startup looking for tech reviewers to create detailed unboxing and review videos of our new smart home devices with honest feedback.',
            category: 'tech',
            budgetMin: 80000,
            budgetMax: 200000,
            requirements: {
                min_followers: 50000,
                platforms: ['youtube'],
                engagement_rate: '5%',
                content_types: ['reviews', 'unboxing']
            },
            durationDays: 45,
            slotsAvailable: 3,
            slotsFilled: 0,
            status: 'active',
            createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
            brandUserId: 'demo-user-3',
            title: 'Fitness Challenge - TikTok Workout Series',
            description: 'Leading fitness brand launching 30-day workout challenge. Seeking energetic fitness creators to create engaging TikTok content featuring our workout programs.',
            category: 'fitness',
            budgetMin: 30000,
            budgetMax: 75000,
            requirements: {
                min_followers: 15000,
                platforms: ['tiktok', 'instagram'],
                engagement_rate: '6%',
                content_types: ['videos', 'challenges']
            },
            durationDays: 60,
            slotsAvailable: 8,
            slotsFilled: 3,
            status: 'active',
            createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
            brandUserId: 'demo-user-1',
            title: 'Luxury Skincare Line - Beauty Influencer Campaign',
            description: 'High-end skincare brand seeking beauty influencers for product review videos showcasing our organic skincare routine with before/after results.',
            category: 'beauty',
            budgetMin: 40000,
            budgetMax: 90000,
            requirements: {
                min_followers: 30000,
                platforms: ['instagram', 'youtube'],
                engagement_rate: '5%',
                content_types: ['tutorials', 'reviews']
            },
            durationDays: 21,
            slotsAvailable: 6,
            slotsFilled: 6,
            status: 'completed',
            createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
            brandUserId: 'demo-user-2',
            title: 'Mobile Gaming Tournament - Twitch Streaming',
            description: 'Esports gaming platform hosting tournament series. Need gaming streamers to broadcast gameplay sessions and engage with gaming community live.',
            category: 'gaming',
            budgetMin: 60000,
            budgetMax: 150000,
            requirements: {
                min_followers: 40000,
                platforms: ['twitch', 'youtube'],
                engagement_rate: '7%',
                content_types: ['live_streams', 'highlights']
            },
            durationDays: 90,
            slotsAvailable: 4,
            slotsFilled: 1,
            status: 'active',
            createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
            brandUserId: 'demo-user-3',
            title: 'Sustainable Living Blog Series',
            description: 'Eco-friendly lifestyle brand promoting sustainable products. Looking for lifestyle bloggers to create authentic content about green living and our products.',
            category: 'lifestyle',
            budgetMin: 35000,
            budgetMax: 80000,
            requirements: {
                min_followers: 20000,
                platforms: ['instagram', 'tiktok'],
                engagement_rate: '4.5%',
                content_types: ['posts', 'stories', 'blogs']
            },
            durationDays: 45,
            slotsAvailable: 7,
            slotsFilled: 2,
            status: 'active',
            createdAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
            brandUserId: 'demo-user-1',
            title: 'Travel Destination Showcase - Instagram Travel Diary',
            description: 'Luxury resort chain seeking travel influencers to document their stays at our properties with stunning photography and authentic travel experiences.',
            category: 'travel',
            budgetMin: 70000,
            budgetMax: 180000,
            requirements: {
                min_followers: 35000,
                platforms: ['instagram', 'youtube'],
                engagement_rate: '5.5%',
                content_types: ['vlogs', 'photography', 'stories']
            },
            durationDays: 14,
            slotsAvailable: 3,
            slotsFilled: 0,
            status: 'paused',
            createdAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
            brandUserId: 'demo-user-2',
            title: 'Gourmet Food Delivery - Recipe Creation Series',
            description: 'Premium meal kit service looking for food creators to develop unique recipes using our ingredients with step-by-step cooking videos and taste tests.',
            category: 'food',
            budgetMin: 45000,
            budgetMax: 100000,
            requirements: {
                min_followers: 25000,
                platforms: ['instagram', 'youtube', 'tiktok'],
                engagement_rate: '6%',
                content_types: ['cooking_videos', 'recipes', 'reviews']
            },
            durationDays: 30,
            slotsAvailable: 5,
            slotsFilled: 4,
            status: 'active',
            createdAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
            brandUserId: 'demo-user-3',
            title: 'Smartwatch Fitness Tracking Campaign',
            description: 'Wearable tech company launching new smartwatch. Need tech and fitness influencers to showcase advanced health tracking features during real workouts.',
            category: 'tech',
            budgetMin: 55000,
            budgetMax: 130000,
            requirements: {
                min_followers: 30000,
                platforms: ['instagram', 'youtube'],
                engagement_rate: '4%',
                content_types: ['reviews', 'tutorials', 'demos']
            },
            durationDays: 60,
            slotsAvailable: 6,
            slotsFilled: 6,
            status: 'completed',
            createdAt: new Date(Date.now() - 55 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
            brandUserId: 'demo-user-1',
            title: 'Athleisure Wear Launch - Multi-Platform Campaign',
            description: 'New athleisure brand seeking fashion and fitness influencers to model our versatile clothing line across Instagram, TikTok with styling ideas.',
            category: 'fashion',
            budgetMin: 20000,
            budgetMax: 50000,
            requirements: {
                min_followers: 10000,
                platforms: ['instagram', 'tiktok'],
                engagement_rate: '3%',
                content_types: ['lookbooks', 'styling_videos']
            },
            durationDays: 30,
            slotsAvailable: 10,
            slotsFilled: 0,
            status: 'cancelled',
            createdAt: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
            brandUserId: 'demo-user-2',
            title: 'Organic Beauty Products - Clean Beauty Movement',
            description: 'Natural cosmetics brand promoting clean beauty products. Seeking beauty influencers passionate about organic ingredients to create honest product reviews.',
            category: 'beauty',
            budgetMin: 38000,
            budgetMax: 85000,
            requirements: {
                min_followers: 22000,
                platforms: ['instagram', 'tiktok'],
                engagement_rate: '5%',
                content_types: ['reviews', 'tutorials', 'get_ready_with_me']
            },
            durationDays: 45,
            slotsAvailable: 7,
            slotsFilled: 5,
            status: 'active',
            createdAt: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
            brandUserId: 'demo-user-3',
            title: 'Home Automation Ecosystem - Smart Home Tour',
            description: 'Smart home technology company looking for tech creators to showcase complete home automation setup with installation guides and daily use scenarios.',
            category: 'tech',
            budgetMin: 90000,
            budgetMax: 220000,
            requirements: {
                min_followers: 60000,
                platforms: ['youtube'],
                engagement_rate: '6%',
                content_types: ['tutorials', 'reviews', 'home_tours']
            },
            durationDays: 75,
            slotsAvailable: 3,
            slotsFilled: 1,
            status: 'active',
            createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        },
    ];

    await db.insert(sponsorshipOpportunities).values(sampleOpportunities);
    
    console.log('✅ Sponsorship opportunities seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});