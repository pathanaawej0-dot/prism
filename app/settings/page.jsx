'use client'

import { useState, useEffect } from 'react'
import { useUser, UserButton } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import NavigationRail from '@/components/NavigationRail'
import NeuralEnergyBar from '@/components/NeuralEnergyBar'

export default function SettingsPage() {
  const { isLoaded, isSignedIn, user } = useUser()
  const router = useRouter()
  const [subscription, setSubscription] = useState(null)
  const [loading, setLoading] = useState(true)
  const [upgrading, setUpgrading] = useState(false)

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/')
    }
  }, [isLoaded, isSignedIn, router])

  useEffect(() => {
    if (isSignedIn) {
      fetchSubscription()
    }
  }, [isSignedIn])

  const fetchSubscription = async () => {
    try {
      const res = await fetch('/api/subscription')
      const data = await res.json()
      setSubscription(data)
    } catch (error) {
      console.error('Failed to fetch subscription:', error)
    } finally {
      setLoading(false)
    }
  }

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
          // Verify payment
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
            window.location.reload()
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
      <NavigationRail />
      <div className="flex-1 flex flex-col">
        <header className="h-16 px-6 flex items-center justify-between border-b border-outline-variant/30 bg-surface-1">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold text-primary">PRISM</h1>
            <span className="text-on-surface-variant/60">|</span>
            <span className="text-on-surface-variant">Settings</span>
          </div>
          <div className="flex items-center gap-4">
            <NeuralEnergyBar />
            <UserButton afterSignOutUrl="/" />
          </div>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-2xl mx-auto">
            {/* Profile Section */}
            <section className="card-elevated mb-6">
              <h2 className="text-lg font-semibold text-on-surface mb-4">Profile</h2>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden">
                  {user?.imageUrl ? (
                    <img src={user.imageUrl} alt="Profile" className="w-16 h-16 rounded-full" />
                  ) : (
                    <span className="text-2xl text-primary font-semibold">
                      {user?.firstName?.[0] || user?.emailAddresses?.[0]?.emailAddress?.[0]?.toUpperCase()}
                    </span>
                  )}
                </div>
                <div>
                  <p className="font-medium text-on-surface">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-sm text-on-surface-variant">
                    {user?.emailAddresses?.[0]?.emailAddress}
                  </p>
                </div>
              </div>
            </section>

            {/* Subscription Section */}
            <section className="card-elevated mb-6">
              <h2 className="text-lg font-semibold text-on-surface mb-4">Subscription</h2>
              
              {loading ? (
                <div className="flex gap-2 py-4">
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between p-4 rounded-xl bg-surface-container mb-4">
                    <div>
                      <p className="font-medium text-on-surface">
                        {subscription?.isPro ? 'Flow Plan' : 'Spark Plan'}
                      </p>
                      <p className="text-sm text-on-surface-variant">
                        {subscription?.isPro ? '₹499/month • Unlimited' : 'Free • 20 messages/day'}
                      </p>
                    </div>
                    <span className={`chip ${subscription?.isPro ? 'chip-selected' : ''}`}>
                      {subscription?.isPro ? 'Active' : 'Free'}
                    </span>
                  </div>

                  {!subscription?.isPro && (
                    <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
                      <h3 className="font-semibold text-primary mb-2">Upgrade to Flow</h3>
                      <ul className="text-sm text-on-surface-variant space-y-1 mb-4">
                        <li>✓ Unlimited messages</li>
                        <li>✓ Auto-Notes enabled</li>
                        <li>✓ Priority support</li>
                        <li>✓ 7-day free trial</li>
                      </ul>
                      <button 
                        onClick={handleUpgrade}
                        disabled={upgrading}
                        className="btn-filled w-full disabled:opacity-50"
                      >
                        {upgrading ? 'Processing...' : 'Start Free Trial - ₹499/month'}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </section>

            {/* Referral Section */}
            <section className="card-elevated">
              <h2 className="text-lg font-semibold text-on-surface mb-4">Refer & Earn</h2>
              <p className="text-on-surface-variant mb-4">
                Share PRISM with friends and get <span className="text-primary font-semibold">+50% Neural Energy</span> for each signup!
              </p>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  readOnly 
                  value={typeof window !== 'undefined' ? `${window.location.origin}/?ref=SHARE` : ''}
                  className="input-outlined flex-1 text-sm"
                />
                <button 
                  className="btn-tonal"
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/?ref=SHARE`)
                    alert('Link copied!')
                  }}
                >
                  Copy
                </button>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  )
}
