'use client'

import { useUser, SignInButton } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function Home() {
  const { isLoaded, isSignedIn } = useUser()
  const router = useRouter()
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push('/learn')
    }
  }, [isLoaded, isSignedIn, router])

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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
    <div className="min-h-screen bg-surface overflow-x-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-google-mesh opacity-30"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-google-blue-500/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-google-green-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-google-yellow-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-google-red-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }}></div>
      </div>

      {/* Header */}
      <header className="relative z-10 px-4 md:px-6 py-4 backdrop-blur-glass-sm bg-surface/50 border-b border-outline-variant/20 sticky top-0">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 animate-slide-right">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-google-blue-500 to-google-green-500 flex items-center justify-center shadow-glow-blue">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="text-xl font-bold text-gradient">PRISM</span>
          </div>
          <nav className="flex items-center gap-4 animate-slide-left">
            <Link href="/pricing" className="text-on-surface-variant hover:text-primary transition-colors hidden md:inline font-medium">
              Pricing
            </Link>
            <Link href="/docs" className="text-on-surface-variant hover:text-primary transition-colors hidden md:inline font-medium">
              Docs
            </Link>
            <SignInButton mode="modal">
              <button className="btn-filled">Get Started</button>
            </SignInButton>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10">
        <section className="px-4 md:px-6 pt-20 md:pt-32 pb-20 md:pb-32">
          <div className="max-w-6xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 animate-fade-in-up backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              <span className="text-sm text-primary font-medium">Powered by Google Gemini AI</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-on-surface mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              Learn from{' '}
              <span className="text-gradient">First Principles</span>
            </h1>

            <p className="text-lg md:text-xl text-on-surface-variant max-w-3xl mx-auto mb-10 animate-fade-in-up leading-relaxed" style={{ animationDelay: '0.2s' }}>
              Break down complex concepts into fundamental truths. PRISM uses AI to teach you the way great thinkers learn — by questioning everything.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <SignInButton mode="modal">
                <button className="btn-filled text-lg px-8 py-4 shadow-google-lg">
                  <span className="flex items-center gap-2">
                    Start Learning Free
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </button>
              </SignInButton>
              <Link href="/pricing" className="btn-outlined text-lg px-8 py-4">
                View Pricing
              </Link>
            </div>

            {/* Demo Preview */}
            <div className="max-w-4xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <div className="card-glass p-8 shadow-google-xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-google-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-google-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-google-green-500"></div>
                  </div>
                  <div className="flex-1 h-8 bg-surface-container-high rounded-lg flex items-center px-4">
                    <span className="text-sm text-on-surface-variant">prism.app/learn</span>
                  </div>
                </div>
                <div className="bg-surface-container-low rounded-xl p-6 text-left">
                  <div className="chat-bubble-user mb-4 animate-slide-left" style={{ animationDelay: '0.6s' }}>
                    Explain quantum entanglement
                  </div>
                  <div className="chat-bubble-assistant animate-slide-right" style={{ animationDelay: '0.8s' }}>
                    <p className="mb-2">Let me break this down from first principles...</p>
                    <p className="text-sm opacity-80">Think of two coins that are magically linked. When you flip one and it lands on heads, the other instantly becomes tails - no matter how far apart they are.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid - Bento Style */}
        <section className="px-4 md:px-6 py-20 bg-surface-container-low/30">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-on-surface mb-4">
                Everything you need to <span className="text-gradient">master anything</span>
              </h2>
              <p className="text-lg text-on-surface-variant max-w-2xl mx-auto">
                Powered by cutting-edge AI, designed for deep understanding
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: (
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  ),
                  title: 'First Principles Thinking',
                  description: 'AI diagnoses your knowledge gaps and breaks concepts into atomic truths you can build from.',
                  color: 'blue',
                },
                {
                  icon: (
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  ),
                  title: 'Living Notebook',
                  description: 'Notes generate automatically as you learn. Key definitions, formulas, and insights appear like magic.',
                  color: 'green',
                },
                {
                  icon: (
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ),
                  title: 'Instant Doubt Resolution',
                  description: 'Select any text you don\'t understand. Get a simple analogy explanation in seconds.',
                  color: 'yellow',
                },
                {
                  icon: (
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  ),
                  title: 'Lightning Fast',
                  description: 'Powered by Google Gemini for instant responses. No waiting, just learning.',
                  color: 'red',
                },
                {
                  icon: (
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                  ),
                  title: 'Adaptive Learning',
                  description: 'AI adjusts to your level and learning style. Everyone gets a personalized experience.',
                  color: 'green',
                },
                {
                  icon: (
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  ),
                  title: 'Privacy First',
                  description: 'Your learning data stays private. We never sell your information.',
                  color: 'blue',
                },
              ].map((feature, idx) => (
                <div
                  key={idx}
                  className="card-glass hover:shadow-google-lg transition-all duration-300 group cursor-pointer"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <div className={`w-16 h-16 rounded-2xl bg-google-${feature.color}-500/20 flex items-center justify-center mx-auto mb-4 text-google-${feature.color}-500 group-hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-on-surface mb-2 text-center">{feature.title}</h3>
                  <p className="text-on-surface-variant text-sm text-center leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="px-4 md:px-6 py-20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-on-surface mb-4">
                Simple, Transparent Pricing
              </h2>
              <p className="text-lg text-on-surface-variant max-w-2xl mx-auto">
                Start for free, upgrade for unlimited power.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Free Plan */}
              <div className="card-outlined p-8 hover:border-primary/50 transition-colors">
                <h3 className="text-2xl font-bold text-on-surface mb-2">Spark</h3>
                <div className="text-4xl font-bold text-on-surface mb-4">Free</div>
                <p className="text-on-surface-variant mb-6">Perfect for getting started</p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-3 text-on-surface">
                    <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    10 messages per day
                  </li>
                  <li className="flex items-center gap-3 text-on-surface">
                    <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    Basic chat history
                  </li>
                  <li className="flex items-center gap-3 text-on-surface">
                    <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    Auto-generated notes
                  </li>
                </ul>
                <SignInButton mode="modal">
                  <button className="btn-outlined w-full">Start Free</button>
                </SignInButton>
              </div>

              {/* Pro Plan */}
              <div className="card-glass p-8 border-primary/30 relative overflow-hidden group">
                <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-3 py-1 rounded-bl-lg">POPULAR</div>
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                <h3 className="text-2xl font-bold text-on-surface mb-2">Flow</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-4xl font-bold text-on-surface">₹199</span>
                  <span className="text-on-surface-variant">/month</span>
                </div>
                <p className="text-on-surface-variant mb-6">Unlimited access for serious learners</p>

                <ul className="space-y-3 mb-8 relative z-10">
                  <li className="flex items-center gap-3 text-on-surface">
                    <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    Unlimited messages
                  </li>
                  <li className="flex items-center gap-3 text-on-surface">
                    <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    High-Quality Auto-notes
                  </li>
                  <li className="flex items-center gap-3 text-on-surface">
                    <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    Unlimited Neural Energy
                  </li>
                </ul>
                <Link href="/pricing" className="btn-filled w-full block text-center relative z-10">
                  Upgrade Now
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof */}
        <section className="px-4 md:px-6 py-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-on-surface-variant text-lg mb-8">Trusted by learners worldwide</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {[
                  { number: '10,000+', label: 'Active Learners' },
                  { number: '500K+', label: 'Notes Generated' },
                  { number: '4.9/5', label: 'User Rating' },
                  { number: '50+', label: 'Topics Covered' },
                ].map((stat, idx) => (
                  <div key={idx} className="animate-fade-in-up" style={{ animationDelay: `${idx * 0.1}s` }}>
                    <div className="text-3xl md:text-4xl font-bold text-gradient mb-2">{stat.number}</div>
                    <div className="text-on-surface-variant text-sm">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Final CTA */}
            <div className="card-glass p-12 text-center shadow-google-xl">
              <h2 className="text-3xl md:text-4xl font-bold text-on-surface mb-4">
                Ready to learn smarter?
              </h2>
              <p className="text-lg text-on-surface-variant mb-8 max-w-2xl mx-auto">
                Join thousands of learners who are mastering complex topics with PRISM
              </p>
              <SignInButton mode="modal">
                <button className="btn-filled text-lg px-10 py-4 shadow-glow-blue">
                  Start Learning for Free
                </button>
              </SignInButton>
              <p className="text-sm text-on-surface-variant mt-4">No credit card required</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 px-4 md:px-6 py-12 border-t border-outline-variant/20 bg-surface-container-low/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-google-blue-500 to-google-green-500 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                  </svg>
                </div>
                <span className="text-xl font-bold text-gradient">PRISM</span>
              </div>
              <p className="text-on-surface-variant text-sm max-w-sm">
                Learn from first principles with AI-powered education. Master any topic by understanding it deeply.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-on-surface mb-3">Product</h3>
              <ul className="space-y-2 text-sm text-on-surface-variant">
                <li><Link href="/pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
                <li><Link href="/learn" className="hover:text-primary transition-colors">Features</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-on-surface mb-3">Company</h3>
              <ul className="space-y-2 text-sm text-on-surface-variant">
                <li><a href="#" className="hover:text-primary transition-colors">About</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-outline-variant/20 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-on-surface-variant">© 2024 PRISM. All rights reserved.</p>
            <div className="flex items-center gap-6 text-sm text-on-surface-variant">
              <a href="#" className="hover:text-primary transition-colors">Privacy</a>
              <a href="#" className="hover:text-primary transition-colors">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
