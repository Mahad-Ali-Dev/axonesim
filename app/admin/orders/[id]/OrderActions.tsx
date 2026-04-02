'use client'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
  Loader2, Send, CheckCircle2, XCircle, RefreshCw,
  QrCode, ExternalLink, Image as ImageIcon, Upload, X,
} from 'lucide-react'
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

  // QR image upload
  const fileInputRef             = useRef<HTMLInputElement>(null)
  const [qrFile,     setQrFile]  = useState<File | null>(null)
  const [qrPreview,  setQrPreview] = useState<string>('')
  const [isDragging, setIsDragging] = useState(false)

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

  function handleFileSelect(file: File | null) {
    if (!file) return
    setQrFile(file)
    setQrPreview(URL.createObjectURL(file))
    // Clear manual URL if image is picked
    setQrCodeUrl('')
  }

  function clearQrImage() {
    setQrFile(null)
    setQrPreview('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

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

  async function saveEsim() {
    setLoading('setEsim')
    setMsg('')
    setIsError(false)

    let finalQrUrl = qrCodeUrl

    // Upload image first if one was selected
    if (qrFile) {
      const form = new FormData()
      form.append('file', qrFile)
      form.append('orderId', order.id)
      const upRes  = await fetch('/api/admin/upload', { method: 'POST', body: form })
      const upData = await upRes.json()
      if (!upRes.ok) {
        setMsg(upData.error || 'Image upload failed')
        setIsError(true)
        setLoading(null)
        return
      }
      finalQrUrl = upData.url
    }

    const res = await fetch(`/api/admin/orders/${order.id}`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ action: 'setEsim', qrCodeUrl: finalQrUrl, esimCode }),
    })
    const data = await res.json()
    setMsg(data.message || data.error || 'Done')
    setIsError(!res.ok)
    setLoading(null)
    if (res.ok) {
      setQrFile(null)
      setQrPreview('')
      router.refresh()
    }
  }

  const canSave = !loading && (!!qrFile || !!qrCodeUrl || !!esimCode)

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

            {/* ── QR Image Upload ── */}
            <div>
              <label className="text-xs text-gray-500 mb-1.5 block">
                QR Code Image <span className="text-gray-600">(optional)</span>
              </label>

              {qrPreview ? (
                /* Preview */
                <div className="relative rounded-xl overflow-hidden border border-white/10 bg-black">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={qrPreview} alt="QR preview" className="w-full object-contain max-h-48" />
                  <button
                    onClick={clearQrImage}
                    className="absolute top-2 right-2 bg-black/70 hover:bg-black rounded-full p-1 text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                /* Drop zone */
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={e => { e.preventDefault(); setIsDragging(true) }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={e => {
                    e.preventDefault()
                    setIsDragging(false)
                    handleFileSelect(e.dataTransfer.files[0] ?? null)
                  }}
                  className={`flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed py-6 cursor-pointer transition-colors
                    ${isDragging
                      ? 'border-violet-500/60 bg-violet-500/10'
                      : 'border-white/10 hover:border-violet-500/30 hover:bg-white/5'}`}
                >
                  <Upload className="w-5 h-5 text-gray-500" />
                  <span className="text-xs text-gray-500">Click or drag QR image here</span>
                  <span className="text-[10px] text-gray-600">PNG, JPG, WEBP</span>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={e => handleFileSelect(e.target.files?.[0] ?? null)}
              />
            </div>

            {/* ── OR divider ── */}
            <div className="flex items-center gap-2">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-[10px] text-gray-600">OR enter manually</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* ── QR Code URL (optional, disabled when image picked) ── */}
            <div>
              <label className="text-xs text-gray-500 mb-1.5 block">
                QR Code URL <span className="text-gray-600">(optional)</span>
              </label>
              <input
                value={qrCodeUrl}
                onChange={e => setQrCodeUrl(e.target.value)}
                placeholder="https://...qr-image.png"
                disabled={!!qrFile}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-600
                  focus:outline-none focus:border-violet-500/50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              />
            </div>

            {/* ── Activation Code (optional) ── */}
            <div>
              <label className="text-xs text-gray-500 mb-1.5 block">
                Activation Code <span className="text-gray-600">(optional)</span>
              </label>
              <textarea
                value={esimCode}
                onChange={e => setEsimCode(e.target.value)}
                placeholder="LPA:1$..."
                rows={3}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-600
                  focus:outline-none focus:border-violet-500/50 transition-colors font-mono resize-none"
              />
            </div>

            <button
              onClick={saveEsim}
              disabled={!canSave}
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
