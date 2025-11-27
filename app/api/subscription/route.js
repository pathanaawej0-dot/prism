import { auth, currentUser } from '@clerk/nextjs/server'
import { getOrCreateUser, setUserPro } from '@/lib/db'
import { createOrder, PLANS } from '@/lib/razorpay'

export const dynamic = 'force-dynamic'

export async function GET(req) {
  try {
    const { userId } = auth()
    if (!userId) {
      return new Response('Unauthorized', { status: 401 })
    }

    const clerkUser = await currentUser()
    const user = await getOrCreateUser(userId, clerkUser?.emailAddresses?.[0]?.emailAddress)
    
    return new Response(JSON.stringify({
      isPro: user?.is_pro || false,
      plan: user?.is_pro ? PLANS.FLOW : PLANS.SPARK,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Subscription fetch error:', error)
    return new Response(JSON.stringify({ error: 'Failed to fetch subscription', isPro: false }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

export async function POST(req) {
  try {
    const { userId } = auth()
    if (!userId) {
      return new Response('Unauthorized', { status: 401 })
    }

    const clerkUser = await currentUser()
    const email = clerkUser?.emailAddresses?.[0]?.emailAddress || ''
    
    await getOrCreateUser(userId, email)

    // Create Razorpay order
    const order = await createOrder(userId, email)

    return new Response(JSON.stringify(order), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Order creation error:', error)
    return new Response(JSON.stringify({ error: 'Failed to create order' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
