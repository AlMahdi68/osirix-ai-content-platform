import { db } from '@/db';
import { plans } from '@/db/schema';

async function main() {
    const currentTimestamp = new Date().toISOString();
    
    const samplePlans = [
        {
            name: 'Free',
            price: 0,
            creditsMonthly: 100,
            features: ['Basic TTS', '1 Avatar', 'Community Support'],
            isActive: true,
            createdAt: currentTimestamp,
            updatedAt: currentTimestamp,
        },
        {
            name: 'Starter',
            price: 999,
            creditsMonthly: 500,
            features: ['Advanced TTS', '5 Avatars', 'Lip-sync Videos', 'Social Scheduling', 'Email Support'],
            isActive: true,
            createdAt: currentTimestamp,
            updatedAt: currentTimestamp,
        },
        {
            name: 'Pro',
            price: 2999,
            creditsMonthly: 2000,
            features: ['Unlimited TTS', '20 Avatars', 'Marketplace Access', 'Priority Support', 'Advanced Analytics', 'Custom Branding'],
            isActive: true,
            createdAt: currentTimestamp,
            updatedAt: currentTimestamp,
        },
        {
            name: 'Enterprise',
            price: 9999,
            creditsMonthly: 10000,
            features: ['Everything in Pro', 'Unlimited Avatars', 'API Access', 'Dedicated Support', 'Custom Integration', 'White Label'],
            isActive: true,
            createdAt: currentTimestamp,
            updatedAt: currentTimestamp,
        }
    ];

    await db.insert(plans).values(samplePlans);
    
    console.log('✅ Plans seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});