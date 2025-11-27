'use client'

import { useUser, SignInButton } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'

export default function Home() {
  const { isLoaded, isSignedIn } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push('/learn')
    }
  }, [isLoaded, isSignedIn, router])

  if (!isLoaded) {
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

  if (isSignedIn) {
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
    <div className="min-h-screen bg-surface">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-gradient-to-br from-primary/5 via-transparent to-tertiary/5 pointer-events-none" />
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-tertiary/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 px-4 md:px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
            <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="text-xl font-semibold text-primary">PRISM</span>
        </div>
        <nav className="flex items-center gap-4">
          <Link href="/pricing" className="text-on-surface-variant hover:text-on-surface transition-colors hidden md:inline">
            Pricing
          </Link>
          <SignInButton mode="modal">
            <button className="btn-filled">Get Started</button>
          </SignInButton>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 px-4 md:px-6 pt-12 md:pt-20 pb-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            <span className="text-sm text-primary">Powered by Google Gemini AI</span>
          </div>

          {/* Logo */}
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl bg-primary/20 flex items-center justify-center mx-auto mb-8 glow-primary">
            <svg className="w-12 h-12 md:w-16 md:h-16 text-primary" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-on-surface mb-6">
            Learn from <span className="text-primary">First Principles</span>
          </h1>
          
          <p className="text-lg md:text-xl text-on-surface-variant max-w-2xl mx-auto mb-10">
            Break down complex concepts into fundamental truths. PRISM uses AI to teach you the way great thinkers learn — by questioning everything.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <SignInButton mode="modal">
              <button className="btn-filled text-lg px-8 py-4">
                Start Learning Free
              </button>
            </SignInButton>
            <Link href="/pricing" className="btn-outlined text-lg px-8 py-4">
              View Pricing
            </Link>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 mt-20">
            {[
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                ),
                title: 'First Principles Thinking',
                description: 'AI diagnoses your knowledge gaps and breaks concepts into atomic truths you can build from.'
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                ),
                title: 'Living Notebook',
                description: 'Notes generate automatically as you learn. Key definitions, formulas, and insights appear like magic.'
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: 'Instant Doubt Resolution',
                description: 'Select any text you don\'t understand. Get a simple analogy explanation in seconds.'
              },
            ].map((feature, idx) => (
              <div key={idx} className="card-elevated text-center p-6 md:p-8 hover:bg-surface-2 transition-colors">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 text-primary">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-on-surface mb-2">{feature.title}</h3>
                <p className="text-on-surface-variant text-sm">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Social Proof */}
          <div className="mt-20 py-10 border-t border-outline-variant/30">
            <p className="text-on-surface-variant mb-6">Trusted by learners worldwide</p>
            <div className="flex flex-wrap justify-center gap-8 items-center opacity-60">
              <span className="text-2xl font-bold text-on-surface">1,000+</span>
              <span className="text-on-surface-variant">Active Learners</span>
              <span className="text-2xl font-bold text-on-surface">50,000+</span>
              <span className="text-on-surface-variant">Notes Generated</span>
              <span className="text-2xl font-bold text-on-surface">4.9/5</span>
              <span className="text-on-surface-variant">User Rating</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 px-4 md:px-6 py-8 border-t border-outline-variant/30">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <svg className="w-4 h-4 text-primary" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="text-on-surface-variant">PRISM - Deep Space Academy</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-on-surface-variant">
            <Link href="/pricing" className="hover:text-on-surface transition-colors">Pricing</Link>
            <span>© 2024 PRISM</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
