import { auth, currentUser } from '@clerk/nextjs/server'
import { getOrCreateUser, getNotebooks, createNotebook, updateNotebook } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(req) {
  try {
    const { userId } = auth()
    if (!userId) {
      return new Response('Unauthorized', { status: 401 })
    }

    const clerkUser = await currentUser()
    await getOrCreateUser(userId, clerkUser?.emailAddresses?.[0]?.emailAddress)

    const notebooks = await getNotebooks(userId)
    
    return new Response(JSON.stringify({ notebooks }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Notebooks fetch error:', error)
    return new Response(JSON.stringify({ error: 'Failed to fetch notebooks', notebooks: [] }), {
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

    const { topicTitle, content } = await req.json()

    if (!topicTitle) {
      return new Response(JSON.stringify({ error: 'Topic title is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const notebook = await createNotebook(userId, topicTitle)
    
    if (content) {
      await updateNotebook(notebook.id, userId, content)
    }

    return new Response(JSON.stringify({ notebook }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Notebook creation error:', error)
    return new Response(JSON.stringify({ error: 'Failed to create notebook' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
