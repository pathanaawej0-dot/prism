'use client'

import { useState } from 'react'
import { useUser, SignInButton, UserButton } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import NavigationRail from '@/components/NavigationRail'

export default function PricingPage() {
  const { isLoaded, isSignedIn, user } = useUser()
  const router = useRouter()
  const [upgrading, setUpgrading] = useState(false)

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true)
        return
      }
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }

  const handleUpgrade = async () => {
    if (!isSignedIn) {
      return
    }

    setUpgrading(true)
    try {
      const loaded = await loadRazorpay()
      if (!loaded) {
        alert('Failed to load payment gateway')
        return
      }

      const res = await fetch('/api/subscription', { method: 'POST' })
      const data = await res.json()

      if (data.error) {
        alert(data.error)
        return
      }

      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: 'PRISM',
        description: 'Flow Plan - Monthly Subscription',
        order_id: data.orderId,
        handler: async function (response) {
          const verifyRes = await fetch('/api/subscription/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          })
          const verifyData = await verifyRes.json()
          if (verifyData.success) {
            alert('Payment successful! You are now a Pro member!')
            router.push('/learn')
          } else {
            alert('Payment verification failed')
          }
        },
        prefill: {
          email: user?.emailAddresses?.[0]?.emailAddress,
          name: `${user?.firstName || ''} ${user?.lastName || ''}`.trim(),
        },
        theme: {
          color: '#D0BCFF',
        },
      }

      const paymentObject = new window.Razorpay(options)
      paymentObject.open()
    } catch (error) {
      console.error('Failed to initiate payment:', error)
      alert('Failed to initiate payment')
    } finally {
      setUpgrading(false)
    }
  }

  const plans = [
    {
      name: 'Spark',
      price: 'Free',
      description: 'Perfect for getting started',
      features: [
        { text: 'Gemini AI Chat', included: true },
        { text: '10 messages per day', included: true },
        { text: 'Manual note-taking', included: true },
        { text: 'Basic chat history', included: true },
        { text: 'Auto-generated notes', included: true },
        { text: 'Unlimited messages', included: false },
        { text: 'Priority support', included: false },
        { text: 'Export notes as PDF', included: false },
      ],
      cta: 'Current Plan',
      popular: false,
    },
    {
      name: 'Flow',
      price: '₹199',
      period: '/month',
      description: 'Unlimited access for serious learners',
      features: [
        { text: 'Gemini AI Chat', included: true },
        { text: 'Unlimited messages', included: true },
        { text: 'High-Quality Auto-notes', included: true },
        { text: 'Full chat history', included: true },
        { text: 'Priority support', included: true },
        { text: 'Export notes as PDF', included: true },
        { text: 'Unlimited Neural Energy', included: true },
        { text: 'Early access to features', included: true },
      ],
      cta: 'Upgrade Now',
      popular: true,
    },
  ]

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <header className="h-16 px-4 md:px-6 flex items-center justify-between border-b border-outline-variant/30 bg-surface-1">
        <a href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
            <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="text-xl font-semibold text-primary">PRISM</span>
        </a>
        <div className="flex items-center gap-4">
          {isSignedIn ? (
            <>
              <a href="/learn" className="btn-text hidden md:inline-flex">Go to App</a>
              <UserButton afterSignOutUrl="/" />
            </>
          ) : (
            <SignInButton mode="modal">
              <button className="btn-filled">Sign In</button>
            </SignInButton>
          )}
        </div>
      </header>

      {/* Hero */}
      <div className="text-center py-12 md:py-20 px-4">
        <h1 className="text-3xl md:text-5xl font-bold text-on-surface mb-4">
          Simple, Transparent Pricing
        </h1>
        <p className="text-on-surface-variant text-lg max-w-xl mx-auto">
          Choose the plan that fits your learning journey. Upgrade or downgrade anytime.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-4xl mx-auto px-4 pb-20">
        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-3xl p-6 md:p-8 relative ${plan.popular
                ? 'bg-primary/10 border-2 border-primary'
                : 'bg-surface-container border border-outline-variant/30'
                }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="chip chip-selected text-xs">Most Popular</span>
                </div>
              )}

              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-on-surface mb-2">{plan.name}</h2>
                <p className="text-on-surface-variant text-sm mb-4">{plan.description}</p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl md:text-5xl font-bold text-on-surface">{plan.price}</span>
                  {plan.period && <span className="text-on-surface-variant">{plan.period}</span>}
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    {feature.included ? (
                      <svg className="w-5 h-5 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-on-surface-variant/30 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                    <span className={feature.included ? 'text-on-surface' : 'text-on-surface-variant/50'}>
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>

              {plan.popular ? (
                isSignedIn ? (
                  <button
                    onClick={handleUpgrade}
                    disabled={upgrading}
                    className="btn-filled w-full py-4 text-lg disabled:opacity-50"
                  >
                    {upgrading ? 'Processing...' : plan.cta}
                  </button>
                ) : (
                  <SignInButton mode="modal">
                    <button className="btn-filled w-full py-4 text-lg">
                      Sign Up to Upgrade
                    </button>
                  </SignInButton>
                )
              ) : (
                <button className="btn-outlined w-full py-4 text-lg" disabled>
                  {plan.cta}
                </button>
              )}
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-20">
          <h2 className="text-2xl font-bold text-on-surface text-center mb-10">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {[
              {
                q: 'Can I cancel anytime?',
                a: 'Yes! You can cancel your subscription at any time. You\'ll continue to have access until the end of your billing period.'
              },
              {
                q: 'What payment methods do you accept?',
                a: 'We accept all major credit/debit cards, UPI, net banking, and wallets through Razorpay.'
              },
              {
                q: 'Is there a free trial?',
                a: 'The Spark plan is completely free! You can use it forever to experience PRISM before upgrading.'
              },
              {
                q: 'What happens to my notes if I downgrade?',
                a: 'Your notes are always yours. They\'ll remain accessible even if you downgrade to the free plan.'
              },
            ].map((faq, idx) => (
              <div key={idx} className="card-elevated">
                <h3 className="font-semibold text-on-surface mb-2">{faq.q}</h3>
                <p className="text-on-surface-variant text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
