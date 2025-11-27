import { auth, currentUser } from '@clerk/nextjs/server'
import { extractNotes } from '@/lib/gemini'
import { getOrCreateUser } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function POST(req) {
  try {
    const { userId } = auth()
    if (!userId) {
      return new Response('Unauthorized', { status: 401 })
    }

    const clerkUser = await currentUser()
    const user = await getOrCreateUser(userId, clerkUser?.emailAddresses?.[0]?.emailAddress)

    const { message } = await req.json()
    
    if (!message || message.trim().length === 0) {
      return new Response(JSON.stringify({ notes: '' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const notes = await extractNotes(message)
    
    return new Response(JSON.stringify({ notes }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Notes extraction error:', error)
    return new Response(JSON.stringify({ error: 'Failed to extract notes' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
