'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import ReactMarkdown from 'react-markdown'
import DoubtResolver from './DoubtResolver'

export default function ChatInterface({ onNotesUpdate, onTopicChange, notebookId }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedText, setSelectedText] = useState('')
  const [showDoubtResolver, setShowDoubtResolver] = useState(false)
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })
  const messagesEndRef = useRef(null)
  const chatContainerRef = useRef(null)
  const textareaRef = useRef(null)

  // Load history if notebookId is provided
  useEffect(() => {
    if (notebookId) {
      const fetchHistory = async () => {
        try {
          const response = await fetch(`/api/chat/history?notebookId=${notebookId}`)
          if (response.ok) {
            const data = await response.json()
            if (data.messages) {
              setMessages(data.messages)
            }
          }
        } catch (error) {
          console.error('Failed to load chat history:', error)
        }
      }
      fetchHistory()
    }
  }, [notebookId])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const extractNotes = async (message) => {
    try {
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      })

      if (response.ok) {
        const data = await response.json()
        if (data.notes) {
          onNotesUpdate?.(data.notes)
        }
      }
    } catch (error) {
      console.error('Failed to extract notes:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput('')

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = '48px'
    }

    // Detect topic from first message
    let currentNotebookId = notebookId
    if (messages.length === 0 && onTopicChange) {
      const id = await onTopicChange(userMessage.slice(0, 50) + (userMessage.length > 50 ? '...' : ''))
      if (id) currentNotebookId = id
    }

    const newMessages = [...messages, { role: 'user', content: userMessage }]
    setMessages(newMessages)
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages, notebookId: currentNotebookId }), // Use currentNotebookId
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || error.error || 'Chat request failed')
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let assistantMessage = ''

      setMessages([...newMessages, { role: 'assistant', content: '' }])

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n').filter(Boolean)

        for (const line of lines) {
          if (line.startsWith('0:')) {
            try {
              const text = JSON.parse(line.slice(2))
              assistantMessage += text
              setMessages(prev => {
                const updated = [...prev]
                updated[updated.length - 1] = { role: 'assistant', content: assistantMessage }
                return updated
              })
            } catch (e) {
              // Ignore parse errors for streaming
            }
          }
        }
      }

      // Extract notes after message complete
      if (assistantMessage) {
        extractNotes(assistantMessage)
      }
      
      // Trigger stats refresh for real-time update (with small delay to ensure DB is updated)
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('refreshStats'))
      }, 500)
    } catch (error) {
      console.error('Chat error:', error)
      setMessages(prev => [...prev.slice(0, -1), {
        role: 'assistant',
        content: error.message || `Something went wrong. Please try again.`
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const handleDoubtClick = () => {
    setShowDoubtResolver(true)
  }

  const getRecentContext = () => {
    return messages
      .slice(-3)
      .map(m => `${m.role}: ${m.content}`)
      .join('\n\n')
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden relative">
      {/* Messages Container */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4"
      >
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center px-4 md:px-8">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-3xl bg-primary/10 flex items-center justify-center mb-6 glow-primary">
              <svg className="w-8 h-8 md:w-10 md:h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h2 className="text-xl md:text-2xl font-semibold text-on-surface mb-3">
              What do you want to learn?
            </h2>
            <p className="text-on-surface-variant max-w-md mb-8 text-sm md:text-base">
              I'll teach you from First Principles — breaking complex ideas into their fundamental truths.
            </p>
            <div className="flex flex-wrap gap-2 md:gap-3 justify-center">
              {['Black Holes', 'Quantum Computing', 'Machine Learning', 'Economics'].map((topic) => (
                <button
                  key={topic}
                  onClick={() => setInput(topic)}
                  className="chip hover:chip-selected transition-all text-sm"
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}
          >
            <div className={`${message.role === 'user'
              ? 'bg-primary text-primary-on rounded-2xl rounded-br-sm px-4 py-3 max-w-[85%] md:max-w-[75%]'
              : 'bg-surface-container-high text-on-surface rounded-2xl rounded-bl-sm px-4 py-3 max-w-[90%] md:max-w-[85%]'}`}
            >
              {message.role === 'assistant' ? (
                <div className="prose-notebook text-sm md:text-base">
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                </div>
              ) : (
                <p className="text-sm md:text-base whitespace-pre-wrap">{message.content}</p>
              )}
            </div>
          </div>
        ))}

        {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
          <div className="flex justify-start animate-fade-in">
            <div className="bg-surface-container-high rounded-2xl rounded-bl-sm px-4 py-3">
              <div className="flex gap-2 py-1">
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Selection Tooltip */}
      {selectedText && (
        <div
          className="tooltip"
          style={{
            left: tooltipPosition.x,
            top: tooltipPosition.y,
            transform: 'translate(-50%, -100%)'
          }}
        >
          <button
            onClick={handleDoubtClick}
            className="flex items-center gap-2 text-inverse-on-surface hover:text-primary transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Explain this?
          </button>
        </div>
      )}

      {/* Doubt Resolver Modal */}
      {showDoubtResolver && (
        <DoubtResolver
          selectedText={selectedText}
          context={getRecentContext()}
          onClose={() => {
            setShowDoubtResolver(false)
            setSelectedText('')
          }}
        />
      )}

      {/* Input Area */}
      <div className="p-3 md:p-4 border-t border-outline-variant/30 bg-surface-1">
        <form onSubmit={handleSubmit} className="flex gap-2 md:gap-3 items-end">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => {
                setInput(e.target.value)
                e.target.style.height = 'auto'
                e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`
              }}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything... (Shift+Enter for new line)"
              className="w-full px-4 py-3 bg-surface-container-high rounded-2xl text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none overflow-y-auto text-sm md:text-base custom-scrollbar"
              disabled={isLoading}
              rows={1}
              style={{ minHeight: '48px', maxHeight: '200px' }}
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="w-12 h-12 flex items-center justify-center bg-primary text-primary-on rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors flex-shrink-0"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </form>
        <p className="text-xs text-on-surface-variant/40 mt-2 text-center hidden md:block">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  )
}
