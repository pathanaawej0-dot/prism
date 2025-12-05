'use client'

import { useState, useEffect, useCallback } from 'react'
import { useUser, UserButton } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import NavigationRail from '@/components/NavigationRail'
import NeuralEnergyBar from '@/components/NeuralEnergyBar'

export default function NotebooksPage() {
  const { isLoaded, isSignedIn } = useUser()
  const router = useRouter()
  const [notebooks, setNotebooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/')
    }
  }, [isLoaded, isSignedIn, router])

  const fetchNotebooks = useCallback(async () => {
    try {
      const res = await fetch('/api/notebooks')
      const data = await res.json()
      setNotebooks(data.notebooks || [])
    } catch (error) {
      console.error('Failed to fetch notebooks:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (isSignedIn) {
      fetchNotebooks()
    }
  }, [isSignedIn, fetchNotebooks])

  const handleDelete = async (notebookId, e) => {
    e.preventDefault()
    e.stopPropagation()
    
    try {
      const res = await fetch(`/api/notebooks/${notebookId}`, {
        method: 'DELETE'
      })
      if (res.ok) {
        setNotebooks(prev => prev.filter(n => n.id !== notebookId))
        setDeleteConfirm(null)
      }
    } catch (error) {
      console.error('Failed to delete notebook:', error)
    }
  }

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
      <div className="hidden md:block">
        <NavigationRail />
      </div>

      <div className="flex-1 flex flex-col">
        <header className="h-14 md:h-16 px-4 md:px-6 flex items-center justify-between border-b border-outline-variant/30 bg-surface-1">
          <div className="flex items-center gap-2 md:gap-4">
            <h1 className="text-lg md:text-xl font-semibold text-primary">PRISM</h1>
            <span className="text-on-surface-variant/60 hidden md:inline">|</span>
            <span className="text-on-surface-variant text-sm">Notebooks</span>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <NeuralEnergyBar />
            <UserButton afterSignOutUrl="/" />
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 overflow-y-auto pb-24 md:pb-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 md:mb-8">
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-on-surface">Your Notebooks</h2>
                <p className="text-on-surface-variant text-sm mt-1">All your learning notes in one place</p>
              </div>
              <Link href="/learn" className="btn-filled flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New Session
              </Link>
            </div>

            {loading ? (
              <div className="flex justify-center py-16">
                <div className="flex gap-2">
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                </div>
              </div>
            ) : notebooks.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 rounded-3xl bg-surface-container-high flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-on-surface-variant/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-on-surface mb-2">No notebooks yet</h3>
                <p className="text-on-surface-variant mb-6">Start a learning session to create your first notebook</p>
                <Link href="/learn" className="btn-tonal">Start Learning</Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {notebooks.map((notebook) => (
                  <div key={notebook.id} className="relative group">
                    <Link 
                      href={`/notebooks/${notebook.id}`} 
                      className="card-elevated hover:bg-surface-2 transition-colors cursor-pointer block"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                          <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <span className="text-xs text-on-surface-variant">
                          {new Date(notebook.updated_at).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="font-medium text-on-surface mb-1 line-clamp-1">{notebook.topic_title}</h3>
                      <p className="text-sm text-on-surface-variant line-clamp-2">
                        {notebook.content?.slice(0, 100) || 'Empty notebook'}
                      </p>
                    </Link>
                    
                    {/* Delete button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        setDeleteConfirm(notebook.id)
                      }}
                      className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-surface-container-highest/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-error/20 hover:text-error"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-surface-container-high rounded-2xl p-6 max-w-sm w-full shadow-google-xl animate-scale-in">
              <h3 className="text-lg font-semibold text-on-surface mb-2">Delete Notebook?</h3>
              <p className="text-on-surface-variant text-sm mb-6">
                This will permanently delete this notebook and all its chat history. This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 py-2 px-4 rounded-lg border border-outline-variant text-on-surface hover:bg-surface-container-highest transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={(e) => handleDelete(deleteConfirm, e)}
                  className="flex-1 py-2 px-4 rounded-lg bg-error text-white hover:bg-error/90 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Bottom Navigation */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-surface-1 border-t border-outline-variant/30 flex items-center justify-around px-4 z-40">
          <Link href="/learn" className="flex flex-col items-center gap-1 text-on-surface-variant">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            <span className="text-xs">Learn</span>
          </Link>
          <Link href="/notebooks" className="flex flex-col items-center gap-1 text-primary">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <span className="text-xs">Notes</span>
          </Link>
          <Link href="/pricing" className="flex flex-col items-center gap-1 text-on-surface-variant">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-xs">Pricing</span>
          </Link>
          <Link href="/settings" className="flex flex-col items-center gap-1 text-on-surface-variant">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-xs">Settings</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
