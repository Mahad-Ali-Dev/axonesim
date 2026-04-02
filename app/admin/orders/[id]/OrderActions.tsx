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

  const [qrCodeUrl, setQrCodeUrl] = useState((order as any).qr_code_url ?? '')
  const [esimCode,  setEsimCode]  = useState((order as any).esim_code   ?? '')
  const [showForm,  setShowForm]  = useState(false)

  const fileInputRef              = useRef<HTMLInputElement>(null)
  const [qrFile,    setQrFile]    = useState<File | null>(null)
  const [qrPreview, setQrPreview] = useState<string>('')
  const [isDragging, setIsDragging] = useState(false)

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
    setQrCodeUrl('')
  }

  function clearQrImage() {
    setQrFile(null)
    setQrPreview('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  async function action(type: string, extra?: Record<string, string>) {
    setLoading(type); setMsg(''); setIsError(false)
    const res  = await fetch(`/api/admin/orders/${order.id}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: type, ...extra }),
    })
    const data = await res.json()
    setMsg(data.message || data.error || 'Done')
    setIsError(!res.ok)
    setLoading(null)
    if (res.ok) router.refresh()
  }

  async function saveEsim() {
    setLoading('setEsim'); setMsg(''); setIsError(false)
    let finalQrUrl = qrCodeUrl

    if (qrFile) {
      const form = new FormData()
      form.append('file', qrFile)
      form.append('orderId', order.id)
      const upRes  = await fetch('/api/admin/upload', { method: 'POST', body: form })
      const upData = await upRes.json()
      if (!upRes.ok) { setMsg(upData.error || 'Image upload failed'); setIsError(true); setLoading(null); return }
      finalQrUrl = upData.url
    }

    const res  = await fetch(`/api/admin/orders/${order.id}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'setEsim', qrCodeUrl: finalQrUrl, esimCode }),
    })
    const data = await res.json()
    setMsg(data.message || data.error || 'Done')
    setIsError(!res.ok)
    setLoading(null)
    if (res.ok) { setQrFile(null); setQrPreview(''); router.refresh() }
  }

  const canSave = !loading && (!!qrFile || !!qrCodeUrl || !!esimCode)

  return (
    <div className="space-y-4">

      {/* Payment Screenshot */}
      {screenshotUrl && (
        <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-100">
            <ImageIcon className="w-4 h-4 text-emerald-500" />
            <span className="text-sm font-semibold text-slate-700">Payment Screenshot</span>
            <a href={screenshotUrl} target="_blank" rel="noopener noreferrer"
              className="ml-auto flex items-center gap-1 text-xs text-slate-400 hover:text-violet-600 transition-colors">
              Full size <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <div className="p-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={screenshotUrl} alt="Payment proof"
              className="w-full rounded-xl object-contain max-h-64 bg-slate-50" />
          </div>
        </div>
      )}

      {/* Actions Panel */}
      <div className="bg-white border border-slate-100 rounded-2xl p-5 space-y-3 shadow-sm">
        <h3 className="font-semibold text-xs text-slate-400 uppercase tracking-wider mb-4">Actions</h3>

        {/* Order summary */}
        <div className="space-y-2 text-sm mb-4 bg-slate-50 rounded-xl p-3">
          <div className="flex justify-between">
            <span className="text-slate-400">Amount</span>
            <span className="font-bold text-violet-600">
              {order.currency === 'PKR' ? `Rs ${order.amount_paid.toLocaleString()}` : `$${order.amount_paid}`}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Payment</span>
            <span className="capitalize font-medium text-slate-600">{order.payment_method}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Status</span>
            <span className="capitalize font-medium text-slate-600">{order.status}</span>
          </div>
        </div>

        {/* Toggle eSIM form */}
        <button
          onClick={() => setShowForm(v => !v)}
          className="w-full flex items-center justify-center gap-2 bg-violet-50 hover:bg-violet-100 border border-violet-200 text-violet-700 font-semibold py-2.5 rounded-xl text-sm transition-colors"
        >
          <QrCode className="w-4 h-4" />
          {showForm ? 'Hide eSIM Form' : (order.status === 'delivered' ? 'Update eSIM Details' : 'Set eSIM & Deliver')}
        </button>

        {showForm && (
          <div className="space-y-3 pt-1">
            {/* QR Image Upload */}
            <div>
              <label className="text-xs text-slate-500 mb-1.5 block font-medium">
                QR Code Image <span className="text-slate-400 font-normal">(optional)</span>
              </label>
              {qrPreview ? (
                <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={qrPreview} alt="QR preview" className="w-full object-contain max-h-48" />
                  <button onClick={clearQrImage}
                    className="absolute top-2 right-2 bg-white/90 hover:bg-white rounded-full p-1 text-slate-500 hover:text-slate-800 shadow transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={e => { e.preventDefault(); setIsDragging(true) }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={e => { e.preventDefault(); setIsDragging(false); handleFileSelect(e.dataTransfer.files[0] ?? null) }}
                  className={`flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed py-6 cursor-pointer transition-colors
                    ${isDragging ? 'border-violet-400 bg-violet-50' : 'border-slate-200 hover:border-violet-300 hover:bg-violet-50/50'}`}
                >
                  <Upload className="w-5 h-5 text-slate-400" />
                  <span className="text-xs text-slate-500 font-medium">Click or drag QR image here</span>
                  <span className="text-[10px] text-slate-400">PNG, JPG, WEBP</span>
                </div>
              )}
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden"
                onChange={e => handleFileSelect(e.target.files?.[0] ?? null)} />
            </div>

            {/* Divider */}
            <div className="flex items-center gap-2">
              <div className="flex-1 h-px bg-slate-200" />
              <span className="text-[10px] text-slate-400 font-medium">OR enter manually</span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>

            {/* QR URL */}
            <div>
              <label className="text-xs text-slate-500 mb-1.5 block font-medium">
                QR Code URL <span className="text-slate-400 font-normal">(optional)</span>
              </label>
              <input value={qrCodeUrl} onChange={e => setQrCodeUrl(e.target.value)}
                placeholder="https://...qr-image.png" disabled={!!qrFile}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700
                  placeholder-slate-400 focus:outline-none focus:border-violet-400 transition-colors
                  disabled:opacity-40 disabled:cursor-not-allowed" />
            </div>

            {/* Activation Code */}
            <div>
              <label className="text-xs text-slate-500 mb-1.5 block font-medium">
                Activation Code <span className="text-slate-400 font-normal">(optional)</span>
              </label>
              <textarea value={esimCode} onChange={e => setEsimCode(e.target.value)}
                placeholder="LPA:1$..." rows={3}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700
                  placeholder-slate-400 focus:outline-none focus:border-violet-400 transition-colors font-mono resize-none" />
            </div>

            <button onClick={saveEsim} disabled={!canSave}
              className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors disabled:opacity-50 shadow-sm">
              {loading === 'setEsim'
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</>
                : <><Send className="w-4 h-4" /> Save eSIM &amp; Mark Delivered</>}
            </button>
            <p className="text-xs text-slate-400 text-center">This marks order as delivered and emails the customer.</p>
          </div>
        )}

        {/* Auto-Deliver */}
        {['pending', 'paid'].includes(order.status) && (
          <button onClick={() => action('deliver')} disabled={!!loading}
            className="w-full flex items-center justify-center gap-2 bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-700 font-semibold py-2.5 rounded-xl text-sm transition-colors disabled:opacity-50">
            {loading === 'deliver' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            Auto-Deliver eSIM
          </button>
        )}

        {/* Resend */}
        <button onClick={() => action('resend')} disabled={!!loading}
          className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-600 font-semibold py-2.5 rounded-xl text-sm transition-colors disabled:opacity-50">
          {loading === 'resend' ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
          Resend eSIM
        </button>

        {/* Mark Activated */}
        {order.status !== 'activated' && (order as any).qr_code_url && (
          <button onClick={() => action('markActivated')} disabled={!!loading}
            className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-900 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors disabled:opacity-50">
            {loading === 'markActivated' ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
            Mark Activated
          </button>
        )}

        {/* Cancel */}
        {!['cancelled', 'expired'].includes(order.status) && (
          <button onClick={() => action('cancel')} disabled={!!loading}
            className="w-full flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 font-semibold py-2.5 rounded-xl text-sm transition-colors disabled:opacity-50">
            {loading === 'cancel' ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
            Cancel Order
          </button>
        )}

        {/* Feedback message */}
        {msg && (
          <div className={`rounded-xl px-3 py-2 text-xs font-medium ${
            isError ? 'bg-red-50 border border-red-200 text-red-600' : 'bg-emerald-50 border border-emerald-200 text-emerald-700'
          }`}>
            {msg}
          </div>
        )}
      </div>
    </div>
  )
}
