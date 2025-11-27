import { auth } from '@clerk/nextjs/server'
import { setUserPro } from '@/lib/db'
import crypto from 'crypto'

export async function POST(req) {
  try {
    const { userId } = auth()
    if (!userId) {
      return new Response('Unauthorized', { status: 401 })
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json()

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex')

    if (expectedSignature !== razorpay_signature) {
      return new Response(JSON.stringify({ error: 'Invalid signature' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Payment verified - upgrade user to Pro
    await setUserPro(userId, true)

    return new Response(JSON.stringify({ success: true, message: 'Payment verified! You are now Pro!' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Payment verification error:', error)
    return new Response(JSON.stringify({ error: 'Payment verification failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
