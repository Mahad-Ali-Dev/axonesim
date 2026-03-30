'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Send, CheckCircle2, XCircle, RefreshCw } from 'lucide-react'
import type { OrderWithDetails } from '@/types/database'

export default function OrderActions({ order }: { order: OrderWithDetails }) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)
  const [msg, setMsg] = useState('')

  async function action(type: string) {
    setLoading(type)
    setMsg('')
    const res = await fetch(`/api/admin/orders/${order.id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: type }),
    })
    const data = await res.json()
    setMsg(data.message || data.error || 'Done')
    setLoading(null)
    router.refresh()
  }

  return (
    <div className="bg-[#111] border border-white/5 rounded-2xl p-5 space-y-3">
      <h3 className="font-semibold text-sm text-gray-400 uppercase tracking-wider mb-4">Actions</h3>

      <div className="space-y-2 text-sm mb-4">
        <div className="flex justify-between">
          <span className="text-gray-500">Amount</span>
          <span className="font-semibold text-cyan-400">
            {order.currency === 'PKR' ? `Rs ${order.amount_paid.toLocaleString()}` : `$${order.amount_paid}`}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Payment</span>
          <span className="capitalize">{order.payment_method}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Expires</span>
          <span>{order.expires_at ? new Date(order.expires_at).toLocaleDateString() : '—'}</span>
        </div>
      </div>

      {['pending', 'paid'].includes(order.status) && (
        <button
          onClick={() => action('deliver')}
          disabled={!!loading}
          className="w-full flex items-center justify-center gap-2 bg-green-400/10 hover:bg-green-400/20 border border-green-400/20 text-green-400 font-semibold py-2.5 rounded-xl text-sm transition-colors disabled:opacity-50"
        >
          {loading === 'deliver' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          Deliver eSIM
        </button>
      )}

      <button
        onClick={() => action('resend')}
        disabled={!!loading}
        className="w-full flex items-center justify-center gap-2 bg-cyan-400/10 hover:bg-cyan-400/20 border border-cyan-400/20 text-cyan-400 font-semibold py-2.5 rounded-xl text-sm transition-colors disabled:opacity-50"
      >
        {loading === 'resend' ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
        Resend eSIM
      </button>

      {order.status !== 'activated' && order.qr_code_url && (
        <button
          onClick={() => action('markActivated')}
          disabled={!!loading}
          className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors disabled:opacity-50"
        >
          {loading === 'markActivated' ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
          Mark Activated
        </button>
      )}

      {!['cancelled', 'expired'].includes(order.status) && (
        <button
          onClick={() => action('cancel')}
          disabled={!!loading}
          className="w-full flex items-center justify-center gap-2 bg-red-400/10 hover:bg-red-400/20 border border-red-400/20 text-red-400 font-semibold py-2.5 rounded-xl text-sm transition-colors disabled:opacity-50"
        >
          {loading === 'cancel' ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
          Cancel Order
        </button>
      )}

      {msg && (
        <div className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-gray-300">
          {msg}
        </div>
      )}
    </div>
  )
}
