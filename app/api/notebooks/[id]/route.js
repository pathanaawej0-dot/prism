import { auth } from '@clerk/nextjs/server'
import { getNotebook, getSQL } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(req, { params }) {
  try {
    const { userId } = auth()
    if (!userId) {
      return new Response('Unauthorized', { status: 401 })
    }

    const { id } = params
    const notebook = await getNotebook(id, userId)

    if (!notebook) {
      return new Response('Notebook not found', { status: 404 })
    }

    // Also fetch the associated chat session
    const db = getSQL()
    // Assuming one session per notebook for now, or taking the latest
    const sessions = await db`
        SELECT * FROM chat_sessions
        WHERE notebook_id = ${id} AND user_id = ${userId}
        ORDER BY created_at DESC
        LIMIT 1
    `

    let chatSession = null
    let messages = []

    if (sessions.length > 0) {
        chatSession = sessions[0]
        messages = await db`
            SELECT * FROM chat_messages
            WHERE session_id = ${chatSession.id}
            ORDER BY created_at ASC
        `
    }

    return new Response(JSON.stringify({ notebook, chatSession, messages }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Notebook fetch error:', error)
    return new Response(JSON.stringify({ error: 'Failed to fetch notebook' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
