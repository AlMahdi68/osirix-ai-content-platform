import { db } from '@/db';
import { withdrawalRequests } from '@/db/schema';

async function main() {
    const now = new Date();
    
    const sampleWithdrawalRequests = [
        {
            userId: 'user_01h4kxt2e8z9y3b1n7m6q5w8r4',
            walletId: 1,
            amount: 15000,
            method: 'paypal',
            paymentDetails: {
                email: 'john.doe@example.com',
                accountName: 'John Doe'
            },
            status: 'completed',
            processedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            rejectionReason: null,
            adminNotes: 'Verified and processed successfully',
            createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
            userId: 'user_01h4kxt2e8z9y3b1n7m6q5w8r5',
            walletId: 2,
            amount: 5000,
            method: 'stripe',
            paymentDetails: {
                accountId: 'acct_1234567890abcdef',
                last4: '4242'
            },
            status: 'pending',
            processedAt: null,
            rejectionReason: null,
            adminNotes: null,
            createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
            userId: 'user_01h4kxt2e8z9y3b1n7m6q5w8r6',
            walletId: 3,
            amount: 20000,
            method: 'paypal',
            paymentDetails: {
                email: 'sarah.wilson@example.com',
                accountName: 'Sarah Wilson'
            },
            status: 'completed',
            processedAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(),
            rejectionReason: null,
            adminNotes: 'High-value withdrawal verified and approved',
            createdAt: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
            userId: 'user_01h4kxt2e8z9y3b1n7m6q5w8r7',
            walletId: 4,
            amount: 8500,
            method: 'bank_transfer',
            paymentDetails: {
                accountNumber: '****5678',
                bankName: 'Chase Bank',
                routingNumber: '****1234'
            },
            status: 'processing',
            processedAt: null,
            rejectionReason: null,
            adminNotes: 'Bank verification in progress',
            createdAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
            userId: 'user_01h4kxt2e8z9y3b1n7m6q5w8r8',
            walletId: 5,
            amount: 3000,
            method: 'stripe',
            paymentDetails: {
                accountId: 'acct_9876543210fedcba',
                last4: '8888'
            },
            status: 'rejected',
            processedAt: new Date(now.getTime() - 18 * 24 * 60 * 60 * 1000).toISOString(),
            rejectionReason: 'Insufficient verification',
            adminNotes: 'Account verification documents pending',
            createdAt: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(now.getTime() - 18 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
            userId: 'user_01h4kxt2e8z9y3b1n7m6q5w8r4',
            walletId: 1,
            amount: 12000,
            method: 'paypal',
            paymentDetails: {
                email: 'john.doe@example.com',
                accountName: 'John Doe'
            },
            status: 'completed',
            processedAt: new Date(now.getTime() - 28 * 24 * 60 * 60 * 1000).toISOString(),
            rejectionReason: null,
            adminNotes: 'Verified and processed',
            createdAt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(now.getTime() - 28 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
            userId: 'user_01h4kxt2e8z9y3b1n7m6q5w8r5',
            walletId: 2,
            amount: 7500,
            method: 'stripe',
            paymentDetails: {
                accountId: 'acct_5555666677778888',
                last4: '1111'
            },
            status: 'pending',
            processedAt: null,
            rejectionReason: null,
            adminNotes: null,
            createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
            userId: 'user_01h4kxt2e8z9y3b1n7m6q5w8r6',
            walletId: 3,
            amount: 10000,
            method: 'bank_transfer',
            paymentDetails: {
                accountNumber: '****9012',
                bankName: 'Bank of America',
                routingNumber: '****3456'
            },
            status: 'processing',
            processedAt: null,
            rejectionReason: null,
            adminNotes: 'Wire transfer initiated',
            createdAt: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
            userId: 'user_01h4kxt2e8z9y3b1n7m6q5w8r7',
            walletId: 4,
            amount: 2500,
            method: 'paypal',
            paymentDetails: {
                email: 'mike.chen@example.com',
                accountName: 'Mike Chen'
            },
            status: 'pending',
            processedAt: null,
            rejectionReason: null,
            adminNotes: null,
            createdAt: new Date(now.getTime() - 12 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(now.getTime() - 12 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
            userId: 'user_01h4kxt2e8z9y3b1n7m6q5w8r8',
            walletId: 5,
            amount: 18000,
            method: 'stripe',
            paymentDetails: {
                accountId: 'acct_abcd1234efgh5678',
                last4: '9999'
            },
            status: 'completed',
            processedAt: new Date(now.getTime() - 38 * 24 * 60 * 60 * 1000).toISOString(),
            rejectionReason: null,
            adminNotes: 'Large withdrawal approved after review',
            createdAt: new Date(now.getTime() - 45 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(now.getTime() - 38 * 24 * 60 * 60 * 1000).toISOString(),
        },
    ];

    await db.insert(withdrawalRequests).values(sampleWithdrawalRequests);
    
    console.log('✅ Withdrawal requests seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});