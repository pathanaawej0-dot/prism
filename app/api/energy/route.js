import { auth, currentUser } from '@clerk/nextjs/server'
import { getOrCreateUser, getUserStats } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(req) {
  try {
    const { userId } = auth()
    if (!userId) {
      return new Response('Unauthorized', { status: 401 })
    }

    const clerkUser = await currentUser()
    await getOrCreateUser(userId, clerkUser?.emailAddresses?.[0]?.emailAddress)

    const stats = await getUserStats(userId)

    return new Response(JSON.stringify({
      isPro: stats.isPro,
      count: stats.count,
      limit: stats.limit,
      remaining: stats.limit - stats.count
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Energy fetch error:', error)
    return new Response(JSON.stringify({ 
      error: 'Failed to fetch stats',
      isPro: false,
      count: 0,
      limit: 10,
      remaining: 10
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
