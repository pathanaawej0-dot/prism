'use client'

import { useState, useEffect } from 'react'

export default function NeuralEnergyBar() {
  const [energy, setEnergy] = useState(100)
  const [showShare, setShowShare] = useState(false)
  const [referralCode, setReferralCode] = useState('')

  useEffect(() => {
    fetchEnergy()
    const interval = setInterval(fetchEnergy, 60000) // Check every minute
    return () => clearInterval(interval)
  }, [])

  const fetchEnergy = async () => {
    try {
      const response = await fetch('/api/energy')
      const data = await response.json()
      if (data.energy !== undefined) {
        setEnergy(data.energy)
      }
    } catch (error) {
      console.error('Failed to fetch energy:', error)
    }
  }

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}?ref=${referralCode}`
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'PRISM - Deep Space Academy',
          text: 'Learn anything from First Principles with AI!',
          url: shareUrl,
        })
      } catch (error) {
        // User cancelled or error
      }
    } else {
      await navigator.clipboard.writeText(shareUrl)
      alert('Share link copied!')
    }
  }

  const getEnergyColor = () => {
    if (energy > 50) return 'from-primary to-tertiary'
    if (energy > 20) return 'from-yellow-400 to-orange-400'
    return 'from-error to-red-600'
  }

  const getEnergyLabel = () => {
    if (energy > 70) return 'High'
    if (energy > 30) return 'Medium'
    return 'Low'
  }

  return (
    <div className="relative">
      <button 
        onClick={() => setShowShare(!showShare)}
        className="flex items-center gap-3 px-4 py-2 rounded-full bg-surface-container-high hover:bg-surface-container-highest transition-colors"
      >
        {/* Battery Icon */}
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-on-surface-variant" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          
          {/* Energy Bar */}
          <div className="w-20 h-2 rounded-full bg-surface-container-lowest overflow-hidden">
            <div 
              className={`h-full rounded-full bg-gradient-to-r ${getEnergyColor()} transition-all duration-500`}
              style={{ width: `${energy}%` }}
            />
          </div>
        </div>

        {/* Percentage */}
        <span className="text-sm font-medium text-on-surface-variant">
          {energy}%
        </span>
      </button>

      {/* Dropdown Panel */}
      {showShare && (
        <div className="absolute right-0 top-full mt-2 w-72 bg-surface-container-high rounded-2xl p-4 shadow-elevation-3 animate-slide-up z-50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-on-surface">Neural Energy</h3>
            <span className={`chip text-xs ${energy > 50 ? 'chip-selected' : 'bg-error/20 text-error'}`}>
              {getEnergyLabel()}
            </span>
          </div>

          {/* Energy Stats */}
          <div className="space-y-3 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-on-surface-variant">Current</span>
              <span className="text-on-surface font-medium">{energy}%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-on-surface-variant">Refill Rate</span>
              <span className="text-on-surface font-medium">+5% / hour</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-on-surface-variant">Cost per Message</span>
              <span className="text-on-surface font-medium">-2%</span>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-outline-variant/30 my-4" />

          {/* Share for Energy */}
          <div className="text-center">
            <p className="text-sm text-on-surface-variant mb-3">
              Share with a friend & get <span className="text-primary font-semibold">+50% Energy</span>
            </p>
            <button 
              onClick={handleShare}
              className="btn-tonal w-full flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              Share PRISM
            </button>
          </div>

          {/* Pro Upgrade */}
          <div className="mt-4 p-3 rounded-xl bg-primary/10 border border-primary/20">
            <p className="text-sm text-primary-on-container mb-2">
              <span className="font-semibold">Upgrade to Pro</span> for unlimited energy!
            </p>
            <button className="btn-filled w-full text-sm py-2">
              ₹499/month • 7-day trial
            </button>
          </div>
        </div>
      )}

      {/* Click outside to close */}
      {showShare && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowShare(false)}
        />
      )}
    </div>
  )
}
