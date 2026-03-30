'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { CheckCircle2, Clock, Loader2, MessageCircle, Mail, QrCode, Copy, Check, Sparkles, Globe, Signal } from 'lucide-react'
import type { OrderWithDetails } from '@/types/database'
import type { ConfettiRef } from '@/components/ui/confetti'
import { Confetti } from '@/components/ui/confetti'

const STATUS_CONFIG = {
  pending:    { icon: Clock,         label: 'Payment Pending',   color: 'text-yellow-400',  bg: 'bg-yellow-400/10',  border: 'border-yellow-400/20' },
  paid:       { icon: Loader2,       label: 'Processing',        color: 'text-blue-400',    bg: 'bg-blue-400/10',    border: 'border-blue-400/20'   },
  processing: { icon: Loader2,       label: 'Generating eSIM',   color: 'text-cyan-400',    bg: 'bg-cyan-400/10',    border: 'border-cyan-400/20'   },
  delivered:  { icon: CheckCircle2,  label: 'eSIM Delivered! 🎉', color: 'text-green-400',   bg: 'bg-green-400/10',   border: 'border-green-400/20'  },
  activated:  { icon: CheckCircle2,  label: 'eSIM Activated! 🚀', color: 'text-green-400',   bg: 'bg-green-400/10',   border: 'border-green-400/20'  },
  expired:    { icon: Clock,         label: 'Expired',           color: 'text-gray-400',    bg: 'bg-gray-400/10',    border: 'border-gray-400/20'   },
  cancelled:  { icon: Clock,         label: 'Cancelled',         color: 'text-red-400',     bg: 'bg-red-400/10',     border: 'border-red-400/20'    },
}

export default function OrderClient({ order }: { order: OrderWithDetails }) {
  const [copied, setCopied] = useState(false)
  const [currentOrder, setCurrentOrder] = useState(order)
  const confettiRef = useRef<ConfettiRef>(null)
  const confettiFired = useRef(false)

  const config = STATUS_CONFIG[currentOrder.status]
  const Icon = config.icon
  const isSuccess = currentOrder.status === 'delivered' || currentOrder.status === 'activated'

  // Fire confetti when delivered/activated
  useEffect(() => {
    if (isSuccess && !confettiFired.current) {
      confettiFired.current = true
      setTimeout(() => {
        confettiRef.current?.fire({
          particleCount: 150,
          spread: 100,
          origin: { y: 0.4 },
          colors: ['#7c3aed', '#6366f1', '#a78bfa', '#22d3ee', '#f59e0b', '#ffffff'],
        })
      }, 300)
    }
  }, [isSuccess])

  // Poll for status when pending/paid/processing
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
    <div className="min-h-screen px-4 py-24">
      <Confetti ref={confettiRef} className="fixed inset-0 w-full h-full pointer-events-none z-50" manualstart />

      <div className="max-w-2xl mx-auto">

        {/* Status header */}
        <div className="text-center mb-8">
          {isSuccess && (
            <div className="inline-flex items-center gap-2 badge-pill badge-green mb-4">
              <Sparkles className="w-3.5 h-3.5" /> Payment Successful
            </div>
          )}
          <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full ${config.bg} border ${config.border} mb-4`}>
            <Icon className={`w-9 h-9 ${config.color} ${['paid', 'processing'].includes(currentOrder.status) ? 'animate-spin' : ''}`} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black mb-2">{config.label}</h1>
          <p className="text-slate-500 text-sm">
            Order ID: <span className="text-white font-mono text-xs bg-white/5 border border-white/10 px-2 py-1 rounded-lg">{currentOrder.id}</span>
          </p>
        </div>

        {/* Order details card */}
        <div className="card rounded-2xl p-6 mb-5">
          <h3 className="font-bold text-sm uppercase tracking-wider text-slate-500 mb-4">Order Details</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Plan', value: currentOrder.plans.name },
              { label: 'Data', value: `${currentOrder.plans.data_gb} GB · ${currentOrder.plans.validity_days} days` },
              { label: 'Amount Paid', value: currentOrder.currency === 'PKR' ? `Rs ${currentOrder.amount_paid.toLocaleString()}` : `$${currentOrder.amount_paid}`, highlight: true },
              { label: 'Payment via', value: currentOrder.payment_method.charAt(0).toUpperCase() + currentOrder.payment_method.slice(1) },
            ].map(({ label, value, highlight }) => (
              <div key={label}>
                <div className="text-xs text-slate-500 mb-1">{label}</div>
                <div className={`font-semibold text-sm ${highlight ? 'gradient-text text-base' : ''}`}>{value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* eSIM QR code */}
        {isSuccess && currentOrder.qr_code_url && (
          <div className="rounded-2xl border border-green-400/20 bg-green-400/5 p-6 mb-5 text-center">
            <div className="flex items-center justify-center gap-2 mb-5">
              <QrCode className="w-5 h-5 text-green-400" />
              <h2 className="font-bold text-lg">Your eSIM QR Code</h2>
            </div>
            <div className="inline-block bg-white p-4 rounded-2xl mb-4 shadow-xl shadow-black/30">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={currentOrder.qr_code_url} alt="eSIM QR Code" className="w-52 h-52" />
            </div>
            <p className="text-sm text-slate-400 mb-5">
              Go to <strong className="text-white">Settings → Cellular → Add eSIM</strong> and scan this QR code
            </p>
            {currentOrder.esim_code && (
              <div className="bg-black/50 border border-white/10 rounded-xl p-3 flex items-center justify-between gap-3 mb-5 text-left">
                <code className="text-violet-400 text-xs break-all">{currentOrder.esim_code}</code>
                <button onClick={copyCode} className="flex-shrink-0 text-slate-500 hover:text-white transition-colors p-1">
                  {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            )}
            <div className="flex gap-3">
              <Link href="/activate" className="flex-1 btn-secondary py-2.5 rounded-xl text-sm text-center font-semibold">
                Activation Guide
              </Link>
              <a
                href={`https://wa.me/923349542871?text=Hi! My order ${currentOrder.id} needs help`}
                className="flex-1 flex items-center justify-center gap-2 bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 text-green-400 font-semibold py-2.5 rounded-xl text-sm transition-colors"
              >
                <MessageCircle className="w-4 h-4" /> WhatsApp Help
              </a>
            </div>
          </div>
        )}

        {/* Pending/processing */}
        {['pending', 'paid', 'processing'].includes(currentOrder.status) && (
          <div className="card rounded-2xl p-6 mb-5 text-center border-violet-500/20">
            <div className="w-14 h-14 rounded-full bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mx-auto mb-4">
              <Loader2 className="w-7 h-7 text-violet-400 animate-spin" />
            </div>
            <p className="text-slate-300 font-medium mb-1">
              {currentOrder.status === 'pending' ? 'Waiting for payment confirmation…' : 'Your eSIM is being generated…'}
            </p>
            <p className="text-xs text-slate-600">This page auto-refreshes every 5 seconds</p>
          </div>
        )}

        {/* Delivery info */}
        <div className="card rounded-2xl p-5 text-sm">
          <h3 className="font-semibold mb-4 text-slate-400 uppercase text-xs tracking-wider">Delivery Channels</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center flex-shrink-0">
                <Mail className="w-4 h-4 text-violet-400" />
              </div>
              <div>
                <div className="text-xs text-slate-500">Email</div>
                <div className="text-slate-300">{currentOrder.customers.email}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center flex-shrink-0">
                <MessageCircle className="w-4 h-4 text-green-400" />
              </div>
              <div>
                <div className="text-xs text-slate-500">WhatsApp</div>
                <div className="text-slate-300">{currentOrder.customers.whatsapp || currentOrder.customers.phone}</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
