import { db } from '@/db';
import { creditsLedger } from '@/db/schema';

async function main() {
    const now = new Date();
    
    const getDateDaysAgo = (days: number, hours: number = 9, minutes: number = 0) => {
        const date = new Date(now);
        date.setDate(date.getDate() - days);
        date.setHours(hours, minutes, 0, 0);
        return date.toISOString();
    };

    const sampleCreditsLedger = [
        {
            userId: 'demo-user-1',
            amount: 500,
            type: 'purchase',
            referenceId: 'plan_starter_202401',
            balanceAfter: 500,
            metadata: JSON.stringify({ plan: 'Starter', period: '2024-01' }),
            createdAt: getDateDaysAgo(30, 9, 0),
        },
        {
            userId: 'demo-user-1',
            amount: -10,
            type: 'usage',
            referenceId: 'job_1',
            balanceAfter: 490,
            metadata: JSON.stringify({ jobType: 'tts', duration: 12 }),
            createdAt: getDateDaysAgo(28, 10, 30),
        },
        {
            userId: 'demo-user-1',
            amount: -50,
            type: 'usage',
            referenceId: 'job_2',
            balanceAfter: 440,
            metadata: JSON.stringify({ jobType: 'video', duration: 45, resolution: '1080p' }),
            createdAt: getDateDaysAgo(26, 14, 15),
        },
        {
            userId: 'demo-user-1',
            amount: -80,
            type: 'usage',
            referenceId: 'job_6',
            balanceAfter: 360,
            metadata: JSON.stringify({ jobType: 'lipsync', duration: 120, quality: 'high' }),
            createdAt: getDateDaysAgo(24, 11, 0),
        },
        {
            userId: 'demo-user-1',
            amount: -200,
            type: 'usage',
            referenceId: 'order_marketplace_001',
            balanceAfter: 160,
            metadata: JSON.stringify({ productId: 6, productName: 'Social Media Template Pack' }),
            createdAt: getDateDaysAgo(20, 16, 30),
        },
        {
            userId: 'demo-user-1',
            amount: 100,
            type: 'bonus',
            referenceId: 'promo_referral',
            balanceAfter: 260,
            metadata: JSON.stringify({ reason: 'Referral bonus', referredUser: 'user_abc123' }),
            createdAt: getDateDaysAgo(18, 10, 0),
        },
        {
            userId: 'demo-user-1',
            amount: 500,
            type: 'purchase',
            referenceId: 'plan_starter_202402',
            balanceAfter: 760,
            metadata: JSON.stringify({ plan: 'Starter', period: '2024-02' }),
            createdAt: getDateDaysAgo(15, 9, 0),
        },
        {
            userId: 'demo-user-1',
            amount: -45,
            type: 'usage',
            referenceId: 'job_video_123',
            balanceAfter: 715,
            metadata: JSON.stringify({ jobType: 'video', duration: 38, resolution: '1080p' }),
            createdAt: getDateDaysAgo(12, 15, 45),
        },
        {
            userId: 'demo-user-1',
            amount: 100,
            type: 'refund',
            referenceId: 'job_failed_456',
            balanceAfter: 815,
            metadata: JSON.stringify({ reason: 'Job processing failed', originalJobId: 'job_456' }),
            createdAt: getDateDaysAgo(10, 11, 30),
        },
        {
            userId: 'demo-user-1',
            amount: -10,
            type: 'usage',
            referenceId: 'job_tts_789',
            balanceAfter: 805,
            metadata: JSON.stringify({ jobType: 'tts', duration: 12, voice: 'professional-female' }),
            createdAt: getDateDaysAgo(5, 14, 20),
        },
    ];

    await db.insert(creditsLedger).values(sampleCreditsLedger);
    
    console.log('✅ Credits ledger seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});