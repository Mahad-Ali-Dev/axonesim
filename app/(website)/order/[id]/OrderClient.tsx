'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import {
  CheckCircle2, Clock, Loader2, MessageCircle, Mail,
  QrCode, Copy, Check, Sparkles, Zap, Shield, Download,
} from 'lucide-react'
import type { OrderWithDetails } from '@/types/database'
import type { ConfettiRef } from '@/components/ui/confetti'
import { Confetti } from '@/components/ui/confetti'

const STATUS_CONFIG = {
  pending:    { icon: Clock,        label: 'Payment Pending',    color: 'text-amber-500',  bg: 'bg-amber-50',   border: 'border-amber-200' },
  paid:       { icon: Loader2,      label: 'Processing…',        color: 'text-blue-500',   bg: 'bg-blue-50',    border: 'border-blue-200'  },
  processing: { icon: Loader2,      label: 'Generating eSIM…',   color: 'text-violet-500', bg: 'bg-violet-50',  border: 'border-violet-200'},
  delivered:  { icon: CheckCircle2, label: 'eSIM Delivered! 🎉', color: 'text-green-600',  bg: 'bg-green-50',   border: 'border-green-200' },
  activated:  { icon: CheckCircle2, label: 'eSIM Activated! 🚀', color: 'text-green-600',  bg: 'bg-green-50',   border: 'border-green-200' },
  expired:    { icon: Clock,        label: 'Expired',            color: 'text-slate-400',  bg: 'bg-slate-50',   border: 'border-slate-200' },
  cancelled:  { icon: Clock,        label: 'Cancelled',          color: 'text-red-500',    bg: 'bg-red-50',     border: 'border-red-200'   },
}

export default function OrderClient({ order }: { order: OrderWithDetails }) {
  const [copied, setCopied] = useState(false)
  const [currentOrder, setCurrentOrder] = useState(order)
  const confettiRef = useRef<ConfettiRef>(null)
  const confettiFired = useRef(false)

  const config = STATUS_CONFIG[currentOrder.status]
  const Icon = config.icon
  const isSuccess = currentOrder.status === 'delivered' || currentOrder.status === 'activated'

  useEffect(() => {
    if (isSuccess && !confettiFired.current) {
      confettiFired.current = true
      setTimeout(() => {
        confettiRef.current?.fire({
          particleCount: 180,
          spread: 120,
          origin: { y: 0.4 },
          colors: ['#7c3aed', '#6366f1', '#a78bfa', '#22d3ee', '#f59e0b', '#10b981'],
        })
      }, 300)
    }
  }, [isSuccess])

  useEffect(() => {
    if (['pending', 'paid', 'processing'].includes(currentOrder.status)) {
      const interval = setInterval(async () => {
        const res = await fetch(`/api/orders/${currentOrder.id}`)
        if (res.ok) {
          const data = await res.json()
          setCurrentOrder(data.order)
        }
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [currentOrder.status, currentOrder.id])

  function copyCode() {
    if (currentOrder.esim_code) {
      navigator.clipboard.writeText(currentOrder.esim_code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-16">
      <Confetti ref={confettiRef} className="fixed inset-0 w-full h-full pointer-events-none z-50" manualstart />

      <div className="max-w-lg mx-auto space-y-4">

        {/* ── Status Header ── */}
        <div className="text-center pb-2">
          {isSuccess && (
            <div className="inline-flex items-center gap-1.5 bg-green-100 text-green-700 border border-green-200 text-xs font-bold px-3 py-1.5 rounded-full mb-4">
              <Sparkles className="w-3.5 h-3.5" /> Payment Successful
            </div>
          )}
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${config.bg} border-2 ${config.border} mb-4`}>
            <Icon className={`w-8 h-8 ${config.color} ${['paid', 'processing'].includes(currentOrder.status) ? 'animate-spin' : ''}`} />
          </div>
          <h1 className="text-2xl font-black text-slate-800 mb-3">{config.label}</h1>
          <div className="inline-flex items-center gap-2 bg-white border border-slate-200 shadow-sm px-4 py-2 rounded-xl">
            <span className="text-slate-400 text-xs font-medium">Order ID</span>
            <span className="text-slate-700 font-mono text-sm font-bold">{currentOrder.id}</span>
          </div>
        </div>

        {/* ── Order Details ── */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Order Details</p>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Plan', value: currentOrder.plans.name },
              { label: 'Data', value: `${currentOrder.plans.data_gb} GB · ${currentOrder.plans.validity_days} days` },
              {
                label: 'Amount Paid',
                value: currentOrder.currency === 'PKR'
                  ? `Rs ${currentOrder.amount_paid.toLocaleString()}`
                  : `$${currentOrder.amount_paid} USD`,
                highlight: true,
              },
              { label: 'Payment via', value: currentOrder.payment_method.charAt(0).toUpperCase() + currentOrder.payment_method.slice(1) },
            ].map(({ label, value, highlight }) => (
              <div key={label}>
                <div className="text-xs text-slate-400 mb-0.5">{label}</div>
                <div className={`font-bold text-sm ${highlight ? 'text-violet-600 text-base' : 'text-slate-800'}`}>{value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── eSIM Delivered: QR + Code ── */}
        {isSuccess && currentOrder.qr_code_url && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Green header banner */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-4">
              <div className="flex items-center gap-2">
                <QrCode className="w-5 h-5 text-white" />
                <span className="text-white font-bold text-base">Your eSIM QR Code</span>
              </div>
              <p className="text-green-100 text-xs mt-1">Scan with your phone to activate instantly</p>
            </div>

            <div className="p-6">
              {/* QR code */}
              <div className="flex justify-center mb-5">
                <div className="p-4 bg-white rounded-2xl shadow-lg border-2 border-slate-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={currentOrder.qr_code_url} alt="eSIM QR Code" className="w-48 h-48 block" />
                </div>
              </div>

              {/* Steps */}
              <div className="flex items-start gap-4 bg-slate-50 rounded-xl p-4 mb-5">
                {[
                  { step: '1', text: 'Open Settings' },
                  { step: '2', text: 'Cellular → Add eSIM' },
                  { step: '3', text: 'Scan QR Code' },
                ].map(({ step, text }) => (
                  <div key={step} className="flex-1 text-center">
                    <div className="w-7 h-7 rounded-full bg-violet-100 text-violet-700 font-black text-xs flex items-center justify-center mx-auto mb-1.5">{step}</div>
                    <p className="text-xs text-slate-600 font-medium leading-tight">{text}</p>
                  </div>
                ))}
              </div>

              {/* Activation code */}
              {currentOrder.esim_code && (
                <div className="mb-5">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Activation Code (manual entry)</p>
                  <div className="flex items-center gap-3 bg-slate-900 rounded-xl p-3.5">
                    <code className="text-emerald-400 text-xs break-all flex-1 font-mono leading-relaxed">
                      {currentOrder.esim_code}
                    </code>
                    <button
                      onClick={copyCode}
                      className="flex-shrink-0 w-8 h-8 rounded-lg bg-slate-700 hover:bg-slate-600 flex items-center justify-center transition-colors"
                    >
                      {copied
                        ? <Check className="w-4 h-4 text-green-400" />
                        : <Copy className="w-4 h-4 text-slate-300" />
                      }
                    </button>
                  </div>
                  {copied && <p className="text-xs text-green-600 font-semibold mt-1.5 text-center">Copied to clipboard!</p>}
                </div>
              )}

              {/* Action buttons */}
              <div className="grid grid-cols-2 gap-3">
                <Link
                  href="/activate"
                  className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold py-3 rounded-xl text-sm transition-colors"
                >
                  <Download className="w-4 h-4" /> Setup Guide
                </Link>
                <a
                  href={`https://wa.me/923349542871?text=Hi! I need help with my eSIM order ${currentOrder.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-xl text-sm transition-colors"
                >
                  <MessageCircle className="w-4 h-4" /> WhatsApp Help
                </a>
              </div>
            </div>
          </div>
        )}

        {/* ── Pending — order confirmed, awaiting manual delivery ── */}
        {currentOrder.status === 'pending' && (
          <div className="space-y-4">
            {/* Thank-you card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-violet-500 to-indigo-600 px-6 py-5 text-center">
                <div className="text-3xl mb-2">🎉</div>
                <h2 className="text-white font-black text-lg">Order Confirmed!</h2>
                <p className="text-violet-200 text-sm mt-1">Thank you for your order, {currentOrder.customers.name}.</p>
              </div>
              <div className="p-6 text-center">
                <p className="text-slate-700 font-semibold text-base mb-2">
                  We received your payment screenshot.
                </p>
                <p className="text-slate-500 text-sm leading-relaxed mb-5">
                  Our team is reviewing your payment and will deliver your eSIM to your WhatsApp within <span className="text-violet-600 font-bold">2–5 minutes</span>. Keep WhatsApp open!
                </p>
                <a
                  href={`https://wa.me/923349542871?text=Hi! I placed order ${currentOrder.id} for ${currentOrder.plans.name}. Just checking on my eSIM delivery.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3.5 rounded-xl text-sm transition-colors"
                >
                  <MessageCircle className="w-4 h-4" /> Message us on WhatsApp
                </a>
                <p className="text-xs text-slate-400 mt-3">
                  Order ID: <span className="font-mono font-bold text-slate-600">{currentOrder.id}</span>
                </p>
              </div>
            </div>

            {/* What to expect */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">What happens next</p>
              <div className="space-y-4">
                {[
                  { emoji: '🔍', title: 'Payment verified',    desc: 'We check your screenshot — usually under 2 minutes'    },
                  { emoji: '📲', title: 'eSIM sent via WhatsApp', desc: 'You\'ll receive your QR code on WhatsApp'            },
                  { emoji: '✅', title: 'Scan & connect',      desc: 'Scan the QR in Settings → Cellular → Add eSIM'        },
                ].map(({ emoji, title, desc }) => (
                  <div key={title} className="flex items-start gap-3">
                    <div className="text-xl">{emoji}</div>
                    <div>
                      <p className="text-slate-800 font-semibold text-sm">{title}</p>
                      <p className="text-slate-500 text-xs mt-0.5">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Paid / Processing ── */}
        {['paid', 'processing'].includes(currentOrder.status) && (
          <div className="bg-white rounded-2xl border border-violet-200 shadow-sm p-6 text-center">
            <div className="w-14 h-14 rounded-2xl bg-violet-50 border-2 border-violet-200 flex items-center justify-center mx-auto mb-3">
              <Loader2 className="w-7 h-7 text-violet-500 animate-spin" />
            </div>
            <p className="text-slate-800 font-bold mb-1">Preparing your eSIM…</p>
            <p className="text-xs text-slate-400 mb-4">Payment confirmed! Delivering to your WhatsApp shortly.</p>
            <a
              href={`https://wa.me/923349542871?text=Hi! Order ${currentOrder.id} shows processing — when will my eSIM arrive?`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold text-green-700 hover:underline"
            >
              <MessageCircle className="w-4 h-4 text-green-600" /> Message us on WhatsApp
            </a>
          </div>
        )}

        {/* ── Delivery Channels ── */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">eSIM will be delivered to</p>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center flex-shrink-0">
                <Mail className="w-4 h-4 text-violet-500" />
              </div>
              <div>
                <div className="text-xs text-slate-400 mb-0.5">Email</div>
                <div className="text-slate-700 font-semibold text-sm">{currentOrder.customers.email}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-green-50 border border-green-100 flex items-center justify-center flex-shrink-0">
                <MessageCircle className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <div className="text-xs text-slate-400 mb-0.5">WhatsApp</div>
                <div className="text-slate-700 font-semibold text-sm">{currentOrder.customers.whatsapp || currentOrder.customers.phone}</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Trust badges ── */}
        <div className="grid grid-cols-3 gap-3 pb-8">
          {[
            { icon: Shield, text: 'Secure Payment', color: 'text-violet-500', bg: 'bg-violet-50' },
            { icon: Zap, text: 'Instant Delivery', color: 'text-amber-500', bg: 'bg-amber-50' },
            { icon: MessageCircle, text: '24/7 Support', color: 'text-green-600', bg: 'bg-green-50' },
          ].map(({ icon: BadgeIcon, text, color, bg }) => (
            <div key={text} className={`${bg} rounded-xl p-3 text-center`}>
              <BadgeIcon className={`w-5 h-5 ${color} mx-auto mb-1`} />
              <p className="text-xs font-semibold text-slate-600">{text}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
