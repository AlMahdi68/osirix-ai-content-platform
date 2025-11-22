import { TwitterApi } from 'twitter-api-v2';
import { google } from 'googleapis';
import { db } from '@/db';
import { socialAccounts } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { decrypt } from './encryption';

interface PostOptions {
  content: string;
  mediaUrls?: string[];
  scheduledFor?: Date;
}

export class SocialPostingService {
  /**
   * Post to Twitter/X
   */
  async postToTwitter(userId: string, options: PostOptions): Promise<{ platformPostId: string }> {
    const account = await db
      .select()
      .from(socialAccounts)
      .where(
        and(
          eq(socialAccounts.userId, userId),
          eq(socialAccounts.platform, 'twitter'),
          eq(socialAccounts.isConnected, true)
        )
      )
      .limit(1);

    if (account.length === 0) {
      throw new Error('Twitter account not connected');
    }

    const accessToken = decrypt(account[0].accessToken);
    
    // Check if token is expired
    if (account[0].tokenExpiresAt && new Date(account[0].tokenExpiresAt) < new Date()) {
      throw new Error('Twitter token expired - please reconnect');
    }

    const client = new TwitterApi(accessToken);
    const rwClient = client.readWrite;

    let mediaIds: string[] = [];
    
    // Upload media if provided
    if (options.mediaUrls && options.mediaUrls.length > 0) {
      mediaIds = await Promise.all(
        options.mediaUrls.slice(0, 4).map(async (url) => { // Twitter allows max 4 images
          try {
            const response = await fetch(url);
            const buffer = await response.arrayBuffer();
            const media = await rwClient.v1.uploadMedia(Buffer.from(buffer), {
              mimeType: 'image/jpeg',
            });
            return media.media_id_string;
          } catch (error) {
            console.error('Failed to upload media to Twitter:', error);
            throw new Error('Failed to upload media');
          }
        })
      );
    }

    // Post tweet
    const tweet = await rwClient.v2.tweet({
      text: options.content,
      ...(mediaIds.length > 0 && { media: { media_ids: mediaIds } }),
    });

    return { platformPostId: tweet.data.id };
  }

  /**
   * Post to Facebook Page
   */
  async postToFacebook(userId: string, options: PostOptions): Promise<{ platformPostId: string }> {
    const account = await db
      .select()
      .from(socialAccounts)
      .where(
        and(
          eq(socialAccounts.userId, userId),
          eq(socialAccounts.platform, 'facebook'),
          eq(socialAccounts.isConnected, true)
        )
      )
      .limit(1);

    if (account.length === 0) {
      throw new Error('Facebook account not connected');
    }

    const accessToken = decrypt(account[0].accessToken);
    const metadata = account[0].metadata as { pageId?: string };
    const pageId = metadata?.pageId || account[0].platformUserId;

    // Build post payload
    const payload: any = {
      message: options.content,
      access_token: accessToken,
    };

    // Add media if provided (Facebook Graph API)
    if (options.mediaUrls && options.mediaUrls.length > 0) {
      payload.url = options.mediaUrls[0]; // Use first image
    }

    const endpoint = options.mediaUrls && options.mediaUrls.length > 0
      ? `https://graph.facebook.com/v18.0/${pageId}/photos`
      : `https://graph.facebook.com/v18.0/${pageId}/feed`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Facebook API error: ${error.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return { platformPostId: data.id || data.post_id };
  }

  /**
   * Post to Instagram
   */
  async postToInstagram(userId: string, options: PostOptions): Promise<{ platformPostId: string }> {
    const account = await db
      .select()
      .from(socialAccounts)
      .where(
        and(
          eq(socialAccounts.userId, userId),
          eq(socialAccounts.platform, 'instagram'),
          eq(socialAccounts.isConnected, true)
        )
      )
      .limit(1);

    if (account.length === 0) {
      throw new Error('Instagram account not connected');
    }

    if (!options.mediaUrls || options.mediaUrls.length === 0) {
      throw new Error('Instagram posts require at least one image');
    }

    const accessToken = decrypt(account[0].accessToken);
    const igUserId = account[0].platformUserId;

    // Step 1: Create media container
    const createResponse = await fetch(
      `https://graph.instagram.com/v18.0/${igUserId}/media`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image_url: options.mediaUrls[0],
          caption: options.content,
          access_token: accessToken,
        }),
      }
    );

    if (!createResponse.ok) {
      const error = await createResponse.json();
      throw new Error(`Instagram create error: ${error.error?.message || 'Unknown error'}`);
    }

    const createData = await createResponse.json();
    const creationId = createData.id;

    // Step 2: Publish media
    const publishResponse = await fetch(
      `https://graph.instagram.com/v18.0/${igUserId}/media_publish`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          creation_id: creationId,
          access_token: accessToken,
        }),
      }
    );

    if (!publishResponse.ok) {
      const error = await publishResponse.json();
      throw new Error(`Instagram publish error: ${error.error?.message || 'Unknown error'}`);
    }

    const publishData = await publishResponse.json();
    return { platformPostId: publishData.id };
  }

  /**
   * Post to LinkedIn
   */
  async postToLinkedIn(userId: string, options: PostOptions): Promise<{ platformPostId: string }> {
    const account = await db
      .select()
      .from(socialAccounts)
      .where(
        and(
          eq(socialAccounts.userId, userId),
          eq(socialAccounts.platform, 'linkedin'),
          eq(socialAccounts.isConnected, true)
        )
      )
      .limit(1);

    if (account.length === 0) {
      throw new Error('LinkedIn account not connected');
    }

    const accessToken = decrypt(account[0].accessToken);
    const memberId = account[0].platformUserId;

    const payload: any = {
      author: `urn:li:person:${memberId}`,
      lifecycleState: 'PUBLISHED',
      specificContent: {
        'com.linkedin.ugc.ShareContent': {
          shareCommentary: {
            text: options.content,
          },
          shareMediaCategory: 'NONE',
        },
      },
      visibility: {
        'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
      },
    };

    // Add media if provided
    if (options.mediaUrls && options.mediaUrls.length > 0) {
      payload.specificContent['com.linkedin.ugc.ShareContent'].shareMediaCategory = 'IMAGE';
      payload.specificContent['com.linkedin.ugc.ShareContent'].media = [
        {
          status: 'READY',
          description: {
            text: options.content,
          },
          media: options.mediaUrls[0],
        },
      ];
    }

    const response = await fetch('https://api.linkedin.com/v2/ugcPosts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'X-Restli-Protocol-Version': '2.0.0',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`LinkedIn API error: ${error.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return { platformPostId: data.id };
  }

  /**
   * Upload video to YouTube
   */
  async uploadToYouTube(
    userId: string,
    videoUrl: string,
    title: string,
    description: string,
    tags: string[] = []
  ): Promise<{ platformPostId: string }> {
    const account = await db
      .select()
      .from(socialAccounts)
      .where(
        and(
          eq(socialAccounts.userId, userId),
          eq(socialAccounts.platform, 'youtube'),
          eq(socialAccounts.isConnected, true)
        )
      )
      .limit(1);

    if (account.length === 0) {
      throw new Error('YouTube account not connected');
    }

    const accessToken = decrypt(account[0].accessToken);
    const refreshToken = account[0].refreshToken ? decrypt(account[0].refreshToken) : null;

    const oauth2Client = new google.auth.OAuth2(
      process.env.YOUTUBE_CLIENT_ID,
      process.env.YOUTUBE_CLIENT_SECRET,
      `${process.env.NEXTAUTH_URL}/api/auth/callback/youtube`
    );

    oauth2Client.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken || undefined,
    });

    const youtube = google.youtube({ version: 'v3', auth: oauth2Client });

    // Download video
    const videoResponse = await fetch(videoUrl);
    const videoBuffer = await videoResponse.arrayBuffer();

    // Upload to YouTube
    const uploadResponse = await youtube.videos.insert({
      part: ['snippet', 'status'],
      requestBody: {
        snippet: {
          title,
          description,
          tags,
          categoryId: '22', // People & Blogs
        },
        status: {
          privacyStatus: 'public',
          madeForKids: false,
        },
      },
      media: {
        body: Buffer.from(videoBuffer),
      },
    });

    return { platformPostId: uploadResponse.data.id || '' };
  }

  /**
   * Get analytics for a specific post
   */
  async getPostAnalytics(
    userId: string,
    platform: string,
    platformPostId: string
  ): Promise<{ impressions: number; engagements: number; clicks: number }> {
    const account = await db
      .select()
      .from(socialAccounts)
      .where(
        and(
          eq(socialAccounts.userId, userId),
          eq(socialAccounts.platform, platform),
          eq(socialAccounts.isConnected, true)
        )
      )
      .limit(1);

    if (account.length === 0) {
      throw new Error(`${platform} account not connected`);
    }

    const accessToken = decrypt(account[0].accessToken);

    switch (platform) {
      case 'twitter': {
        const client = new TwitterApi(accessToken);
        const tweet = await client.v2.singleTweet(platformPostId, {
          'tweet.fields': ['public_metrics'],
        });

        return {
          impressions: tweet.data.public_metrics?.impression_count || 0,
          engagements:
            (tweet.data.public_metrics?.like_count || 0) +
            (tweet.data.public_metrics?.retweet_count || 0) +
            (tweet.data.public_metrics?.reply_count || 0),
          clicks: tweet.data.public_metrics?.url_link_clicks || 0,
        };
      }

      case 'facebook': {
        const response = await fetch(
          `https://graph.facebook.com/v18.0/${platformPostId}/insights?metric=post_impressions,post_engaged_users,post_clicks&access_token=${accessToken}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch Facebook analytics');
        }

        const data = await response.json();
        const metrics = data.data || [];

        return {
          impressions: metrics.find((m: any) => m.name === 'post_impressions')?.values?.[0]?.value || 0,
          engagements: metrics.find((m: any) => m.name === 'post_engaged_users')?.values?.[0]?.value || 0,
          clicks: metrics.find((m: any) => m.name === 'post_clicks')?.values?.[0]?.value || 0,
        };
      }

      case 'instagram': {
        const response = await fetch(
          `https://graph.instagram.com/v18.0/${platformPostId}/insights?metric=impressions,engagement,reach&access_token=${accessToken}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch Instagram analytics');
        }

        const data = await response.json();
        const metrics = data.data || [];

        return {
          impressions: metrics.find((m: any) => m.name === 'impressions')?.values?.[0]?.value || 0,
          engagements: metrics.find((m: any) => m.name === 'engagement')?.values?.[0]?.value || 0,
          clicks: 0, // Instagram doesn't provide click metrics directly
        };
      }

      default:
        return { impressions: 0, engagements: 0, clicks: 0 };
    }
  }
}

export const socialPostingService = new SocialPostingService();
