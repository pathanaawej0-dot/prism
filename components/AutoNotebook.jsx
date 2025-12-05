'use client'

import { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'

export default function AutoNotebook({ content, topic }) {
    const [notes, setNotes] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (content) {
            setNotes(content)
        }
    }, [content])

    return (
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
            {notes ? (
                <div className="max-w-3xl mx-auto">
                    <div className="mb-6">
                        <h1 className="text-2xl md:text-3xl font-bold text-primary mb-2">{topic}</h1>
                        <div className="h-1 w-20 bg-gradient-to-r from-primary via-secondary to-tertiary rounded-full"></div>
                    </div>
                    <div className="prose-notebook">
                        <ReactMarkdown>{notes}</ReactMarkdown>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-full text-center p-8">
                    <div className="w-20 h-20 rounded-3xl bg-surface-container-high flex items-center justify-center mb-6">
                        <svg className="w-10 h-10 text-on-surface-variant/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-on-surface mb-2">Your notebook is empty</h3>
                    <p className="text-on-surface-variant max-w-sm">
                        Start chatting to generate notes automatically. Key concepts and insights will appear here.
                    </p>
                </div>
            )}
        </div>
    )
}
