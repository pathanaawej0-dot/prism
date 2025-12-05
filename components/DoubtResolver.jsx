'use client'

import { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'

export default function DoubtResolver({ selectedText, context, onClose }) {
  const [explanation, setExplanation] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    resolveDoubt()
  }, [selectedText])

  const resolveDoubt = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/doubt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ selectedText, context }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get explanation')
      }

      setExplanation(data.explanation)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div
        className="dialog-content max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <h2 className="font-semibold text-on-surface">Quick Explanation</h2>
              <p className="text-xs text-on-surface-variant">Simplified analogy</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-surface-container-highest transition-colors"
          >
            <svg className="w-5 h-5 text-on-surface-variant" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Selected Text */}
        <div className="mb-4 p-3 rounded-xl bg-surface-container border-l-4 border-primary">
          <p className="text-sm text-on-surface-variant italic">"{selectedText}"</p>
        </div>

        {/* Explanation */}
        <div className="min-h-[100px]">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="flex gap-2">
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 rounded-full bg-error/20 flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <p className="text-error text-sm">{error}</p>
              <button
                onClick={resolveDoubt}
                className="btn-text mt-3"
              >
                Try Again
              </button>
            </div>
          ) : (
            <div className="prose-notebook text-sm">
              <ReactMarkdown>{explanation}</ReactMarkdown>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-outline-variant/30 flex justify-end gap-3">
          <button onClick={onClose} className="btn-text">
            Got it!
          </button>
          <button
            onClick={() => {
              navigator.clipboard.writeText(explanation)
            }}
            className="btn-tonal flex items-center gap-2"
            disabled={isLoading || error}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Copy
          </button>
        </div>
      </div>
    </div>
  )
}
