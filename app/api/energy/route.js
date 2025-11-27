import { auth, currentUser } from '@clerk/nextjs/server'
import { getOrCreateUser, refillEnergy, addReferralBonus } from '@/lib/db'

export async function GET(req) {
  try {
    const { userId } = auth()
    if (!userId) {
      return new Response('Unauthorized', { status: 401 })
    }

    // Ensure user exists first
    const clerkUser = await currentUser()
    await getOrCreateUser(userId, clerkUser?.emailAddresses?.[0]?.emailAddress)

    // Refill energy based on time passed
    const result = await refillEnergy(userId)
    
    return new Response(JSON.stringify({ 
      energy: result?.neural_energy || 100 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Energy fetch error:', error)
    return new Response(JSON.stringify({ error: 'Failed to fetch energy' }), {
      status: 500,
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

    const { referralCode } = await req.json()
    
    if (referralCode) {
      const result = await addReferralBonus(userId, referralCode)
      return new Response(JSON.stringify(result), {
        status: result.success ? 200 : 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ error: 'Invalid request' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Energy update error:', error)
    return new Response(JSON.stringify({ error: 'Failed to update energy' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
