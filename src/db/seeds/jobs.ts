import { db } from '@/db';
import { jobs } from '@/db/schema';

async function main() {
    const now = new Date();
    const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
    const oneDayAgo = new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000);
    const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
    const fiveHoursAgo = new Date(now.getTime() - 5 * 60 * 60 * 1000);
    const sixHoursAgo = new Date(now.getTime() - 6 * 60 * 60 * 1000);
    const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
    const fourDaysAgo = new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000);

    const sampleJobs = [
        {
            userId: 'demo-user-1',
            type: 'tts',
            status: 'completed',
            inputData: {
                text: 'Welcome to our product tutorial. In this video, we\'ll show you how to get started with our platform.',
                voice: 'professional-female',
                language: 'en-US',
                speed: 1.0
            },
            outputData: {
                audioUrl: 'https://storage.osirix.ai/outputs/tts-abc123.mp3',
                duration: 12,
                fileSize: 384000
            },
            creditsReserved: 10,
            creditsCharged: 10,
            errorMessage: null,
            progress: 100,
            startedAt: new Date(twoDaysAgo.getFullYear(), twoDaysAgo.getMonth(), twoDaysAgo.getDate(), 10, 30, 0).toISOString(),
            completedAt: new Date(twoDaysAgo.getFullYear(), twoDaysAgo.getMonth(), twoDaysAgo.getDate(), 10, 32, 0).toISOString(),
            createdAt: new Date(twoDaysAgo.getFullYear(), twoDaysAgo.getMonth(), twoDaysAgo.getDate(), 10, 29, 0).toISOString(),
            updatedAt: new Date(twoDaysAgo.getFullYear(), twoDaysAgo.getMonth(), twoDaysAgo.getDate(), 10, 32, 0).toISOString(),
        },
        {
            userId: 'demo-user-1',
            type: 'video',
            status: 'completed',
            inputData: {
                script: 'Hello everyone! Today I\'m going to show you the top 5 productivity tips for remote workers.',
                avatarId: 3,
                background: 'office-modern',
                resolution: '1080p'
            },
            outputData: {
                videoUrl: 'https://storage.osirix.ai/outputs/video-def456.mp4',
                duration: 45,
                fileSize: 15728640,
                thumbnailUrl: 'https://storage.osirix.ai/outputs/video-def456-thumb.jpg'
            },
            creditsReserved: 50,
            creditsCharged: 45,
            errorMessage: null,
            progress: 100,
            startedAt: new Date(oneDayAgo.getFullYear(), oneDayAgo.getMonth(), oneDayAgo.getDate(), 15, 15, 0).toISOString(),
            completedAt: new Date(oneDayAgo.getFullYear(), oneDayAgo.getMonth(), oneDayAgo.getDate(), 15, 22, 0).toISOString(),
            createdAt: new Date(oneDayAgo.getFullYear(), oneDayAgo.getMonth(), oneDayAgo.getDate(), 15, 14, 0).toISOString(),
            updatedAt: new Date(oneDayAgo.getFullYear(), oneDayAgo.getMonth(), oneDayAgo.getDate(), 15, 22, 0).toISOString(),
        },
        {
            userId: 'demo-user-2',
            type: 'lipsync',
            status: 'processing',
            inputData: {
                videoUrl: 'https://storage.osirix.ai/inputs/source-video-789.mp4',
                audioUrl: 'https://storage.osirix.ai/inputs/audio-track-789.mp3',
                avatarId: 5
            },
            outputData: null,
            creditsReserved: 75,
            creditsCharged: null,
            errorMessage: null,
            progress: 62,
            startedAt: twoHoursAgo.toISOString(),
            completedAt: null,
            createdAt: new Date(twoHoursAgo.getTime() - 5 * 60 * 1000).toISOString(),
            updatedAt: new Date(now.getTime() - 30 * 1000).toISOString(),
        },
        {
            userId: 'demo-user-2',
            type: 'tts',
            status: 'completed',
            inputData: {
                text: 'Subscribe to our channel for more amazing content! Don\'t forget to hit the notification bell.',
                voice: 'young-casual-male',
                language: 'en-US',
                speed: 1.1
            },
            outputData: {
                audioUrl: 'https://storage.osirix.ai/outputs/tts-ghi789.mp3',
                duration: 8,
                fileSize: 256000
            },
            creditsReserved: 8,
            creditsCharged: 8,
            errorMessage: null,
            progress: 100,
            startedAt: fiveHoursAgo.toISOString(),
            completedAt: new Date(fiveHoursAgo.getTime() + 60 * 1000).toISOString(),
            createdAt: new Date(fiveHoursAgo.getTime() - 30 * 1000).toISOString(),
            updatedAt: new Date(fiveHoursAgo.getTime() + 60 * 1000).toISOString(),
        },
        {
            userId: 'demo-user-3',
            type: 'video',
            status: 'failed',
            inputData: {
                script: 'This is a test video with a very long script that might cause issues...',
                avatarId: 99,
                background: 'studio-1',
                resolution: '4k'
            },
            outputData: null,
            creditsReserved: 100,
            creditsCharged: 0,
            errorMessage: 'Avatar not found: Invalid avatarId 99',
            progress: 15,
            startedAt: sixHoursAgo.toISOString(),
            completedAt: new Date(sixHoursAgo.getTime() + 30 * 1000).toISOString(),
            createdAt: new Date(sixHoursAgo.getTime() - 60 * 1000).toISOString(),
            updatedAt: new Date(sixHoursAgo.getTime() + 30 * 1000).toISOString(),
        },
        {
            userId: 'demo-user-1',
            type: 'lipsync',
            status: 'completed',
            inputData: {
                videoUrl: 'https://storage.osirix.ai/inputs/source-video-321.mp4',
                audioUrl: 'https://storage.osirix.ai/inputs/audio-track-321.mp3',
                avatarId: 1,
                quality: 'high'
            },
            outputData: {
                videoUrl: 'https://storage.osirix.ai/outputs/lipsync-jkl012.mp4',
                duration: 120,
                fileSize: 41943040,
                thumbnailUrl: 'https://storage.osirix.ai/outputs/lipsync-jkl012-thumb.jpg'
            },
            creditsReserved: 80,
            creditsCharged: 80,
            errorMessage: null,
            progress: 100,
            startedAt: new Date(threeDaysAgo.getFullYear(), threeDaysAgo.getMonth(), threeDaysAgo.getDate(), 11, 0, 0).toISOString(),
            completedAt: new Date(threeDaysAgo.getFullYear(), threeDaysAgo.getMonth(), threeDaysAgo.getDate(), 11, 18, 0).toISOString(),
            createdAt: new Date(threeDaysAgo.getFullYear(), threeDaysAgo.getMonth(), threeDaysAgo.getDate(), 10, 58, 0).toISOString(),
            updatedAt: new Date(threeDaysAgo.getFullYear(), threeDaysAgo.getMonth(), threeDaysAgo.getDate(), 11, 18, 0).toISOString(),
        },
        {
            userId: 'demo-user-3',
            type: 'video',
            status: 'pending',
            inputData: {
                script: 'Welcome to our Q4 earnings call. Let\'s review the key financial metrics and achievements from this quarter.',
                avatarId: 4,
                background: 'corporate-office',
                resolution: '1080p'
            },
            outputData: null,
            creditsReserved: 55,
            creditsCharged: null,
            errorMessage: null,
            progress: 0,
            startedAt: null,
            completedAt: null,
            createdAt: new Date(now.getTime() - 10 * 60 * 1000).toISOString(),
            updatedAt: new Date(now.getTime() - 10 * 60 * 1000).toISOString(),
        },
        {
            userId: 'demo-user-3',
            type: 'tts',
            status: 'completed',
            inputData: {
                text: 'In today\'s episode, we\'re discussing the future of artificial intelligence and its impact on content creation. Stay tuned!',
                voice: 'professional-male',
                language: 'en-US',
                speed: 0.95
            },
            outputData: {
                audioUrl: 'https://storage.osirix.ai/outputs/tts-mno345.mp3',
                duration: 15,
                fileSize: 480000
            },
            creditsReserved: 12,
            creditsCharged: 12,
            errorMessage: null,
            progress: 100,
            startedAt: new Date(fourDaysAgo.getFullYear(), fourDaysAgo.getMonth(), fourDaysAgo.getDate(), 14, 45, 0).toISOString(),
            completedAt: new Date(fourDaysAgo.getFullYear(), fourDaysAgo.getMonth(), fourDaysAgo.getDate(), 14, 47, 0).toISOString(),
            createdAt: new Date(fourDaysAgo.getFullYear(), fourDaysAgo.getMonth(), fourDaysAgo.getDate(), 14, 44, 0).toISOString(),
            updatedAt: new Date(fourDaysAgo.getFullYear(), fourDaysAgo.getMonth(), fourDaysAgo.getDate(), 14, 47, 0).toISOString(),
        }
    ];

    await db.insert(jobs).values(sampleJobs);
    
    console.log('✅ Jobs seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});