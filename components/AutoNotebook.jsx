'use client'

import { useState, useEffect, useCallback } from 'react'
import ReactMarkdown from 'react-markdown'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

export default function AutoNotebook({ content, topic, onSave }) {
  const [localContent, setLocalContent] = useState('')
  const [showCopied, setShowCopied] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState(null)

  useEffect(() => {
    if (content) {
      setLocalContent(prev => {
        if (content !== prev) {
          return content
        }
        return prev
      })
    }
  }, [content])

  // Auto-save to database
  const saveNotebook = useCallback(async () => {
    if (!localContent.trim() || !topic) return
    
    setIsSaving(true)
    try {
      await fetch('/api/notebooks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          topicTitle: topic,
          content: localContent 
        }),
      })
      setLastSaved(new Date())
    } catch (error) {
      console.error('Failed to save notebook:', error)
    } finally {
      setIsSaving(false)
    }
  }, [localContent, topic])

  // Auto-save every 30 seconds if content changed
  useEffect(() => {
    if (!localContent.trim()) return
    
    const timer = setTimeout(() => {
      saveNotebook()
    }, 30000)
    
    return () => clearTimeout(timer)
  }, [localContent, saveNotebook])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(localContent)
      setShowCopied(true)
      setTimeout(() => setShowCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const handleClear = () => {
    setLocalContent('')
  }

  const handleExport = () => {
    const blob = new Blob([`# ${topic}\n\n${localContent}`], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${topic.toLowerCase().replace(/\s+/g, '-')}-notes.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handlePdfExport = async () => {
    const element = document.getElementById('notebook-content')
    if (!element) return

    try {
      const pdf = new jsPDF('p', 'mm', 'a4')
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()

      // Add Title
      pdf.setFillColor(30, 27, 33) // surface-1 color
      pdf.rect(0, 0, pdfWidth, pdfHeight, 'F')
      pdf.setTextColor(230, 225, 229) // on-surface
      pdf.setFontSize(24)
      pdf.text(topic, 20, 30)

      // Use html2canvas to capture the content
      // We'll use a virtual container to ensure consistent width for the PDF
      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: '#1E1B21',
        useCORS: true,
        windowWidth: 800 // Force a width to ensure consistency
      })

      const imgData = canvas.toDataURL('image/png')
      const imgProps = pdf.getImageProperties(imgData)
      const imgWidth = pdfWidth - 40 // 20mm margin on each side
      const imgHeight = (imgProps.height * imgWidth) / imgProps.width

      let heightLeft = imgHeight
      let position = 40 // Start below title

      // First page
      pdf.addImage(imgData, 'PNG', 20, position, imgWidth, imgHeight)
      heightLeft -= (pdfHeight - position - 20) // 20mm bottom margin

      // Subsequent pages
      while (heightLeft > 0) {
        position = heightLeft - imgHeight // Negative position to shift image up
        pdf.addPage()
        pdf.setFillColor(30, 27, 33)
        pdf.rect(0, 0, pdfWidth, pdfHeight, 'F')
        pdf.addImage(imgData, 'PNG', 20, - (imgHeight - heightLeft) + 20, imgWidth, imgHeight) // 20mm top margin
        heightLeft -= (pdfHeight - 40) // 20mm top + 20mm bottom margin
      }

      pdf.save(`${topic.toLowerCase().replace(/\s+/g, '-')}.pdf`)
    } catch (error) {
      console.error('PDF Export failed:', error)
    }
  }

  const handleManualSave = () => {
    saveNotebook()
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Toolbar */}
      <div className="px-4 md:px-6 py-2 md:py-3 flex items-center gap-1 md:gap-2 border-b border-outline-variant/30 flex-wrap">
        <button 
          onClick={handleCopy}
          className="btn-text text-xs md:text-sm flex items-center gap-1 md:gap-2 px-2 md:px-4"
          title="Copy all notes"
        >
          {showCopied ? (
            <>
              <svg className="w-4 h-4 text-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="hidden md:inline">Copied!</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span className="hidden md:inline">Copy</span>
            </>
          )}
        </button>
        
        <div className="flex items-center">
            <button
            onClick={handleExport}
            className="btn-text text-xs md:text-sm flex items-center gap-1 md:gap-2 px-2 md:px-4"
            title="Export as Markdown"
            disabled={!localContent}
            >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span className="hidden md:inline">MD</span>
            </button>
            <button
            onClick={handlePdfExport}
            className="btn-text text-xs md:text-sm flex items-center gap-1 md:gap-2 px-2 md:px-4"
            title="Export as PDF"
            disabled={!localContent}
            >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <span className="hidden md:inline">PDF</span>
            </button>
        </div>

        <button 
          onClick={handleManualSave}
          className="btn-text text-xs md:text-sm flex items-center gap-1 md:gap-2 px-2 md:px-4"
          title="Save to cloud"
          disabled={!localContent || isSaving}
        >
          <svg className={`w-4 h-4 ${isSaving ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <span className="hidden md:inline">{isSaving ? 'Saving...' : 'Save'}</span>
        </button>

        <div className="flex-1" />

        <button 
          onClick={handleClear}
          className="btn-text text-xs md:text-sm flex items-center gap-1 md:gap-2 text-error px-2 md:px-4"
          title="Clear notes"
          disabled={!localContent}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          <span className="hidden md:inline">Clear</span>
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto">
        {localContent ? (
          <div className="p-4 md:p-6" id="notebook-content">
            <div className="glass rounded-2xl p-4 md:p-6">
              <div className="prose-notebook text-sm md:text-base">
                <ReactMarkdown>{localContent}</ReactMarkdown>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center px-4 md:px-8">
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-surface-container-high flex items-center justify-center mb-4">
              <svg className="w-7 h-7 md:w-8 md:h-8 text-on-surface-variant/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h3 className="text-base md:text-lg font-medium text-on-surface mb-2">
              Your Living Notebook
            </h3>
            <p className="text-on-surface-variant/60 text-xs md:text-sm max-w-xs">
              Key concepts and notes will appear here automatically as you learn.
            </p>
          </div>
        )}
      </div>

      {/* Footer Stats */}
      {localContent && (
        <div className="px-4 md:px-6 py-2 md:py-3 border-t border-outline-variant/30 flex items-center justify-between text-xs text-on-surface-variant/60">
          <span>{localContent.split(/\s+/).filter(Boolean).length} words</span>
          <span>
            {lastSaved ? `Saved ${lastSaved.toLocaleTimeString()}` : 'Not saved yet'}
          </span>
        </div>
      )}
    </div>
  )
}
