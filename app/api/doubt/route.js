import { auth, currentUser } from '@clerk/nextjs/server'
import { resolveDoubt } from '@/lib/gemini'
import { getOrCreateUser, decrementEnergy } from '@/lib/db'

export async function POST(req) {
  try {
    const { userId } = auth()
    if (!userId) {
      return new Response('Unauthorized', { status: 401 })
    }

    const clerkUser = await currentUser()
    const user = await getOrCreateUser(userId, clerkUser?.emailAddresses?.[0]?.emailAddress)

    const { selectedText, context } = await req.json()
    
    if (!selectedText || selectedText.trim().length === 0) {
      return new Response(JSON.stringify({ error: 'No text selected' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Decrement energy (1 point for doubt resolution)
    if (!user.is_pro) {
      await decrementEnergy(userId, 1)
    }

    const explanation = await resolveDoubt(selectedText, context || '')
    
    return new Response(JSON.stringify({ explanation }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Doubt resolution error:', error)
    return new Response(JSON.stringify({ error: 'Failed to resolve doubt' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
