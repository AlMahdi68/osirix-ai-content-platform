// Stripe Webhook Handler
import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import crypto from 'crypto';

export const runtime = 'nodejs';

async function POST(req: NextRequest) {
  const signature = req.headers.get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    logger.warn({
      message: 'Webhook signature or secret missing',
      hasSignature: !!signature,
      hasSecret: !!webhookSecret,
    });
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  try {
    const body = await req.text();
    
    // Verify webhook signature
    const timestamp = req.headers.get('stripe-timestamp') || Math.floor(Date.now() / 1000).toString();
    const signatureString = `${timestamp}.${body}`;
    
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(signatureString)
      .digest('hex');

    // Constant-time comparison
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

    // Parse event
    const event = JSON.parse(body);

    logger.info({
      message: 'Webhook received',
      type: event.type,
      id: event.id,
    });

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object);
        break;
      
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionChange(event.data.object);
        break;
      
      case 'customer.subscription.deleted':
        await handleSubscriptionCancelled(event.data.object);
        break;
      
      case 'invoice.paid':
        await handleInvoicePaid(event.data.object);
        break;
      
      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object);
        break;
      
      default:
        logger.info({
          message: 'Unhandled webhook event type',
          type: event.type,
        });
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    logger.error({
      message: 'Webhook processing failed',
      error: error instanceof Error ? error.message : String(error),
    });
    
    // Return 200 to prevent retries (logged for manual review)
    return NextResponse.json(
      { received: true, warning: 'Processing failed' },
      { status: 200 }
    );
  }
}

async function handleCheckoutCompleted(session: any) {
  logger.info({
    message: 'Checkout completed',
    customerId: session.customer,
    amountTotal: session.amount_total,
  });
  
  // TODO: Update user subscription/credits in database
}

async function handleSubscriptionChange(subscription: any) {
  logger.info({
    message: 'Subscription changed',
    customerId: subscription.customer,
    status: subscription.status,
    planId: subscription.items?.data[0]?.price?.id,
  });
  
  // TODO: Update user subscription in database
}

async function handleSubscriptionCancelled(subscription: any) {
  logger.info({
    message: 'Subscription cancelled',
    customerId: subscription.customer,
    cancelAt: subscription.cancel_at,
  });
  
  // TODO: Handle subscription cancellation
}

async function handleInvoicePaid(invoice: any) {
  logger.info({
    message: 'Invoice paid',
    customerId: invoice.customer,
    amountPaid: invoice.amount_paid,
  });
  
  // TODO: Grant credits or extend subscription
}

async function handlePaymentFailed(invoice: any) {
  logger.error({
    message: 'Payment failed',
    customerId: invoice.customer,
    attemptCount: invoice.attempt_count,
  });
  
  // TODO: Send payment failure notification
}

export { POST };
