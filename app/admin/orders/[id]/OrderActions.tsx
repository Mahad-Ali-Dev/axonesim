'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Send, CheckCircle2, XCircle, RefreshCw, QrCode, ExternalLink, Image as ImageIcon } from 'lucide-react'
import type { OrderWithDetails } from '@/types/database'

export default function OrderActions({ order }: { order: OrderWithDetails }) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)
  const [msg,     setMsg]     = useState('')
  const [isError, setIsError] = useState(false)

  // Manual eSIM entry
  const [qrCodeUrl, setQrCodeUrl] = useState((order as any).qr_code_url ?? '')
  const [esimCode,  setEsimCode]  = useState((order as any).esim_code   ?? '')
  const [showForm,  setShowForm]  = useState(false)

  // Extract screenshot URL from payment transaction_id
  const screenshotUrl = (() => {
    const payments = (order as any).payments ?? []
    for (const p of payments) {
      if (typeof p.transaction_id === 'string' && p.transaction_id.startsWith('screenshot:')) {
        return p.transaction_id.replace('screenshot:', '')
      }
    }
    return null
  })()

  async function action(type: string, extra?: Record<string, string>) {
    setLoading(type)
    setMsg('')
    setIsError(false)
    const res = await fetch(`/api/admin/orders/${order.id}`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ action: type, ...extra }),
    })
    const data = await res.json()
    setMsg(data.message || data.error || 'Done')
    setIsError(!res.ok)
    setLoading(null)
    if (res.ok) router.refresh()
  }

  return (
    <div className="space-y-4">

      {/* ── Payment screenshot ─────────────────────────────────── */}
      {screenshotUrl && (
        <div className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
            <ImageIcon className="w-4 h-4 text-green-400" />
            <span className="text-sm font-semibold text-green-400">Payment Screenshot</span>
            <a href={screenshotUrl} target="_blank" rel="noopener noreferrer"
              className="ml-auto flex items-center gap-1 text-xs text-slate-500 hover:text-white transition-colors">
              Full size <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <div className="p-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={screenshotUrl}
              alt="Payment proof"
              className="w-full rounded-xl object-contain max-h-64 bg-black"
            />
          </div>
        </div>
      )}

      {/* ── Order info ─────────────────────────────────────────── */}
      <div className="bg-[#111] border border-white/5 rounded-2xl p-5 space-y-3">
        <h3 className="font-semibold text-sm text-gray-400 uppercase tracking-wider mb-4">Actions</h3>

        <div className="space-y-2 text-sm mb-4">
          <div className="flex justify-between">
            <span className="text-gray-500">Amount</span>
            <span className="font-semibold text-violet-400">
              {order.currency === 'PKR' ? `Rs ${order.amount_paid.toLocaleString()}` : `$${order.amount_paid}`}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Payment</span>
            <span className="capitalize">{order.payment_method}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Status</span>
            <span className="capitalize">{order.status}</span>
          </div>
        </div>

        {/* ── Set eSIM manually ── */}
        <button
          onClick={() => setShowForm(v => !v)}
          className="w-full flex items-center justify-center gap-2 bg-violet-500/10 hover:bg-violet-500/20 border border-violet-500/20 text-violet-400 font-semibold py-2.5 rounded-xl text-sm transition-colors"
        >
          <QrCode className="w-4 h-4" />
          {showForm ? 'Hide eSIM Form' : (order.status === 'delivered' ? 'Update eSIM Details' : 'Set eSIM & Deliver')}
        </button>

        {showForm && (
          <div className="space-y-3 pt-1">
            <div>
              <label className="text-xs text-gray-500 mb-1.5 block">QR Code URL</label>
              <input
                value={qrCodeUrl}
                onChange={e => setQrCodeUrl(e.target.value)}
                placeholder="https://...qr-image.png"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-violet-500/50 transition-colors"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1.5 block">Activation Code</label>
              <textarea
                value={esimCode}
                onChange={e => setEsimCode(e.target.value)}
                placeholder="LPA:1$..."
                rows={3}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-violet-500/50 transition-colors font-mono resize-none"
              />
            </div>
            <button
              onClick={() => action('setEsim', { qrCodeUrl, esimCode })}
              disabled={!!loading || (!qrCodeUrl && !esimCode)}
              className="w-full flex items-center justify-center gap-2 bg-green-400/10 hover:bg-green-400/20 border border-green-400/20 text-green-400 font-semibold py-2.5 rounded-xl text-sm transition-colors disabled:opacity-50"
            >
              {loading === 'setEsim'
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</>
                : <><Send className="w-4 h-4" /> Save eSIM &amp; Mark Delivered</>
              }
            </button>
            <p className="text-xs text-gray-600 text-center">This marks order as delivered and emails the customer.</p>
          </div>
        )}

        {/* ── Other actions ── */}
        {['pending', 'paid'].includes(order.status) && (
          <button
            onClick={() => action('deliver')}
            disabled={!!loading}
            className="w-full flex items-center justify-center gap-2 bg-cyan-400/10 hover:bg-cyan-400/20 border border-cyan-400/20 text-cyan-400 font-semibold py-2.5 rounded-xl text-sm transition-colors disabled:opacity-50"
          >
            {loading === 'deliver' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            Auto-Deliver eSIM
          </button>
        )}

        <button
          onClick={() => action('resend')}
          disabled={!!loading}
          className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 font-semibold py-2.5 rounded-xl text-sm transition-colors disabled:opacity-50"
        >
          {loading === 'resend' ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
          Resend eSIM
        </button>

        {order.status !== 'activated' && (order as any).qr_code_url && (
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
          <div className={`rounded-xl px-3 py-2 text-xs ${isError ? 'bg-red-500/10 border border-red-500/20 text-red-400' : 'bg-white/5 border border-white/10 text-gray-300'}`}>
            {msg}
          </div>
        )}
      </div>

    </div>
  )
}
