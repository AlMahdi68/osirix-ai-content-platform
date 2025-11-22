import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { socialAccounts } from '@/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { auth } from '@/lib/auth';

const VALID_PLATFORMS = ['twitter', 'facebook', 'instagram', 'linkedin', 'youtube'] as const;
type Platform = typeof VALID_PLATFORMS[number];

const OAUTH_CONFIGS: Record<Platform, { authUrl: string; scopes: string }> = {
  twitter: {
    authUrl: 'https://twitter.com/i/oauth2/authorize',
    scopes: 'tweet.read,tweet.write,users.read'
  },
  facebook: {
    authUrl: 'https://www.facebook.com/v18.0/dialog/oauth',
    scopes: 'pages_manage_posts,pages_read_engagement'
  },
  instagram: {
    authUrl: 'https://api.instagram.com/oauth/authorize',
    scopes: 'user_profile,user_media'
  },
  linkedin: {
    authUrl: 'https://www.linkedin.com/oauth/v2/authorization',
    scopes: 'w_member_social,r_basicprofile'
  },
  youtube: {
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    scopes: 'https://www.googleapis.com/auth/youtube.upload'
  }
};

function maskToken(token: string): string {
  if (!token || token.length < 4) return '***';
  return `***${token.slice(-4)}`;
}

function isValidUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
  } catch {
    return false;
  }
}

function generateOAuthUrl(platform: Platform, redirectUrl: string, userId: string): { authUrl: string; state: string } {
  const config = OAUTH_CONFIGS[platform];
  const timestamp = Date.now();
  const state = `${userId}-${platform}-${timestamp}`;
  
  const params = new URLSearchParams({
    client_id: 'MOCK_CLIENT',
    redirect_uri: redirectUrl,
    state: state
  });

  if (platform === 'twitter' || platform === 'facebook' || platform === 'instagram' || platform === 'linkedin') {
    params.append('scope', config.scopes);
  }

  if (platform === 'instagram' || platform === 'youtube') {
    params.append('response_type', 'code');
  }

  if (platform === 'youtube') {
    params.set('scope', config.scopes);
  }

  const authUrl = `${config.authUrl}?${params.toString()}`;
  
  return { authUrl, state };
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const platform = searchParams.get('platform');

    let query = db.select().from(socialAccounts).where(eq(socialAccounts.userId, session.user.id));

    if (platform) {
      if (!VALID_PLATFORMS.includes(platform as Platform)) {
        return NextResponse.json(
          { error: 'Invalid platform', code: 'INVALID_PLATFORM' },
          { status: 400 }
        );
      }
      query = db.select()
        .from(socialAccounts)
        .where(
          and(
            eq(socialAccounts.userId, session.user.id),
            eq(socialAccounts.platform, platform)
          )
        );
    }

    const accounts = await query.orderBy(desc(socialAccounts.createdAt));

    const maskedAccounts = accounts.map(account => ({
      ...account,
      accessToken: maskToken(account.accessToken),
      refreshToken: account.refreshToken ? maskToken(account.refreshToken) : null
    }));

    return NextResponse.json({ accounts: maskedAccounts }, { status: 200 });

  } catch (error) {
    console.error('GET /api/social/accounts error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { platform, redirectUrl } = body;

    if (!platform) {
      return NextResponse.json(
        { error: 'Platform is required', code: 'MISSING_PLATFORM' },
        { status: 400 }
      );
    }

    if (!VALID_PLATFORMS.includes(platform as Platform)) {
      return NextResponse.json(
        { 
          error: `Invalid platform. Must be one of: ${VALID_PLATFORMS.join(', ')}`, 
          code: 'INVALID_PLATFORM' 
        },
        { status: 400 }
      );
    }

    if (!redirectUrl) {
      return NextResponse.json(
        { error: 'Redirect URL is required', code: 'MISSING_REDIRECT_URL' },
        { status: 400 }
      );
    }

    if (!isValidUrl(redirectUrl)) {
      return NextResponse.json(
        { error: 'Invalid redirect URL format', code: 'INVALID_REDIRECT_URL' },
        { status: 400 }
      );
    }

    const { authUrl, state } = generateOAuthUrl(
      platform as Platform,
      redirectUrl,
      session.user.id
    );

    return NextResponse.json(
      { authUrl, state },
      { status: 201 }
    );

  } catch (error) {
    console.error('POST /api/social/accounts/connect error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}