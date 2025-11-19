import { db } from '@/db';
import { avatars } from '@/db/schema';

async function main() {
    const currentTimestamp = new Date().toISOString();
    
    const sampleAvatars = [
        {
            userId: 'system',
            name: 'Professional Male - Business Presenter',
            fileUrl: 'https://storage.osirix.ai/avatars/professional-male-business.mp4',
            thumbnailUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
            fileSize: 8388608,
            duration: 45,
            mimeType: 'video/mp4',
            metadata: {
                style: 'professional',
                gender: 'male',
                age_range: '30-40',
                use_case: 'business'
            },
            isDefault: true,
            createdAt: currentTimestamp,
            updatedAt: currentTimestamp,
        },
        {
            userId: 'system',
            name: 'Professional Female - Corporate Trainer',
            fileUrl: 'https://storage.osirix.ai/avatars/professional-female-trainer.mp4',
            thumbnailUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400',
            fileSize: 7340032,
            duration: 50,
            mimeType: 'video/mp4',
            metadata: {
                style: 'professional',
                gender: 'female',
                age_range: '25-35',
                use_case: 'training'
            },
            isDefault: true,
            createdAt: currentTimestamp,
            updatedAt: currentTimestamp,
        },
        {
            userId: 'system',
            name: 'Young Casual - Social Media Creator',
            fileUrl: 'https://storage.osirix.ai/avatars/young-casual-social.mp4',
            thumbnailUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400',
            fileSize: 6291456,
            duration: 35,
            mimeType: 'video/mp4',
            metadata: {
                style: 'casual',
                gender: 'male',
                age_range: '20-28',
                use_case: 'social_media'
            },
            isDefault: true,
            createdAt: currentTimestamp,
            updatedAt: currentTimestamp,
        },
        {
            userId: 'system',
            name: 'Tech Expert - Tutorial Creator',
            fileUrl: 'https://storage.osirix.ai/avatars/tech-expert-tutorial.mp4',
            thumbnailUrl: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?w=400',
            fileSize: 9437184,
            duration: 60,
            mimeType: 'video/mp4',
            metadata: {
                style: 'tech',
                gender: 'male',
                age_range: '28-38',
                use_case: 'tutorials'
            },
            isDefault: true,
            createdAt: currentTimestamp,
            updatedAt: currentTimestamp,
        },
        {
            userId: 'system',
            name: 'Fashion Influencer',
            fileUrl: 'https://storage.osirix.ai/avatars/fashion-influencer.mp4',
            thumbnailUrl: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400',
            fileSize: 7864320,
            duration: 42,
            mimeType: 'video/mp4',
            metadata: {
                style: 'fashion',
                gender: 'female',
                age_range: '22-30',
                use_case: 'fashion'
            },
            isDefault: true,
            createdAt: currentTimestamp,
            updatedAt: currentTimestamp,
        },
        {
            userId: 'system',
            name: 'Fitness Coach',
            fileUrl: 'https://storage.osirix.ai/avatars/fitness-coach.mp4',
            thumbnailUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400',
            fileSize: 8912896,
            duration: 55,
            mimeType: 'video/mp4',
            metadata: {
                style: 'fitness',
                gender: 'male',
                age_range: '25-35',
                use_case: 'fitness'
            },
            isDefault: true,
            createdAt: currentTimestamp,
            updatedAt: currentTimestamp,
        },
        {
            userId: 'system',
            name: 'Educational Teacher',
            fileUrl: 'https://storage.osirix.ai/avatars/educational-teacher.mp4',
            thumbnailUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400',
            fileSize: 7077888,
            duration: 48,
            mimeType: 'video/mp4',
            metadata: {
                style: 'educational',
                gender: 'female',
                age_range: '30-45',
                use_case: 'education'
            },
            isDefault: true,
            createdAt: currentTimestamp,
            updatedAt: currentTimestamp,
        },
        {
            userId: 'system',
            name: 'News Anchor',
            fileUrl: 'https://storage.osirix.ai/avatars/news-anchor.mp4',
            thumbnailUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
            fileSize: 8650752,
            duration: 52,
            mimeType: 'video/mp4',
            metadata: {
                style: 'news',
                gender: 'male',
                age_range: '35-50',
                use_case: 'news'
            },
            isDefault: true,
            createdAt: currentTimestamp,
            updatedAt: currentTimestamp,
        },
        {
            userId: 'system',
            name: 'Product Reviewer',
            fileUrl: 'https://storage.osirix.ai/avatars/product-reviewer.mp4',
            thumbnailUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
            fileSize: 6815744,
            duration: 40,
            mimeType: 'video/mp4',
            metadata: {
                style: 'reviewer',
                gender: 'female',
                age_range: '24-32',
                use_case: 'reviews'
            },
            isDefault: true,
            createdAt: currentTimestamp,
            updatedAt: currentTimestamp,
        },
        {
            userId: 'system',
            name: 'Gaming Streamer',
            fileUrl: 'https://storage.osirix.ai/avatars/gaming-streamer.mp4',
            thumbnailUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400',
            fileSize: 10485760,
            duration: 58,
            mimeType: 'video/mp4',
            metadata: {
                style: 'gaming',
                gender: 'male',
                age_range: '20-30',
                use_case: 'gaming'
            },
            isDefault: true,
            createdAt: currentTimestamp,
            updatedAt: currentTimestamp,
        }
    ];

    await db.insert(avatars).values(sampleAvatars);
    
    console.log('✅ Avatars seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});