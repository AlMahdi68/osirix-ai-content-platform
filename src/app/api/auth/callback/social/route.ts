import { NextRequest, NextResponse } from 'next/server';
import { TwitterApi } from 'twitter-api-v2';
import { google } from 'googleapis';
import { db } from '@/db';
import { socialAccounts } from '@/db/schema';
import { encrypt } from '@/lib/encryption';
import { eq, and } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    // Handle OAuth errors
    if (error) {
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/settings?social_error=${encodeURIComponent(error)}`
      );
    }

    if (!code || !state) {
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/settings?social_error=missing_params`
      );
    }

    // Parse state: format is "userId-platform-timestamp"
    const [userId, platform, timestamp] = state.split('-');

    if (!userId || !platform) {
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/settings?social_error=invalid_state`
      );
    }

    // Check state timestamp (prevent replay attacks - valid for 10 minutes)
    const stateAge = Date.now() - parseInt(timestamp);
    if (stateAge > 10 * 60 * 1000) {
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/settings?social_error=state_expired`
      );
    }

    let accountData: any = null;

    switch (platform) {
      case 'twitter':
        accountData = await handleTwitterCallback(code, userId);
        break;
      case 'facebook':
        accountData = await handleFacebookCallback(code, userId);
        break;
      case 'instagram':
        accountData = await handleInstagramCallback(code, userId);
        break;
      case 'linkedin':
        accountData = await handleLinkedInCallback(code, userId);
        break;
      case 'youtube':
        accountData = await handleYouTubeCallback(code, userId);
        break;
      default:
        return NextResponse.redirect(
          `${process.env.NEXTAUTH_URL}/settings?social_error=invalid_platform`
        );
    }

    if (!accountData) {
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/settings?social_error=auth_failed`
      );
    }

    // Check if account already exists
    const existing = await db
      .select()
      .from(socialAccounts)
      .where(
        and(
          eq(socialAccounts.userId, userId),
          eq(socialAccounts.platform, platform)
        )
      )
      .limit(1);

    const now = new Date().toISOString();

    if (existing.length > 0) {
      // Update existing account
      await db
        .update(socialAccounts)
        .set({
          platformUserId: accountData.platformUserId,
          platformUsername: accountData.platformUsername,
          accessToken: encrypt(accountData.accessToken),
          refreshToken: accountData.refreshToken ? encrypt(accountData.refreshToken) : null,
          tokenExpiresAt: accountData.tokenExpiresAt,
          scopes: JSON.stringify(accountData.scopes),
          isConnected: true,
          lastRefreshedAt: now,
          metadata: JSON.stringify(accountData.metadata || {}),
          updatedAt: now,
        })
        .where(eq(socialAccounts.id, existing[0].id));
    } else {
      // Create new account
      await db.insert(socialAccounts).values({
        userId,
        platform,
        platformUserId: accountData.platformUserId,
        platformUsername: accountData.platformUsername,
        accessToken: encrypt(accountData.accessToken),
        refreshToken: accountData.refreshToken ? encrypt(accountData.refreshToken) : null,
        tokenExpiresAt: accountData.tokenExpiresAt,
        scopes: JSON.stringify(accountData.scopes),
        isConnected: true,
        lastRefreshedAt: now,
        metadata: JSON.stringify(accountData.metadata || {}),
        createdAt: now,
        updatedAt: now,
      });
    }

    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/settings?social_connected=${platform}`
    );
  } catch (error) {
    console.error('OAuth callback error:', error);
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/settings?social_error=internal_error`
    );
  }
}

async function handleTwitterCallback(code: string, userId: string) {
  const client = new TwitterApi({
    clientId: process.env.TWITTER_CLIENT_ID!,
    clientSecret: process.env.TWITTER_CLIENT_SECRET!,
  });

  const codeVerifier = 'mock-code-verifier'; // In production, retrieve from session

  const { accessToken, refreshToken, expiresIn } = await client.loginWithOAuth2({
    code,
    codeVerifier,
    redirectUri: `${process.env.NEXTAUTH_URL}/api/auth/callback/social`,
  });

  const userClient = new TwitterApi(accessToken);
  const meData = await userClient.v2.me();

  return {
    platformUserId: meData.data.id,
    platformUsername: meData.data.username,
    accessToken,
    refreshToken,
    tokenExpiresAt: new Date(Date.now() + expiresIn * 1000).toISOString(),
    scopes: ['tweet.read', 'tweet.write', 'users.read'],
    metadata: {
      name: meData.data.name,
      verified: meData.data.verified || false,
    },
  };
}

async function handleFacebookCallback(code: string, userId: string) {
  const tokenResponse = await fetch(
    `https://graph.facebook.com/v18.0/oauth/access_token?client_id=${process.env.FACEBOOK_APP_ID}&client_secret=${process.env.FACEBOOK_APP_SECRET}&redirect_uri=${encodeURIComponent(`${process.env.NEXTAUTH_URL}/api/auth/callback/social`)}&code=${code}`
  );

  const tokenData = await tokenResponse.json();
  const accessToken = tokenData.access_token;

  // Get user info
  const meResponse = await fetch(
    `https://graph.facebook.com/v18.0/me?fields=id,name&access_token=${accessToken}`
  );
  const meData = await meResponse.json();

  // Get pages
  const pagesResponse = await fetch(
    `https://graph.facebook.com/v18.0/me/accounts?access_token=${accessToken}`
  );
  const pagesData = await pagesResponse.json();
  const page = pagesData.data?.[0];

  return {
    platformUserId: page?.id || meData.id,
    platformUsername: meData.name,
    accessToken: page?.access_token || accessToken,
    refreshToken: null,
    tokenExpiresAt: null, // Facebook tokens don't expire
    scopes: ['pages_manage_posts', 'pages_read_engagement'],
    metadata: {
      pageName: page?.name,
      pageId: page?.id,
    },
  };
}

async function handleInstagramCallback(code: string, userId: string) {
  const tokenResponse = await fetch(
    `https://api.instagram.com/oauth/access_token`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.INSTAGRAM_APP_ID!,
        client_secret: process.env.INSTAGRAM_APP_SECRET!,
        grant_type: 'authorization_code',
        redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/callback/social`,
        code,
      }),
    }
  );

  const tokenData = await tokenResponse.json();
  const accessToken = tokenData.access_token;
  const userId_ig = tokenData.user_id;

  // Get user info
  const meResponse = await fetch(
    `https://graph.instagram.com/v18.0/${userId_ig}?fields=id,username&access_token=${accessToken}`
  );
  const meData = await meResponse.json();

  return {
    platformUserId: meData.id,
    platformUsername: meData.username,
    accessToken,
    refreshToken: null,
    tokenExpiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days
    scopes: ['instagram_basic', 'instagram_content_publish'],
    metadata: {},
  };
}

async function handleLinkedInCallback(code: string, userId: string) {
  const tokenResponse = await fetch(
    `https://www.linkedin.com/oauth/v2/accessToken`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        client_id: process.env.LINKEDIN_CLIENT_ID!,
        client_secret: process.env.LINKEDIN_CLIENT_SECRET!,
        redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/callback/social`,
      }),
    }
  );

  const tokenData = await tokenResponse.json();
  const accessToken = tokenData.access_token;

  // Get user info
  const meResponse = await fetch(`https://api.linkedin.com/v2/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const meData = await meResponse.json();

  return {
    platformUserId: meData.id,
    platformUsername: `${meData.localizedFirstName} ${meData.localizedLastName}`,
    accessToken,
    refreshToken: tokenData.refresh_token,
    tokenExpiresAt: new Date(Date.now() + tokenData.expires_in * 1000).toISOString(),
    scopes: ['w_member_social', 'r_basicprofile'],
    metadata: {
      firstName: meData.localizedFirstName,
      lastName: meData.localizedLastName,
    },
  };
}

async function handleYouTubeCallback(code: string, userId: string) {
  const oauth2Client = new google.auth.OAuth2(
    process.env.YOUTUBE_CLIENT_ID,
    process.env.YOUTUBE_CLIENT_SECRET,
    `${process.env.NEXTAUTH_URL}/api/auth/callback/social`
  );

  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);

  const youtube = google.youtube({ version: 'v3', auth: oauth2Client });
  const channelResponse = await youtube.channels.list({
    part: ['snippet'],
    mine: true,
  });

  const channel = channelResponse.data.items?.[0];

  return {
    platformUserId: channel?.id || 'unknown',
    platformUsername: channel?.snippet?.title || 'YouTube Channel',
    accessToken: tokens.access_token!,
    refreshToken: tokens.refresh_token || null,
    tokenExpiresAt: new Date(tokens.expiry_date!).toISOString(),
    scopes: ['youtube.upload', 'youtube.readonly'],
    metadata: {
      channelTitle: channel?.snippet?.title,
      channelId: channel?.id,
    },
  };
}
