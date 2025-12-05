import Razorpay from 'razorpay'
import crypto from 'crypto'

let razorpay = null

function getRazorpay() {
  if (!razorpay) {
    razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    })
  }
  return razorpay
}

export const PLANS = {
  SPARK: {
    id: 'spark',
    name: 'Spark',
    price: 0,
    features: [
      'Gemini Flash AI',
      '10 messages/day',
      'Manual note-taking',
      'Basic chat history',
    ],
    limits: {
      messagesPerDay: 10,
      autoNotes: true,
    },
  },
  FLOW: {
    id: 'flow',
    name: 'Flow',
    price: 19900, // in paise (₹199)
    features: [
      'Gemini Flash (High Context)',
      'Unlimited messages',
      'Auto-Notes enabled',
      'Priority support',
    ],
    limits: {
      messagesPerDay: Infinity,
      autoNotes: true,
    },
  },
}

export async function createOrder(userId, email) {
  try {
    const order = await getRazorpay().orders.create({
      amount: PLANS.FLOW.price,
      currency: 'INR',
      receipt: `prism_${Date.now()}`,
      notes: {
        userId: userId,
        email: email,
        plan: 'flow',
      },
    })

    return {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    }
  } catch (error) {
    console.error('Razorpay order error:', error)
    throw error
  }
}

export async function cancelSubscription(subscriptionId) {
  try {
    const result = await getRazorpay().subscriptions.cancel(subscriptionId)
    return result
  } catch (error) {
    console.error('Cancel subscription error:', error)
    throw error
  }
}

export async function getSubscription(subscriptionId) {
  try {
    return await getRazorpay().subscriptions.fetch(subscriptionId)
  } catch (error) {
    console.error('Fetch subscription error:', error)
    throw error
  }
}

export function verifyWebhookSignature(body, signature) {
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
    .update(JSON.stringify(body))
    .digest('hex')

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  )
}

export function mapSubscriptionStatus(razorpayStatus) {
  const statusMap = {
    created: 'inactive',
    authenticated: 'trial',
    active: 'active',
    pending: 'inactive',
    halted: 'inactive',
    cancelled: 'cancelled',
    completed: 'inactive',
    expired: 'inactive',
  }
  return statusMap[razorpayStatus] || 'inactive'
}
