'use client'

import { useState, useCallback } from 'react'
import { useUser, UserButton } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import NavigationRail from '@/components/NavigationRail'
import ChatInterface from '@/components/ChatInterface'
import AutoNotebook from '@/components/AutoNotebook'
import NeuralEnergyBar from '@/components/NeuralEnergyBar'

export default function LearnPage() {
  const { isLoaded, isSignedIn } = useUser()
  const router = useRouter()
  const [notebookContent, setNotebookContent] = useState('')
  const [currentTopic, setCurrentTopic] = useState('New Session')
  const [showNotebook, setShowNotebook] = useState(false)
  const [notebookId, setNotebookId] = useState(null)

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/')
    }
  }, [isLoaded, isSignedIn, router])

  const handleTopicChange = useCallback(async (newTopic) => {
    setCurrentTopic(newTopic)
    // Create new notebook
    try {
      const res = await fetch('/api/notebooks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topicTitle: newTopic }),
      })
      if (res.ok) {
        const data = await res.json()
        const id = data.notebook?.id || data.id
        if (id) {
          setNotebookId(id)
          return id
        }
      }
    } catch (error) {
      console.error('Failed to create notebook:', error)
    }
    return null
  }, [])

  const handleNotesUpdate = useCallback(async (newNotes) => {
    setNotebookContent(prev => prev + '\n\n' + newNotes)

    if (notebookId) {
      try {
        await fetch(`/api/notebooks/${notebookId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: newNotes, mode: 'append' }),
        })
      } catch (error) {
        console.error('Failed to save notes:', error)
      }
    }
  }, [notebookId])

  if (!isLoaded || !isSignedIn) {
    return (
      <div className="h-screen flex items-center justify-center bg-surface">
        <div className="flex gap-2">
          <div className="typing-dot"></div>
          <div className="typing-dot"></div>
          <div className="typing-dot"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex bg-surface">
      {/* Navigation Rail - Hidden on mobile */}
      <div className="hidden md:block">
        <NavigationRail />
      </div>

      <div className="flex-1 flex flex-col md:grid md:grid-cols-12 gap-0">
        {/* Left Panel - Chat Interface */}
        <div className={`${showNotebook ? 'hidden md:flex' : 'flex'} md:col-span-7 flex-col h-screen border-r border-outline-variant/30`}>
          <header className="h-14 md:h-16 px-4 md:px-6 flex items-center justify-between border-b border-outline-variant/30 bg-surface-1">
            <div className="flex items-center gap-2 md:gap-4 min-w-0">
              <h1 className="text-lg md:text-xl font-semibold text-primary">PRISM</h1>
              <span className="text-on-surface-variant/60 hidden md:inline">|</span>
              <span className="text-on-surface-variant text-sm truncate max-w-[120px] md:max-w-none">{currentTopic}</span>
            </div>
            <div className="flex items-center gap-2 md:gap-4">
              {/* Mobile notebook toggle */}
              <button
                onClick={() => setShowNotebook(true)}
                className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-surface-container-high text-on-surface-variant"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </button>
              <NeuralEnergyBar />
              <UserButton afterSignOutUrl="/" />
            </div>
          </header>
          <ChatInterface
            onNotesUpdate={handleNotesUpdate}
            onTopicChange={handleTopicChange}
            notebookId={notebookId}
          />
        </div>

        {/* Right Panel - Living Notebook */}
        <div className={`${showNotebook ? 'flex' : 'hidden md:flex'} md:col-span-5 flex-col h-screen bg-surface-container-low`}>
          <header className="h-14 md:h-16 px-4 md:px-6 flex items-center justify-between border-b border-outline-variant/30">
            <div className="flex items-center gap-3">
              {/* Mobile back button */}
              <button
                onClick={() => setShowNotebook(false)}
                className="md:hidden w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container-high"
              >
                <svg className="w-5 h-5 text-on-surface-variant" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h2 className="font-medium text-on-surface">Living Notebook</h2>
            </div>
            <span className="chip text-xs">Auto-sync</span>
          </header>
          <AutoNotebook content={notebookContent} topic={currentTopic} />
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-surface-1 border-t border-outline-variant/30 flex items-center justify-around px-4 z-50">
        <a href="/learn" className="flex flex-col items-center gap-1 text-primary">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          <span className="text-xs">Learn</span>
        </a>
        <a href="/notebooks" className="flex flex-col items-center gap-1 text-on-surface-variant">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <span className="text-xs">Notes</span>
        </a>
        <a href="/pricing" className="flex flex-col items-center gap-1 text-on-surface-variant">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-xs">Pricing</span>
        </a>
        <a href="/settings" className="flex flex-col items-center gap-1 text-on-surface-variant">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-xs">Settings</span>
        </a>
      </div>
    </div>
  )
}
