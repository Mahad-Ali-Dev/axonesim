'use client'
import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Globe, Shield, Zap, ChevronRight, Loader2, CheckCircle2,
  User, Mail, Phone, MessageCircle, Clock, ArrowLeft,
  Upload, ImageIcon, Copy, Check, X,
} from 'lucide-react'
import type { Plan } from '@/types/database'

// ─────────────────────────────────────────────────────────────────────────────
// Stripe + Safepay integrations are preserved below and will be re-enabled
// once the reseller APIs (LoopeSIM QR) are ready and payment gateways are live.
// import StripePaymentForm from '../order/[id]/StripePaymentForm'
// ─────────────────────────────────────────────────────────────────────────────

const JAZZCASH = { bank: 'JazzCash', number: '03285005056', title: 'Mahad Ali' }
const WA_NUMBER = '923285005056'

export default function CheckoutClient({ plan }: { plan: Plan }) {
  const router = useRouter()

  const [step, setStep]       = useState<'details' | 'payment'>('details')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [copied, setCopied]   = useState('')

  const [form, setForm] = useState({ name: '', email: '', phone: '', whatsapp: '' })

  // Screenshot upload
  const fileRef = useRef<HTMLInputElement>(null)
  const [screenshot, setScreenshot]   = useState<File | null>(null)
  const [previewUrl, setPreviewUrl]   = useState<string | null>(null)

  const price = plan.price_pkr

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  function validateDetails() {
    if (!form.name.trim())  return 'Full name is required'
    if (!form.email.trim() || !form.email.includes('@')) return 'Valid email is required'
    if (!form.phone.trim() || form.phone.replace(/\D/g, '').length < 10) return 'Valid phone number is required'
    return null
  }

  function handleContinue() {
    const err = validateDetails()
    if (err) { setError(err); return }
    setError('')
    setStep('payment')
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setScreenshot(file)
    setPreviewUrl(URL.createObjectURL(file))
  }

  function removeFile() {
    setScreenshot(null)
    setPreviewUrl(null)
    if (fileRef.current) fileRef.current.value = ''
  }

  function copyText(text: string, key: string) {
    navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(''), 2000)
  }

  async function handlePlaceOrder() {
    if (!screenshot) { setError('Please upload your payment screenshot to continue.'); return }
    setLoading(true)
    setError('')

    try {
      // 1 — Upload screenshot
      let screenshotUrl: string | null = null
      const fd = new FormData()
      fd.append('file', screenshot)
      const upRes = await fetch('/api/upload', { method: 'POST', body: fd })
      if (upRes.ok) {
        const upData = await upRes.json()
        screenshotUrl = upData.url
      }

      // 2 — Create order
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId:        plan.id,
          customer:      { ...form, whatsapp: form.whatsapp || form.phone },
          paymentMethod: 'manual',
          currency:      'PKR',
          amount:        price,
          screenshotUrl,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to create order')

      const orderId = data.orderId

      // 3 — Open WhatsApp with pre-filled message (new tab) then navigate to order page
      const wa = `Hi! I just placed an order on Axon eSIM.\n\n*Order ID:* ${orderId}\n*Plan:* ${plan.name}\n*Amount:* Rs ${price.toLocaleString()}\n*My Name:* ${form.name}\n\nI've uploaded my payment screenshot on the site. Please deliver my eSIM ASAP!`
      window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(wa)}`, '_blank')

      router.push(`/order/${orderId}`)

    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  const stepLabels = { details: 'Your Details', payment: 'Payment' }
  const STEPS = ['details', 'payment'] as const

  return (
    <div className="min-h-screen px-4 py-24">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <button
            onClick={() => step === 'payment' ? setStep('details') : router.back()}
            className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors text-slate-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black">Checkout</h1>
            <p className="text-sm text-slate-500 mt-0.5">Secure your eSIM in seconds</p>
          </div>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-3 mb-10">
          {STEPS.map((s, i) => {
            const isDone    = STEPS.indexOf(step) > i
            const isCurrent = s === step
            return (
              <div key={s} className="flex items-center gap-3">
                <div className={`flex items-center gap-2.5 text-sm font-semibold ${isCurrent ? 'text-white' : isDone ? 'text-violet-400' : 'text-slate-600'}`}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                    isDone    ? 'bg-violet-600 text-white'
                    : isCurrent ? 'bg-violet-600 text-white ring-4 ring-violet-600/20'
                    : 'bg-white/5 border border-white/10'
                  }`}>
                    {isDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : i + 1}
                  </div>
                  <span className="hidden sm:block">{stepLabels[s]}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`h-px w-12 sm:w-20 rounded transition-all ${isDone ? 'bg-violet-600' : 'bg-white/10'}`} />
                )}
              </div>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Left: Form ── */}
          <div className="lg:col-span-2 space-y-5">

            {/* Step 1: Details */}
            <div className={`card rounded-2xl p-6 transition-all ${step === 'details' ? 'border-violet-500/30' : 'opacity-80'}`}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-lg flex items-center gap-2.5">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${
                    step !== 'details' ? 'bg-violet-600 text-white' : 'bg-violet-600/20 text-violet-400 border border-violet-500/30'
                  }`}>
                    {step !== 'details' ? <CheckCircle2 className="w-3.5 h-3.5" /> : '1'}
                  </div>
                  Your Details
                </h2>
                {step !== 'details' && (
                  <button
                    onClick={() => setStep('details')}
                    className="text-xs text-violet-400 hover:text-violet-300 font-semibold px-3 py-1.5 rounded-lg border border-violet-500/20 hover:bg-violet-500/10 transition-colors"
                  >
                    Edit
                  </button>
                )}
              </div>

              {step === 'details' ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-slate-500 mb-2 block font-medium flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5" /> Full Name
                      </label>
                      <input name="name" value={form.name} onChange={handleChange} placeholder="Ahmed Ali" className="input" />
                    </div>
                    <div>
                      <label className="text-xs text-slate-500 mb-2 block font-medium flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5" /> Email Address
                      </label>
                      <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="ahmed@gmail.com" className="input" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-slate-500 mb-2 block font-medium flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5" /> Phone Number
                      </label>
                      <input name="phone" value={form.phone} onChange={handleChange} placeholder="+92 300 1234567" className="input" />
                    </div>
                    <div>
                      <label className="text-xs text-slate-500 mb-2 block font-medium flex items-center gap-1.5">
                        <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                        <span className="text-slate-600">(eSIM delivery)</span>
                      </label>
                      <input name="whatsapp" value={form.whatsapp} onChange={handleChange} placeholder="Same as phone" className="input" />
                    </div>
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                      <Shield className="w-4 h-4 flex-shrink-0" /> {error}
                    </div>
                  )}

                  <button onClick={handleContinue} className="btn-primary w-full py-3.5 rounded-xl flex items-center justify-center gap-2 text-sm mt-2">
                    Continue to Payment <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {[
                    { label: 'Name',      value: form.name  },
                    { label: 'Email',     value: form.email },
                    { label: 'Phone',     value: form.phone },
                    { label: 'WhatsApp',  value: form.whatsapp || form.phone },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <div className="text-xs text-slate-600 mb-0.5">{label}</div>
                      <div className="text-slate-300 font-medium">{value}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Step 2: Payment */}
            {step === 'payment' && (
              <div className="card rounded-2xl p-6 border-violet-500/30 space-y-6">
                <h2 className="font-bold text-lg flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black bg-violet-600/20 text-violet-400 border border-violet-500/30">2</div>
                  Complete Payment
                </h2>

                {/* Step-by-step instruction */}
                <div className="grid grid-cols-3 gap-3 text-center">
                  {[
                    { n: '1', text: 'Transfer to JazzCash below' },
                    { n: '2', text: 'Take a screenshot of receipt' },
                    { n: '3', text: 'Upload & place order' },
                  ].map(({ n, text }) => (
                    <div key={n} className="bg-violet-50 border border-violet-100 rounded-xl p-3">
                      <div className="w-6 h-6 rounded-full bg-violet-600 text-white text-xs font-black flex items-center justify-center mx-auto mb-2">{n}</div>
                      <p className="text-xs text-slate-600 leading-tight">{text}</p>
                    </div>
                  ))}
                </div>

                {/* Bank details */}
                <div className="rounded-2xl overflow-hidden border border-green-600/30">
                  <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-5 py-3.5 flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                      <MessageCircle className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">JazzCash Transfer</p>
                      <p className="text-xs text-green-100/80">Send exact amount — screenshots checked manually</p>
                    </div>
                    <div className="ml-auto text-right">
                      <p className="text-xs text-green-100/70">Amount</p>
                      <p className="text-base font-black text-white">Rs {price.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="divide-y divide-slate-100 bg-white">
                    {[
                      { label: 'Bank / Wallet', value: JAZZCASH.bank,   key: 'bank'  },
                      { label: 'Account No.',   value: JAZZCASH.number, key: 'num'   },
                      { label: 'Account Title', value: JAZZCASH.title,  key: 'title' },
                      { label: 'Amount',        value: `Rs ${price.toLocaleString()}`, key: 'amt' },
                    ].map(({ label, value, key }) => (
                      <div key={key} className="flex items-center justify-between px-5 py-3">
                        <span className="text-sm text-slate-600">{label}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-slate-900">{value}</span>
                          <button
                            onClick={() => copyText(value, key)}
                            className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors text-slate-500 hover:text-slate-800"
                          >
                            {copied === key ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Easypaisa note */}
                <div className="flex items-center gap-2.5 bg-white/[0.02] border border-white/[0.05] rounded-xl px-4 py-3">
                  <MessageCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <p className="text-xs text-slate-500">
                    Prefer <span className="text-emerald-400 font-semibold">Easypaisa</span>? WhatsApp us first at{' '}
                    <a href={`https://wa.me/${WA_NUMBER}`} target="_blank" rel="noopener noreferrer" className="text-violet-400 font-semibold hover:underline">+92 328 5005056</a>{' '}
                    and we'll share the account number.
                  </p>
                </div>

                {/* Screenshot upload */}
                <div>
                  <p className="text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
                    <Upload className="w-4 h-4 text-violet-400" />
                    Upload Payment Screenshot <span className="text-red-400">*</span>
                  </p>
                  <p className="text-xs text-slate-600 mb-3">After transferring, upload your payment receipt screenshot here to confirm your order.</p>

                  {previewUrl ? (
                    <div className="relative rounded-2xl overflow-hidden border border-violet-500/20 bg-white/[0.02]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={previewUrl} alt="Payment screenshot" className="w-full max-h-64 object-contain" />
                      <button
                        onClick={removeFile}
                        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-black transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent px-4 py-3">
                        <p className="text-xs text-white/80 font-medium truncate">{screenshot?.name}</p>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => fileRef.current?.click()}
                      className="w-full border-2 border-dashed border-white/10 hover:border-violet-500/40 rounded-2xl p-8 flex flex-col items-center gap-3 transition-all group hover:bg-violet-500/[0.03]"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center group-hover:bg-violet-500/20 transition-colors">
                        <ImageIcon className="w-6 h-6 text-violet-400" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-semibold text-slate-300">Click to upload screenshot</p>
                        <p className="text-xs text-slate-600 mt-0.5">JPG, PNG, HEIC up to 10 MB</p>
                      </div>
                    </button>
                  )}
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                    <Shield className="w-4 h-4 flex-shrink-0" /> {error}
                  </div>
                )}

                {/* Place order */}
                <button
                  onClick={handlePlaceOrder}
                  disabled={loading || !screenshot}
                  className="btn-primary w-full py-4 rounded-xl flex items-center justify-center gap-2 text-base glow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading
                    ? <><Loader2 className="w-5 h-5 animate-spin" /> Confirming your order…</>
                    : <><CheckCircle2 className="w-5 h-5" /> Place Order — Rs {price.toLocaleString()}</>
                  }
                </button>

                <div className="flex items-center justify-center gap-2 text-xs text-slate-600">
                  <Shield className="w-3.5 h-3.5" />
                  Orders are verified manually within 2–5 minutes. eSIM delivered via WhatsApp.
                </div>
                <div className="text-center text-xs text-slate-600 bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3 leading-relaxed">
                  🌐 Axon eSIM provides <span className="text-slate-400 font-medium">international data-only connectivity</span> through global network partners. This service does not include a local Pakistani number and is designed for travel and cross-border use.
                </div>
              </div>
            )}
          </div>

          {/* ── Right: Order Summary ── */}
          <div className="lg:col-span-1">
            <div className="card rounded-2xl p-5 sticky top-24">
              <h3 className="font-bold mb-4 text-sm uppercase tracking-wider text-slate-500">Order Summary</h3>

              <div className="bg-gradient-to-br from-violet-600/10 to-cyan-600/5 border border-violet-500/15 rounded-xl p-4 mb-5">
                <div className="flex items-center gap-1.5 mb-2">
                  <Globe className="w-3.5 h-3.5 text-violet-400" />
                  <span className="text-xs text-violet-400 font-bold uppercase tracking-wider">{plan.region}</span>
                </div>
                <div className="font-black text-lg leading-tight">{plan.name}</div>
                <div className="flex items-center gap-3 mt-2 text-sm text-slate-400">
                  <span className="flex items-center gap-1"><Zap className="w-3.5 h-3.5 text-yellow-400" /> {plan.data_gb} GB</span>
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {plan.validity_days} days</span>
                </div>
              </div>

              <div className="space-y-2.5 text-sm mb-5">
                <div className="flex justify-between text-slate-400">
                  <span>Plan price</span>
                  <span>Rs {plan.price_pkr.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Delivery</span>
                  <span className="text-emerald-400 font-semibold">FREE</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Tax</span>
                  <span>Included</span>
                </div>
                <div className="border-t border-white/5 pt-2.5 flex justify-between font-black text-base">
                  <span>Total</span>
                  <span className="gradient-text">Rs {plan.price_pkr.toLocaleString()}</span>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                {[
                  { icon: Zap,           text: 'eSIM via WhatsApp in 2–5 min', color: 'text-yellow-400' },
                  { icon: MessageCircle, text: 'WhatsApp delivery',             color: 'text-green-400'  },
                  { icon: Shield,        text: 'Manual verification',           color: 'text-blue-400'   },
                  { icon: Globe,         text: '150+ countries',                color: 'text-violet-400' },
                ].map(({ icon: Icon, text, color }) => (
                  <div key={text} className="flex items-center gap-2.5 text-xs text-slate-500">
                    <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${color}`} />
                    {text}
                  </div>
                ))}
              </div>

              <div className="bg-green-500/[0.06] border border-green-500/15 rounded-xl px-3 py-2.5">
                <p className="text-xs text-green-400 font-semibold flex items-center gap-1.5">
                  <MessageCircle className="w-3 h-3" /> JazzCash · Easypaisa accepted
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
