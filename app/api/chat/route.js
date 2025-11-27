import { GoogleGenerativeAI } from '@google/generative-ai'
import { auth, currentUser } from '@clerk/nextjs/server'
import { getOrCreateUser, decrementEnergy } from '@/lib/db'
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

    // Check energy (skip for pro users)
    if (!user.is_pro && user.neural_energy < 2) {
      return new Response(JSON.stringify({ 
        error: 'Insufficient Neural Energy',
        message: 'Wait for energy to refill or upgrade to Pro!'
      }), { 
        status: 429,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const { messages } = await req.json()
    
    // Decrement energy for non-pro users
    if (!user.is_pro) {
      await decrementEnergy(userId, 2)
    }

    // Initialize Gemini inside the function
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY)
    
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
    const history = messages.slice(0, -1).map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }))

    const chat = model.startChat({ history })
    const lastMessage = messages[messages.length - 1]
    
    // Stream the response
    const result = await chat.sendMessageStream(lastMessage.content)
    
    // Create a readable stream for the response
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder()
        
        try {
          for await (const chunk of result.stream) {
            const text = chunk.text()
            if (text) {
              // Format for Vercel AI SDK streaming
              controller.enqueue(encoder.encode(`0:${JSON.stringify(text)}\n`))
            }
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
