// General Webhook Handler for External Services
import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import crypto from 'crypto';

export const runtime = 'nodejs';

async function POST(req: NextRequest) {
  const signature = req.headers.get('x-webhook-signature');
  const timestamp = req.headers.get('x-webhook-timestamp');
  const webhookSecret = process.env.WEBHOOK_SECRET || 'default-secret';

  if (!signature || !timestamp) {
    logger.warn({
      message: 'Webhook signature or timestamp missing',
    });
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  try {
    const body = await req.text();
    
    // Verify timestamp (prevent replay attacks)
    const requestTimestamp = parseInt(timestamp);
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const maxAge = 300; // 5 minutes

    if (Math.abs(currentTimestamp - requestTimestamp) > maxAge) {
      logger.warn({
        message: 'Webhook timestamp too old',
        age: Math.abs(currentTimestamp - requestTimestamp),
      });
      return NextResponse.json({ error: 'Request too old' }, { status: 401 });
    }

    // Verify signature
    const signatureString = `${timestamp}.${body}`;
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(signatureString)
      .digest('hex');

    const isValid = crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );

    if (!isValid) {
      logger.warn({
        message: 'Invalid webhook signature',
      });
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    // Parse and handle event
    const event = JSON.parse(body);

    logger.info({
      message: 'Webhook received',
      type: event.type || 'unknown',
      id: event.id || 'no-id',
    });

    // Process webhook based on type
    switch (event.type) {
      case 'job.completed':
        await handleJobCompleted(event.data);
        break;
      
      case 'content.generated':
        await handleContentGenerated(event.data);
        break;
      
      case 'social.posted':
        await handleSocialPosted(event.data);
        break;
      
      default:
        logger.info({
          message: 'Unhandled webhook type',
          type: event.type,
        });
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    logger.error({
      message: 'Webhook processing failed',
      error: error instanceof Error ? error.message : String(error),
    });
    
    return NextResponse.json(
      { received: true, warning: 'Processing failed' },
      { status: 200 }
    );
  }
}

async function handleJobCompleted(data: any) {
  logger.info({
    message: 'Job completed webhook',
    jobId: data.jobId,
  });
  
  // TODO: Send notification to user
}

async function handleContentGenerated(data: any) {
  logger.info({
    message: 'Content generated webhook',
    contentId: data.contentId,
  });
  
  // TODO: Update content status
}

async function handleSocialPosted(data: any) {
  logger.info({
    message: 'Social post published webhook',
    postId: data.postId,
    platform: data.platform,
  });
  
  // TODO: Update post analytics
}

export { POST };
