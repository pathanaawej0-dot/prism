import { auth } from '@clerk/nextjs/server'
import { getChatHistoryByNotebook } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(req) {
    try {
        const { userId } = auth()
        if (!userId) {
            return new Response('Unauthorized', { status: 401 })
        }

        const { searchParams } = new URL(req.url)
        const notebookId = searchParams.get('notebookId')

        if (!notebookId) {
            return new Response('Notebook ID required', { status: 400 })
        }

        const rawMessages = await getChatHistoryByNotebook(notebookId, userId)
        
        // Map 'model' role to 'assistant' for frontend compatibility
        const messages = rawMessages.map(msg => ({
            role: msg.role === 'model' ? 'assistant' : msg.role,
            content: msg.content
        }))

        return new Response(JSON.stringify({ messages }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        })
    } catch (error) {
        console.error('Chat history fetch error:', error)
        return new Response(JSON.stringify({ error: 'Failed to fetch chat history' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        })
    }
}
