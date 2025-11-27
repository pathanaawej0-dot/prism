import { verifyWebhookSignature, mapSubscriptionStatus } from '@/lib/razorpay'
import { updateSubscription, setUserPro, getSQL } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function POST(req) {
  try {
    const body = await req.json()
    const signature = req.headers.get('x-razorpay-signature')

    // Verify webhook signature
    if (!verifyWebhookSignature(body, signature)) {
      return new Response('Invalid signature', { status: 400 })
    }

    const { event, payload } = body
    const sql = getSQL()

    switch (event) {
      case 'subscription.authenticated':
      case 'subscription.activated': {
        const subscription = payload.subscription.entity
        
        // Find user by customer_id
        const users = await sql`
          SELECT user_id FROM subscriptions 
          WHERE razorpay_customer_id = ${subscription.customer_id}
        `
        
        if (users.length > 0) {
          const userId = users[0].user_id
          
          await updateSubscription(userId, {
            subscriptionId: subscription.id,
            customerId: subscription.customer_id,
            planId: subscription.plan_id,
            status: mapSubscriptionStatus(subscription.status),
            currentPeriodEnd: subscription.current_end 
              ? new Date(subscription.current_end * 1000) 
              : null,
          })

          // Set user as pro
          if (subscription.status === 'active' || subscription.status === 'authenticated') {
            await setUserPro(userId, true)
          }
        }
        break
      }

      case 'subscription.charged': {
        const payment = payload.payment.entity
        const subscription = payload.subscription.entity
        
        const users = await sql`
          SELECT user_id FROM subscriptions 
          WHERE razorpay_subscription_id = ${subscription.id}
        `
        
        if (users.length > 0) {
          const userId = users[0].user_id
          await setUserPro(userId, true)
          
          await updateSubscription(userId, {
            subscriptionId: subscription.id,
            customerId: subscription.customer_id,
            planId: subscription.plan_id,
            status: 'active',
            currentPeriodEnd: subscription.current_end 
              ? new Date(subscription.current_end * 1000) 
              : null,
          })
        }
        break
      }

      case 'subscription.cancelled':
      case 'subscription.halted':
      case 'subscription.completed': {
        const subscription = payload.subscription.entity
        
        const users = await sql`
          SELECT user_id FROM subscriptions 
          WHERE razorpay_subscription_id = ${subscription.id}
        `
        
        if (users.length > 0) {
          const userId = users[0].user_id
          await setUserPro(userId, false)
          
          await updateSubscription(userId, {
            subscriptionId: subscription.id,
            customerId: subscription.customer_id,
            planId: subscription.plan_id,
            status: mapSubscriptionStatus(subscription.status),
            currentPeriodEnd: null,
          })
        }
        break
      }

      case 'payment.failed': {
        // Handle failed payment - could send notification
        console.log('Payment failed:', payload.payment.entity.id)
        break
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Webhook error:', error)
    return new Response(JSON.stringify({ error: 'Webhook processing failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
