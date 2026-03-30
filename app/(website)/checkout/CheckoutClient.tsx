'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Globe, Shield, Zap, ChevronRight, Loader2, CheckCircle2,
  User, Mail, Phone, MessageCircle, Clock, Lock, ArrowLeft,
} from 'lucide-react'
import type { Plan, PaymentMethod } from '@/types/database'

export default function CheckoutClient({ plan }: { plan: Plan }) {
  const router = useRouter()
  const [currency, setCurrency] = useState<'PKR' | 'USD'>('PKR')
  const [step, setStep] = useState<'details' | 'payment'>('details')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({ name: '', email: '', phone: '', whatsapp: '' })

  const price = currency === 'PKR' ? plan.price_pkr : plan.price_usd
  const paymentMethod: PaymentMethod = currency === 'PKR' ? 'safepay' : 'stripe'

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  function validateDetails() {
    if (!form.name.trim()) return 'Full name is required'
    if (!form.email.trim() || !form.email.includes('@')) return 'Valid email address is required'
    if (!form.phone.trim() || form.phone.length < 10) return 'Valid phone number is required (min 10 digits)'
    return null
  }

  function handleContinue() {
    const err = validateDetails()
    if (err) { setError(err); return }
    setError('')
    setStep('payment')
  }

  async function handlePay() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: plan.id,
          customer: { ...form, whatsapp: form.whatsapp || form.phone },
          paymentMethod,
          currency,
          amount: price,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to create order')

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl
      } else if (data.stripeClientSecret) {
        router.push(`/order/${data.orderId}?cs=${data.stripeClientSecret}`)
      } else {
        router.push(`/order/${data.orderId}`)
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen px-4 py-24">
      <div className="max-w-5xl mx-auto">

        {/* ── Header ── */}
        <div className="flex items-center gap-4 mb-10">
          <button onClick={() => router.back()} className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors text-slate-400 hover:text-white">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black">Checkout</h1>
            <p className="text-sm text-slate-500 mt-0.5">Complete your order in seconds</p>
          </div>
        </div>

        {/* ── Progress bar ── */}
        <div className="flex items-center gap-3 mb-10">
          {(['details', 'payment'] as const).map((s, i) => (
            <div key={s} className="flex items-center gap-3">
              <div className={`flex items-center gap-2.5 text-sm font-semibold ${
                s === step ? 'text-white' : step === 'payment' && s === 'details' ? 'text-violet-400' : 'text-slate-600'
              }`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                  step === 'payment' && s === 'details'
                    ? 'bg-violet-600 text-white'
                    : s === step
                    ? 'bg-violet-600 text-white ring-4 ring-violet-600/20'
                    : 'bg-white/5 border border-white/10'
                }`}>
                  {step === 'payment' && s === 'details' ? <CheckCircle2 className="w-3.5 h-3.5" /> : i + 1}
                </div>
                <span className="hidden sm:block capitalize">{s === 'details' ? 'Your Details' : 'Payment'}</span>
              </div>
              {i === 0 && (
                <div className={`h-px w-12 sm:w-20 rounded transition-all ${step === 'payment' ? 'bg-violet-600' : 'bg-white/10'}`} />
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Left: Form ── */}
          <div className="lg:col-span-2 space-y-5">

            {/* Step 1: Details */}
            <div className={`card rounded-2xl p-6 transition-all ${step === 'details' ? 'border-violet-500/30' : 'opacity-80'}`}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-lg flex items-center gap-2.5">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${
                    step === 'payment' ? 'bg-violet-600 text-white' : 'bg-violet-600/20 text-violet-400 border border-violet-500/30'
                  }`}>
                    {step === 'payment' ? <CheckCircle2 className="w-3.5 h-3.5" /> : '1'}
                  </div>
                  Your Details
                </h2>
                {step === 'payment' && (
                  <button
                    onClick={() => setStep('details')}
                    className="text-xs text-violet-400 hover:text-violet-300 font-semibold transition-colors px-3 py-1.5 rounded-lg border border-violet-500/20 hover:bg-violet-500/10"
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
                      <input
                        name="name" value={form.name} onChange={handleChange}
                        placeholder="Ahmed Ali"
                        className="input"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-500 mb-2 block font-medium flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5" /> Email Address
                      </label>
                      <input
                        name="email" type="email" value={form.email} onChange={handleChange}
                        placeholder="ahmed@gmail.com"
                        className="input"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-slate-500 mb-2 block font-medium flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5" /> Phone Number
                      </label>
                      <input
                        name="phone" value={form.phone} onChange={handleChange}
                        placeholder="+92 300 1234567"
                        className="input"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-500 mb-2 block font-medium flex items-center gap-1.5">
                        <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                        <span className="text-slate-600">(for eSIM delivery)</span>
                      </label>
                      <input
                        name="whatsapp" value={form.whatsapp} onChange={handleChange}
                        placeholder="Same as phone"
                        className="input"
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                      <Shield className="w-4 h-4 flex-shrink-0" />
                      {error}
                    </div>
                  )}

                  <button
                    onClick={handleContinue}
                    className="btn-primary w-full py-3.5 rounded-xl flex items-center justify-center gap-2 text-sm mt-2"
                  >
                    Continue to Payment <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {[
                    { label: 'Name', value: form.name },
                    { label: 'Email', value: form.email },
                    { label: 'Phone', value: form.phone },
                    { label: 'WhatsApp', value: form.whatsapp || form.phone },
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
              <div className="card border-violet-500/30 rounded-2xl p-6">
                <h2 className="font-bold text-lg flex items-center gap-2.5 mb-6">
                  <div className="w-7 h-7 rounded-full bg-violet-600/20 text-violet-400 border border-violet-500/30 flex items-center justify-center text-xs font-black">2</div>
                  Payment
                </h2>

                {/* Currency toggle */}
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-sm text-slate-500 font-medium">Pay in:</span>
                  <div className="flex items-center bg-white/5 border border-white/5 rounded-full p-1 gap-1">
                    {(['PKR', 'USD'] as const).map(c => (
                      <button
                        key={c}
                        onClick={() => setCurrency(c)}
                        className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${
                          currency === c
                            ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/30'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {c === 'PKR' ? '🇵🇰 PKR' : '🌍 USD'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Payment method display */}
                <div className="mb-6">
                  <div className="flex items-center gap-4 p-4 rounded-xl border border-violet-500/25 bg-violet-500/5">
                    <div className="w-5 h-5 rounded-full border-2 border-violet-500 flex items-center justify-center flex-shrink-0">
                      <div className="w-2.5 h-2.5 rounded-full bg-violet-500" />
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-sm text-violet-300">
                        {currency === 'PKR' ? 'JazzCash / Easypaisa / Card' : 'International Card (Visa / Mastercard)'}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {currency === 'PKR'
                          ? "You'll be taken to Safepay's secure page to choose your preferred method"
                          : 'Pay securely via Stripe'}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-slate-600 font-medium">
                        {currency === 'PKR' ? 'via Safepay' : 'via Stripe'}
                      </div>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 mb-4">
                    <Shield className="w-4 h-4 flex-shrink-0" />
                    {error}
                  </div>
                )}

                <button
                  onClick={handlePay}
                  disabled={loading}
                  className="btn-primary w-full py-4 rounded-xl flex items-center justify-center gap-2 text-base glow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> Redirecting to payment…</>
                  ) : (
                    <>
                      Pay {currency === 'PKR' ? `Rs ${price.toLocaleString()}` : `$${price} USD`}
                      <ChevronRight className="w-5 h-5" />
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-2 mt-4 text-xs text-slate-600">
                  <Lock className="w-3.5 h-3.5" />
                  Your payment is secured with 256-bit SSL encryption
                </div>
              </div>
            )}
          </div>

          {/* ── Right: Order Summary ── */}
          <div className="lg:col-span-1">
            <div className="card rounded-2xl p-5 sticky top-24">
              <h3 className="font-bold mb-4 text-sm uppercase tracking-wider text-slate-500">Order Summary</h3>

              {/* Plan preview */}
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

              {/* Price breakdown */}
              <div className="space-y-2.5 text-sm mb-5">
                <div className="flex justify-between text-slate-400">
                  <span>Plan price</span>
                  <span>{currency === 'PKR' ? `Rs ${plan.price_pkr.toLocaleString()}` : `$${plan.price_usd}`}</span>
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
                  <span className="gradient-text">
                    {currency === 'PKR' ? `Rs ${plan.price_pkr.toLocaleString()}` : `$${plan.price_usd} USD`}
                  </span>
                </div>
              </div>

              {/* Included features */}
              <div className="space-y-2 mb-5">
                {[
                  { icon: Zap, text: 'QR code in 2 min', color: 'text-yellow-400' },
                  { icon: MessageCircle, text: 'WhatsApp delivery', color: 'text-green-400' },
                  { icon: Shield, text: 'Secure payment', color: 'text-blue-400' },
                  { icon: Globe, text: '150+ countries', color: 'text-violet-400' },
                ].map(({ icon: Icon, text, color }) => (
                  <div key={text} className="flex items-center gap-2.5 text-xs text-slate-500">
                    <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${color}`} />
                    {text}
                  </div>
                ))}
              </div>

              {/* Badges */}
              <div className="flex gap-2">
                <div className="flex-1 text-center py-2 px-2 rounded-lg bg-violet-600/10 border border-violet-500/15 text-xs text-violet-400 font-semibold">
                  Safepay
                </div>
                <div className="flex-1 text-center py-2 px-2 rounded-lg bg-blue-600/10 border border-blue-500/15 text-xs text-blue-400 font-semibold">
                  Stripe
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
