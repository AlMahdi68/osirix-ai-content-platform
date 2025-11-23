import { db } from '@/db';
import { wallets } from '@/db/schema';

async function main() {
    const now = new Date();
    
    const sampleWallets = [
        {
            userId: 'demo-user-1',
            balance: 15000,
            pendingBalance: 2500,
            totalEarnings: 50000,
            totalWithdrawn: 32500,
            createdAt: new Date(now.getTime() - 45 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
            userId: 'demo-user-2',
            balance: 42000,
            pendingBalance: 5000,
            totalEarnings: 120000,
            totalWithdrawn: 73000,
            createdAt: new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
            userId: 'demo-user-3',
            balance: 8500,
            pendingBalance: 1200,
            totalEarnings: 18000,
            totalWithdrawn: 8300,
            createdAt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
            userId: 'creator-user-1',
            balance: 125000,
            pendingBalance: 15000,
            totalEarnings: 350000,
            totalWithdrawn: 210000,
            createdAt: new Date(now.getTime() - 55 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
            userId: 'seller-user-1',
            balance: 3200,
            pendingBalance: 800,
            totalEarnings: 12000,
            totalWithdrawn: 8000,
            createdAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000).toISOString(),
        }
    ];

    await db.insert(wallets).values(sampleWallets);
    
    console.log('✅ Wallets seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});