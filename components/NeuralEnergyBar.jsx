'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'

export default function NeuralEnergyBar() {
  const [stats, setStats] = useState({ isPro: false, count: 0, limit: 10, remaining: 10 })
  const [showPanel, setShowPanel] = useState(false)

  const fetchStats = useCallback(async () => {
    try {
      // Add timestamp to bypass cache
      const response = await fetch(`/api/energy?t=${Date.now()}`, {
        cache: 'no-store'
      })
      const data = await response.json()
      if (data) {
        setStats({
          isPro: data.isPro || false,
          count: data.count || 0,
          limit: data.limit || 10,
          remaining: data.remaining ?? (10 - (data.count || 0))
        })
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    }
  }, [])

  useEffect(() => {
    fetchStats()
    // Refresh stats every 30 seconds for real-time updates
    const interval = setInterval(fetchStats, 30000)
    return () => clearInterval(interval)
  }, [fetchStats])

  // Listen for custom events to refresh stats (for real-time updates)
  useEffect(() => {
    const handleRefresh = () => fetchStats()
    window.addEventListener('refreshStats', handleRefresh)
    return () => window.removeEventListener('refreshStats', handleRefresh)
  }, [fetchStats])

  const getPercentage = () => {
    if (stats.isPro) return 100
    return Math.max(0, (stats.remaining / stats.limit) * 100)
  }

  const getColor = () => {
    if (stats.isPro) return 'from-primary to-secondary'
    const pct = getPercentage()
    if (pct > 50) return 'from-primary to-secondary'
    if (pct > 20) return 'from-yellow-400 to-orange-400'
    return 'from-error to-red-600'
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowPanel(!showPanel)}
        className="flex items-center gap-3 px-4 py-2 rounded-full bg-surface-container-high hover:bg-surface-container-highest transition-colors"
      >
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-on-surface-variant" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <div className="w-20 h-2 rounded-full bg-surface-container-lowest overflow-hidden">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${getColor()} transition-all duration-500`}
              style={{ width: `${getPercentage()}%` }}
            />
          </div>
        </div>
        <span className="text-sm font-medium text-on-surface-variant">
          {stats.isPro ? 'Unlimited' : `${stats.remaining} left`}
        </span>
      </button>

      {showPanel && (
        <>
          <div className="absolute right-0 top-full mt-2 w-72 bg-surface-container-high rounded-2xl p-4 shadow-google-lg animate-slide-up z-50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-on-surface">Daily Credits</h3>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                stats.isPro 
                  ? 'bg-primary/20 text-primary' 
                  : 'bg-surface-container-highest text-on-surface-variant'
              }`}>
                {stats.isPro ? 'Pro' : 'Free'}
              </span>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-on-surface-variant">Messages Used</span>
                <span className="text-on-surface font-medium">
                  {stats.count} / {stats.isPro ? '∞' : stats.limit}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-on-surface-variant">Remaining Today</span>
                <span className="text-on-surface font-medium">
                  {stats.isPro ? 'Unlimited' : stats.remaining}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-on-surface-variant">Resets</span>
                <span className="text-on-surface font-medium">Daily at midnight</span>
              </div>
            </div>

            {!stats.isPro && (
              <div className="mt-4 p-3 rounded-xl bg-primary/10 border border-primary/20">
                <p className="text-sm text-on-surface mb-2">
                  <span className="font-semibold">Upgrade to Pro</span> for unlimited messages!
                </p>
                <Link 
                  href="/pricing" 
                  className="block w-full text-center py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  Upgrade - ₹199/month
                </Link>
              </div>
            )}
          </div>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowPanel(false)}
          />
        </>
      )}
    </div>
  )
}
