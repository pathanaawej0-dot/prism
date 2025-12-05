import { auth } from '@clerk/nextjs/server'
import { appendToNotebook, updateNotebook, getNotebook, deleteNotebook } from '@/lib/db'

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

        return new Response(JSON.stringify({ notebook }), {
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

export async function PATCH(req, { params }) {
    try {
        const { userId } = auth()
        if (!userId) {
            return new Response('Unauthorized', { status: 401 })
        }

        const { id } = params
        const { content, mode = 'append' } = await req.json()

        if (!content) {
            return new Response(JSON.stringify({ error: 'Content is required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            })
        }

        let notebook
        if (mode === 'append') {
            notebook = await appendToNotebook(id, userId, content)
        } else {
            notebook = await updateNotebook(id, userId, content)
        }

        return new Response(JSON.stringify({ notebook }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        })
    } catch (error) {
        console.error('Notebook update error:', error)
        return new Response(JSON.stringify({ error: 'Failed to update notebook' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        })
    }
}

export async function DELETE(req, { params }) {
    try {
        const { userId } = auth()
        if (!userId) {
            return new Response('Unauthorized', { status: 401 })
        }

        const { id } = params
        const notebook = await deleteNotebook(id, userId)

        if (!notebook) {
            return new Response('Notebook not found', { status: 404 })
        }

        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        })
    } catch (error) {
        console.error('Notebook delete error:', error)
        return new Response(JSON.stringify({ error: 'Failed to delete notebook' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        })
    }
}
