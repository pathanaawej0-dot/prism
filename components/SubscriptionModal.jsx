'use client'

import { useState } from 'react'

export default function SubscriptionModal({ onClose }) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const features = {
    spark: [
      'Gemini Flash AI',
      '20 messages/day',
      'Manual note-taking',
      'Basic chat history',
    ],
    flow: [
      'Gemini Flash (High Context)',
      'Unlimited messages',
      'Auto-Notes enabled',
      'Priority support',
      '7-day free trial',
    ],
  }

  const handleSubscribe = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create subscription')
      }

      // Redirect to Razorpay checkout
      if (data.shortUrl) {
        window.location.href = data.shortUrl
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div 
        className="dialog-content max-w-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-on-surface mb-2">
            Upgrade to <span className="text-primary">Flow</span>
          </h2>
          <p className="text-on-surface-variant">
            Unlock unlimited learning with AI-powered auto-notes
          </p>
        </div>

        {/* Plans Comparison */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {/* Spark - Free */}
          <div className="p-6 rounded-2xl bg-surface-container border border-outline-variant/30">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-on-surface">Spark</h3>
              <p className="text-3xl font-bold text-on-surface mt-2">
                Free
              </p>
            </div>
            <ul className="space-y-3">
              {features.spark.map((feature, index) => (
                <li key={index} className="flex items-center gap-3 text-sm text-on-surface-variant">
                  <svg className="w-5 h-5 text-outline flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
            <button className="btn-outlined w-full mt-6" disabled>
              Current Plan
            </button>
          </div>

          {/* Flow - Pro */}
          <div className="p-6 rounded-2xl bg-primary-container/20 border-2 border-primary relative overflow-hidden">
            {/* Popular Badge */}
            <div className="absolute top-4 right-4">
              <span className="chip chip-selected text-xs">Popular</span>
            </div>
            
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-primary">Flow</h3>
              <p className="text-3xl font-bold text-on-surface mt-2">
                ₹499<span className="text-lg font-normal text-on-surface-variant">/month</span>
              </p>
            </div>
            <ul className="space-y-3">
              {features.flow.map((feature, index) => (
                <li key={index} className="flex items-center gap-3 text-sm text-on-surface">
                  <svg className="w-5 h-5 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
            <button 
              onClick={handleSubscribe}
              disabled={isLoading}
              className="btn-filled w-full mt-6 disabled:opacity-50"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Processing...
                </span>
              ) : (
                'Start 7-day free trial'
              )}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-error/20 text-error text-sm text-center">
            {error}
          </div>
        )}

        {/* Footer */}
        <div className="text-center text-xs text-on-surface-variant">
          <p>Cancel anytime. No questions asked.</p>
          <p className="mt-1">Powered by Razorpay • Secure payments</p>
        </div>

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center hover:bg-surface-container-highest transition-colors"
        >
          <svg className="w-5 h-5 text-on-surface-variant" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}
