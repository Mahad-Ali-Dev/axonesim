'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Package, ArrowRight, MessageCircle } from 'lucide-react'

export default function TrackOrderPage() {
  const router = useRouter()
  const [orderId, setOrderId] = useState('')
  const [error, setError]     = useState('')

  function handleTrack(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = orderId.trim()
    if (!trimmed) { setError('Please enter your Order ID.'); return }
    router.push(`/order/${trimmed}`)
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-4">
      <div className="max-w-lg mx-auto">

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
            <Package className="w-8 h-8 text-violet-400" />
          </div>
        </div>

        <h1 className="text-3xl font-black text-center mb-2">Track Your Order</h1>
        <p className="text-slate-500 text-center text-sm mb-10">
          Enter your Order ID to check your eSIM delivery status.
        </p>

        <div className="card rounded-2xl p-6">
          <form onSubmit={handleTrack} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 block">
                Order ID
              </label>
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={orderId}
                  onChange={e => { setOrderId(e.target.value); setError('') }}
                  placeholder="e.g. AXN-1234567"
                  className="input pl-10 w-full font-mono"
                  autoComplete="off"
                  spellCheck={false}
                />
              </div>
              {error && <p className="text-red-400 text-xs mt-1.5">{error}</p>}
              <p className="text-xs text-slate-600 mt-1.5">
                Your Order ID was shown on the confirmation page and sent via WhatsApp.
              </p>
            </div>

            <button
              type="submit"
              className="btn-primary w-full py-3.5 rounded-xl flex items-center justify-center gap-2 font-bold"
            >
              Track Order <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Can't find order */}
        <div className="mt-6 text-center">
          <p className="text-sm text-slate-500 mb-3">Can&apos;t find your Order ID?</p>
          <a
            href="https://wa.me/923349542871?text=Hi! I need help tracking my eSIM order."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-semibold hover:bg-green-500/20 transition-colors"
          >
            <MessageCircle className="w-4 h-4" /> Contact us on WhatsApp
          </a>
        </div>

      </div>
    </div>
  )
}
