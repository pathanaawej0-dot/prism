'use client'

import { useState, useEffect, useCallback } from 'react'
import { useUser, UserButton } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import NavigationRail from '@/components/NavigationRail'
import ChatInterface from '@/components/ChatInterface'
import AutoNotebook from '@/components/AutoNotebook'
import Link from 'next/link'
import { exportNoteToPDF } from '@/lib/pdfExport'

export default function NotebookDetailPage({ params }) {
    const { isLoaded, isSignedIn } = useUser()
    const router = useRouter()
    const [notebook, setNotebook] = useState(null)
    const [notebookContent, setNotebookContent] = useState('')
    const [currentTopic, setCurrentTopic] = useState('Loading...')
    const [showNotebook, setShowNotebook] = useState(true)
    const [isPro, setIsPro] = useState(false)
    const [exporting, setExporting] = useState(false)
    const [showUpgradeModal, setShowUpgradeModal] = useState(false)

    useEffect(() => {
        if (isLoaded && !isSignedIn) {
            router.push('/')
        }
    }, [isLoaded, isSignedIn, router])

    // Fetch user's pro status
    useEffect(() => {
        const fetchProStatus = async () => {
            try {
                const response = await fetch('/api/energy')
                if (response.ok) {
                    const data = await response.json()
                    setIsPro(data.isPro || false)
                }
            } catch (error) {
                console.error('Failed to fetch pro status:', error)
            }
        }
        if (isSignedIn) fetchProStatus()
    }, [isSignedIn])

    // Handle PDF export
    const handleExportPDF = async () => {
        if (!isPro) {
            setShowUpgradeModal(true)
            return
        }
        if (!notebook || exporting) return

        setExporting(true)
        try {
            await exportNoteToPDF({
                topic_title: currentTopic,
                content: notebookContent
            })
        } catch (error) {
            console.error('Failed to export PDF:', error)
            alert('Failed to export PDF. Please try again.')
        } finally {
            setExporting(false)
        }
    }

    // Fetch notebook data
    useEffect(() => {
        if (!params.id) return

        const fetchNotebook = async () => {
            try {
                // Fetch notebook details
                // Note: We need a GET endpoint for specific notebook. 
                // Currently we only have GET /api/notebooks (all) or POST/PATCH.
                // We'll assume we can filter or need to add GET /api/notebooks/[id] logic.
                // For now, let's fetch all and find it (inefficient but works for MVP) or implement GET in [id] route.

                // Actually, let's implement GET in /api/notebooks/[id]/route.js first.
                // Assuming it exists:
                const response = await fetch(`/api/notebooks/${params.id}`)
                if (response.ok) {
                    const data = await response.json()
                    setNotebook(data.notebook)
                    setNotebookContent(data.notebook.content)
                    setCurrentTopic(data.notebook.topic_title)
                }
            } catch (error) {
                console.error('Failed to fetch notebook:', error)
            }
        }

        fetchNotebook()
    }, [params.id])

    const handleNotesUpdate = useCallback(async (newNotes) => {
        setNotebookContent(prev => prev + '\n\n' + newNotes)

        if (params.id) {
            try {
                await fetch(`/api/notebooks/${params.id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ content: newNotes, mode: 'append' }),
                })
            } catch (error) {
                console.error('Failed to save notes:', error)
            }
        }
    }, [params.id])

    if (!isLoaded || !isSignedIn) {
        return (
            <div className="h-screen flex items-center justify-center bg-surface">
                <div className="typing-dot"></div>
            </div>
        )
    }

    return (
        <div className="h-screen flex bg-surface">
            <div className="hidden md:block">
                <NavigationRail />
            </div>

            <div className="flex-1 flex flex-col md:grid md:grid-cols-12 gap-0">
                {/* Left Panel - Chat Interface */}
                <div className={`${showNotebook ? 'hidden md:flex' : 'flex'} md:col-span-7 flex-col h-screen border-r border-outline-variant/30`}>
                    <header className="h-14 md:h-16 px-4 md:px-6 flex items-center justify-between border-b border-outline-variant/30 bg-surface-1">
                        <div className="flex items-center gap-4">
                            <Link href="/notebooks" className="text-on-surface-variant hover:text-primary">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                            </Link>
                            <h1 className="text-lg font-semibold text-primary truncate">{currentTopic}</h1>
                        </div>
                        <div className="flex items-center gap-2 md:gap-4">
                            {/* Export PDF Button */}
                            <button
                                onClick={handleExportPDF}
                                disabled={exporting}
                                className={`hidden md:flex items-center gap-2 px-3 py-2 rounded-xl transition-all ${
                                    isPro 
                                        ? 'bg-primary/10 text-primary hover:bg-primary/20' 
                                        : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'
                                } ${exporting ? 'opacity-50 cursor-not-allowed' : ''}`}
                                title={isPro ? 'Export as PDF' : 'Pro feature - Upgrade to export'}
                            >
                                {exporting ? (
                                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                )}
                                <span className="text-sm font-medium">
                                    {exporting ? 'Exporting...' : 'Export PDF'}
                                </span>
                                {!isPro && (
                                    <span className="text-xs px-1.5 py-0.5 rounded bg-primary/20 text-primary">PRO</span>
                                )}
                            </button>
                            <button
                                onClick={() => setShowNotebook(true)}
                                className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-surface-container-high"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </button>
                            <UserButton afterSignOutUrl="/" />
                        </div>
                    </header>

                    {/* We need to pass initialMessages or sessionId to ChatInterface to load history */}
                    {/* For now, starting a fresh chat for this notebook context */}
                    <ChatInterface
                        onNotesUpdate={handleNotesUpdate}
                        notebookId={params.id} // Pass notebookId to link chat
                    />
                </div>

                {/* Right Panel - Living Notebook */}
                <div className={`${showNotebook ? 'flex' : 'hidden md:flex'} md:col-span-5 flex-col h-screen bg-surface-container-low`}>
                    <header className="h-14 md:h-16 px-4 md:px-6 flex items-center justify-between border-b border-outline-variant/30">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setShowNotebook(false)}
                                className="md:hidden w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container-high"
                            >
                                <svg className="w-5 h-5 text-on-surface-variant" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <h2 className="font-medium text-on-surface">Living Notebook</h2>
                        </div>
                        <span className="chip text-xs">Auto-sync</span>
                    </header>
                    <AutoNotebook content={notebookContent} topic={currentTopic} />
                </div>
            </div>

            {/* Upgrade Modal for non-Pro users */}
            {showUpgradeModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-surface-container-high rounded-2xl p-6 max-w-md w-full shadow-google-xl animate-scale-in">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-on-surface mb-2">Export to PDF</h3>
                            <p className="text-on-surface-variant">
                                PDF export with PRISM branding is a Pro feature. Upgrade to download your notes as beautifully formatted PDFs.
                            </p>
                        </div>

                        <div className="bg-primary/10 rounded-xl p-4 mb-6">
                            <div className="flex items-center justify-between mb-3">
                                <span className="font-semibold text-on-surface">Flow Plan</span>
                                <span className="text-primary font-bold">₹199/month</span>
                            </div>
                            <ul className="space-y-2 text-sm text-on-surface-variant">
                                <li className="flex items-center gap-2">
                                    <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    PDF Export with PRISM branding
                                </li>
                                <li className="flex items-center gap-2">
                                    <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Unlimited messages
                                </li>
                                <li className="flex items-center gap-2">
                                    <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    High-quality auto-notes
                                </li>
                            </ul>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowUpgradeModal(false)}
                                className="flex-1 py-3 px-4 rounded-xl border border-outline-variant text-on-surface hover:bg-surface-container-highest transition-colors"
                            >
                                Maybe Later
                            </button>
                            <Link
                                href="/pricing"
                                className="flex-1 py-3 px-4 rounded-xl bg-primary text-white text-center font-medium hover:bg-primary/90 transition-colors"
                            >
                                Upgrade Now
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
