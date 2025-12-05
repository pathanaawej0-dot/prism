import { GoogleGenerativeAI } from '@google/generative-ai'
import { auth, currentUser } from '@clerk/nextjs/server'
import { getOrCreateUser, checkAndIncrementDailyLimit, createChatSession, saveChatMessage, getChatHistoryByNotebook } from '@/lib/db'
import { FIRST_PRINCIPLES_SYSTEM_PROMPT } from '@/lib/gemini'

export const dynamic = 'force-dynamic'

export async function POST(req) {
  try {
    const { userId } = auth()
    if (!userId) {
      return new Response('Unauthorized', { status: 401 })
    }

    const clerkUser = await currentUser()
    const user = await getOrCreateUser(userId, clerkUser?.emailAddresses?.[0]?.emailAddress)
    if (!user) {
      return new Response('Failed to get/create user', { status: 500 })
    }

    // Check daily limit
    const limitCheck = await checkAndIncrementDailyLimit(userId)
    if (!limitCheck.allowed) {
      return new Response(JSON.stringify({
        error: 'Daily Limit Reached',
        message: limitCheck.error
      }), {
        status: 429,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const { messages, notebookId } = await req.json()
    const lastUserMessage = messages[messages.length - 1]

    // Save user message if notebookId is present
    let sessionId = null
    if (notebookId) {
      // Get or create session
      // We need a topic, but if it's an existing notebook, we can just use "Chat" or fetch notebook title.
      // For now, we'll use "Chat Session" as topic if creating new.
      const session = await import('@/lib/db').then(mod => mod.ensureChatSession(userId, notebookId, 'Chat Session'))
      sessionId = session.id

      await import('@/lib/db').then(mod => mod.saveChatMessage(sessionId, 'user', lastUserMessage.content))
    }

    // Initialize Gemini inside the function
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY)

    // Build chat history for Gemini
    // Build chat history for Gemini
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.7,
      },
      systemInstruction: FIRST_PRINCIPLES_SYSTEM_PROMPT,
    })

    // Convert messages to Gemini format
    let history = messages.slice(0, -1).map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }))

    // Ensure history starts with a user message
    if (history.length > 0 && history[0].role !== 'user') {
      // If the first message is from the model, prepend a dummy user message or remove it
      // Removing it is safer for context if it was just a greeting
      history = history.slice(1)
    }

    const chat = model.startChat({ history })
    const lastMessage = messages[messages.length - 1]

    // Stream the response
    const result = await chat.sendMessageStream(lastMessage.content)

    // Create a readable stream for the response
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder()
        let fullResponse = ''

        try {
          for await (const chunk of result.stream) {
            const text = chunk.text()
            if (text) {
              fullResponse += text
              // Format for Vercel AI SDK streaming
              controller.enqueue(encoder.encode(`0:${JSON.stringify(text)}\n`))
            }
          }

          // Save assistant message if we have a session
          if (sessionId && fullResponse) {
            await import('@/lib/db').then(mod => mod.saveChatMessage(sessionId, 'assistant', fullResponse))
          }

          controller.close()
        } catch (error) {
          controller.error(error)
        }
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  } catch (error) {
    console.error('Chat API error:', error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
