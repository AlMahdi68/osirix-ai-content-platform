import { db } from '@/db';
import { socialAccounts } from '@/db/schema';

async function main() {
    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysFromNow = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000);
    const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const tenDaysAgo = new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000);

    const sampleAccounts = [
        // demo-user-1 accounts
        {
            userId: 'demo-user-1',
            platform: 'twitter',
            platformUserId: 'tw_12345678',
            platformUsername: '@johndoe',
            accessToken: 'mock_access_token_twitter_xyz123abc456def789',
            refreshToken: 'mock_refresh_token_twitter_abc456def789xyz123',
            tokenExpiresAt: thirtyDaysFromNow.toISOString(),
            scopes: JSON.stringify(['tweet.read', 'tweet.write', 'users.read']),
            isConnected: 1,
            lastRefreshedAt: threeDaysAgo.toISOString(),
            metadata: JSON.stringify({
                followersCount: 1250,
                followingCount: 890,
                verified: false,
                profileImageUrl: 'https://example.com/twitter-profile.jpg'
            }),
            createdAt: new Date('2024-01-15').toISOString(),
            updatedAt: threeDaysAgo.toISOString(),
        },
        {
            userId: 'demo-user-1',
            platform: 'facebook',
            platformUserId: 'fb_98765432',
            platformUsername: 'john.doe',
            accessToken: 'mock_access_token_facebook_aaa111bbb222ccc333',
            refreshToken: 'mock_refresh_token_facebook_ddd444eee555fff666',
            tokenExpiresAt: sixtyDaysFromNow.toISOString(),
            scopes: JSON.stringify(['public_profile', 'pages_manage_posts', 'pages_read_engagement']),
            isConnected: 1,
            lastRefreshedAt: sevenDaysAgo.toISOString(),
            metadata: JSON.stringify({
                pageId: 'page_123456789',
                pageName: 'John Doe Official',
                likes: 5420,
                profileUrl: 'https://facebook.com/johndoe'
            }),
            createdAt: new Date('2024-01-20').toISOString(),
            updatedAt: sevenDaysAgo.toISOString(),
        },
        {
            userId: 'demo-user-1',
            platform: 'instagram',
            platformUserId: 'ig_11223344',
            platformUsername: 'johndoe',
            accessToken: 'mock_access_token_instagram_ggg777hhh888iii999',
            refreshToken: null,
            tokenExpiresAt: thirtyDaysFromNow.toISOString(),
            scopes: JSON.stringify(['instagram_basic', 'instagram_content_publish']),
            isConnected: 1,
            lastRefreshedAt: threeDaysAgo.toISOString(),
            metadata: JSON.stringify({
                followersCount: 3450,
                mediaCount: 287,
                biography: 'Digital creator & tech enthusiast',
                profilePictureUrl: 'https://example.com/instagram-profile.jpg'
            }),
            createdAt: new Date('2024-02-01').toISOString(),
            updatedAt: threeDaysAgo.toISOString(),
        },
        
        // demo-user-2 accounts
        {
            userId: 'demo-user-2',
            platform: 'linkedin',
            platformUserId: 'li_55667788',
            platformUsername: 'jane-smith',
            accessToken: 'mock_access_token_linkedin_jjj000kkk111lll222',
            refreshToken: 'mock_refresh_token_linkedin_mmm333nnn444ooo555',
            tokenExpiresAt: sixtyDaysFromNow.toISOString(),
            scopes: JSON.stringify(['r_liteprofile', 'r_emailaddress', 'w_member_social']),
            isConnected: 1,
            lastRefreshedAt: sevenDaysAgo.toISOString(),
            metadata: JSON.stringify({
                headline: 'Senior Marketing Manager at Tech Corp',
                connections: 2890,
                industry: 'Marketing and Advertising',
                profileUrl: 'https://linkedin.com/in/janesmith'
            }),
            createdAt: new Date('2024-01-25').toISOString(),
            updatedAt: sevenDaysAgo.toISOString(),
        },
        {
            userId: 'demo-user-2',
            platform: 'youtube',
            platformUserId: 'yt_99887766',
            platformUsername: 'JaneSmithChannel',
            accessToken: 'mock_access_token_youtube_ppp666qqq777rrr888',
            refreshToken: 'mock_refresh_token_youtube_sss999ttt000uuu111',
            tokenExpiresAt: thirtyDaysFromNow.toISOString(),
            scopes: JSON.stringify(['youtube.upload', 'youtube.readonly', 'youtube.force-ssl']),
            isConnected: 1,
            lastRefreshedAt: tenDaysAgo.toISOString(),
            metadata: JSON.stringify({
                channelId: 'UC1234567890abcdef',
                subscriberCount: 15200,
                videoCount: 145,
                viewCount: 892000,
                channelUrl: 'https://youtube.com/c/JaneSmithChannel'
            }),
            createdAt: new Date('2024-02-05').toISOString(),
            updatedAt: tenDaysAgo.toISOString(),
        },
        
        // demo-user-3 accounts
        {
            userId: 'demo-user-3',
            platform: 'twitter',
            platformUserId: 'tw_44332211',
            platformUsername: '@mikejohnson',
            accessToken: 'mock_access_token_twitter_vvv222www333xxx444',
            refreshToken: 'mock_refresh_token_twitter_yyy555zzz666aaa777',
            tokenExpiresAt: thirtyDaysFromNow.toISOString(),
            scopes: JSON.stringify(['tweet.read', 'tweet.write', 'users.read']),
            isConnected: 0,
            lastRefreshedAt: null,
            metadata: JSON.stringify({
                followersCount: 560,
                followingCount: 430,
                verified: false,
                disconnectedReason: 'User manually disconnected account'
            }),
            createdAt: new Date('2024-01-10').toISOString(),
            updatedAt: new Date('2024-03-01').toISOString(),
        },
        {
            userId: 'demo-user-3',
            platform: 'facebook',
            platformUserId: 'fb_77665544',
            platformUsername: 'mike.johnson',
            accessToken: 'mock_access_token_facebook_bbb888ccc999ddd000',
            refreshToken: 'mock_refresh_token_facebook_eee111fff222ggg333',
            tokenExpiresAt: sixtyDaysFromNow.toISOString(),
            scopes: JSON.stringify(['public_profile', 'pages_manage_posts']),
            isConnected: 1,
            lastRefreshedAt: sevenDaysAgo.toISOString(),
            metadata: JSON.stringify({
                pageId: 'page_987654321',
                pageName: 'Mike Johnson Photography',
                likes: 2150,
                profileUrl: 'https://facebook.com/mikejohnson'
            }),
            createdAt: new Date('2024-02-10').toISOString(),
            updatedAt: sevenDaysAgo.toISOString(),
        },
        {
            userId: 'demo-user-3',
            platform: 'linkedin',
            platformUserId: 'li_33221100',
            platformUsername: 'michael-johnson',
            accessToken: 'mock_access_token_linkedin_hhh444iii555jjj666',
            refreshToken: 'mock_refresh_token_linkedin_kkk777lll888mmm999',
            tokenExpiresAt: threeDaysAgo.toISOString(),
            scopes: JSON.stringify(['r_liteprofile', 'w_member_social']),
            isConnected: 1,
            lastRefreshedAt: new Date('2024-01-15').toISOString(),
            metadata: JSON.stringify({
                headline: 'Freelance Photographer & Content Creator',
                connections: 890,
                industry: 'Photography',
                tokenExpired: true,
                needsReauthorization: true
            }),
            createdAt: new Date('2024-01-12').toISOString(),
            updatedAt: new Date('2024-01-15').toISOString(),
        },
    ];

    await db.insert(socialAccounts).values(sampleAccounts);
    
    console.log('✅ Social accounts seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});