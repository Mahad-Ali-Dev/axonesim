'use client'
import { useState } from 'react'
import Link from 'next/link'
import {
  ChevronRight, Globe, Clock, CheckCircle2, Wifi, Signal,
  Smartphone, Shield, Zap, MessageCircle, ArrowRight, QrCode,
  Star, Sparkles,
} from 'lucide-react'
import type { Plan } from '@/types/database'
import { TiltCard } from '@/components/ui/tilt-card'
import { STATIC_PLANS } from '@/data/plans'

/* ── Device data ── */
const IPHONES = [
  'iPhone 17 Pro Max', 'iPhone 17 Pro', 'iPhone 17 Air', 'iPhone 17',
  'iPhone 16 Pro Max', 'iPhone 16 Pro', 'iPhone 16 Plus', 'iPhone 16',
  'iPhone 15 Pro Max', 'iPhone 15 Pro', 'iPhone 15 Plus', 'iPhone 15',
  'iPhone 14 Pro Max', 'iPhone 14 Pro', 'iPhone 14 Plus', 'iPhone 14',
  'iPhone 13 Pro Max', 'iPhone 13 Pro', 'iPhone 13 mini', 'iPhone 13',
  'iPhone 12 Pro Max', 'iPhone 12 Pro', 'iPhone 12 mini', 'iPhone 12',
  'iPhone 11 Pro Max', 'iPhone 11 Pro', 'iPhone 11',
  'iPhone XS Max', 'iPhone XS', 'iPhone XR',
]
const SAMSUNGS = [
  'Galaxy S25 Ultra', 'Galaxy S25+', 'Galaxy S25',
  'Galaxy S24 Ultra', 'Galaxy S24+', 'Galaxy S24',
  'Galaxy S23 Ultra', 'Galaxy S23+', 'Galaxy S23',
  'Galaxy Z Fold 6', 'Galaxy Z Fold 5', 'Galaxy Z Fold 4',
  'Galaxy Z Flip 6', 'Galaxy Z Flip 5', 'Galaxy Z Flip 4',
  'Galaxy Note 20 Ultra', 'Galaxy Note 20',
]
const OTHERS = [
  'Google Pixel 9 Pro', 'Google Pixel 9', 'Google Pixel 8 Pro', 'Google Pixel 8',
  'Google Pixel 7 Pro', 'Google Pixel 7', 'Google Pixel 6 Pro',
  'OnePlus 12', 'OnePlus 11',
  'Motorola Razr 40 Ultra', 'Motorola Edge 40 Pro',
  'Huawei P40 Pro', 'Huawei Mate 40 Pro',
]

export default function PlansClient({ plans: _dbPlans }: { plans: Plan[] }) {
  const [currency, setCurrency] = useState<'PKR' | 'USD'>('PKR')
  const [showAllIphones, setShowAllIphones] = useState(false)
  const [showAllSamsungs, setShowAllSamsungs] = useState(false)

  return (
    <div className="overflow-x-clip" style={{ background: '#FFFFFF' }}>

      {/* ═══════════ HERO ═══════════ */}
      <section className="relative px-5 pt-28 pb-16 overflow-hidden" style={{ background: '#020308' }}>
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(rgba(13,110,253,0.10) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full blur-[160px] pointer-events-none" style={{ background: 'rgba(13,110,253,0.12)' }} />

        <div className="max-w-6xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-white/[0.04] border border-white/[0.08] rounded-full px-4 py-2 mb-8 backdrop-blur-sm">
            <Globe className="w-3.5 h-3.5 text-[#3D8BFD]" />
            <span className="text-sm text-slate-400 font-medium font-body">150+ Countries · Data Only eSIM</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-6 font-heading">
            <span className="text-white">Choose Your</span>
            <br />
            <span className="gradient-text-hero">Data Plan</span>
          </h1>

          <p className="text-lg text-slate-400 max-w-xl mx-auto mb-10 leading-relaxed font-body">
            Instant activation. No roaming fees. Pay with JazzCash, Easypaisa, or card. All plans are <strong className="text-white">data-only</strong> eSIMs.
          </p>

          {/* Currency toggle */}
          <div className="inline-flex items-center bg-white/[0.04] border border-white/[0.07] rounded-full p-1.5 gap-1">
            {(['PKR', 'USD'] as const).map(c => (
              <button
                key={c}
                onClick={() => setCurrency(c)}
                className={`px-5 py-2 rounded-full text-sm font-bold transition-all font-heading ${
                  currency === c
                    ? 'bg-[#0D6EFD] text-white shadow-lg shadow-blue-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {c === 'PKR' ? '🇵🇰 PKR' : '🌍 USD'}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ PLANS GRID ═══════════ */}
      <section className="px-5 py-16" style={{ background: '#F8F9FA' }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {STATIC_PLANS.map(plan => (
              <TiltCard key={plan.id} intensity={5}>
                <PlanCard plan={plan} currency={currency} />
              </TiltCard>
            ))}
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-12">
            {[
              { icon: Zap, label: 'Instant Delivery', color: '#F59E0B' },
              { icon: Wifi, label: 'Hotspot Included', color: '#0D6EFD' },
              { icon: Signal, label: '4G/5G Speeds', color: '#00C6FF' },
              { icon: Shield, label: 'Secure Payments', color: '#10B981' },
            ].map(({ icon: Icon, label, color }) => (
              <div key={label} className="flex items-center gap-2 text-sm text-[#6C757D] font-medium font-body">
                <Icon className="w-4 h-4" style={{ color }} />
                {label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ DEVICE COMPATIBILITY ═══════════ */}
      <section className="section" style={{ background: '#FFFFFF' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="badge-pill inline-flex mb-5">
              <Smartphone className="w-3.5 h-3.5" /> Compatibility
            </div>
            <h2 className="display-md mb-5 text-[#212529]">
              Works With <span className="gradient-text">Your Phone</span>
            </h2>
            <p className="text-[#6C757D] max-w-lg mx-auto text-lg font-body">
              All modern flagship phones support eSIM. Check your device below.
            </p>
          </div>

          {/* Device cards with mockup images */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">

            {/* iPhone Card */}
            <div className="relative rounded-3xl overflow-hidden border border-[rgba(0,0,0,0.06)] bg-white hover:shadow-xl transition-all duration-300">
              {/* Image header */}
              <div className="relative h-64 bg-gradient-to-br from-[#1a1a2e] to-[#0f0f23] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(rgba(13,110,253,0.3) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                <img
                  src="/iphone-mockup.png"
                  alt="iPhone with eSIM activated"
                  className="relative z-10 h-52 w-auto object-contain drop-shadow-2xl"
                />
              </div>

              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-2xl bg-[#212529] flex items-center justify-center">
                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                  </div>
                  <div>
                    <h3 className="font-black text-lg text-[#212529] font-heading">Apple iPhone</h3>
                    <span className="text-xs text-[#ADB5BD] font-medium font-body">{IPHONES.length} models supported</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {(showAllIphones ? IPHONES : IPHONES.slice(0, 12)).map(m => (
                    <span key={m} className="flex items-center gap-1.5 text-xs bg-[#F8F9FA] border border-[rgba(0,0,0,0.04)] text-[#6C757D] px-2.5 py-1.5 rounded-lg hover:border-[rgba(13,110,253,0.12)] transition-colors font-body">
                      <CheckCircle2 className="w-3 h-3 text-[#10B981]" /> {m}
                    </span>
                  ))}
                </div>
                {IPHONES.length > 12 && (
                  <button
                    onClick={() => setShowAllIphones(v => !v)}
                    className="mt-3 text-xs text-[#0D6EFD] font-semibold hover:text-[#0A58CA] font-heading"
                  >
                    {showAllIphones ? 'Show less' : `Show all ${IPHONES.length} models`}
                  </button>
                )}
              </div>
            </div>

            {/* Android Card */}
            <div className="relative rounded-3xl overflow-hidden border border-[rgba(0,0,0,0.06)] bg-white hover:shadow-xl transition-all duration-300">
              <div className="relative h-64 bg-gradient-to-br from-[#0f2027] to-[#0a1628] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(rgba(0,198,255,0.3) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                <img
                  src="/android-mockup.png"
                  alt="Samsung Galaxy with eSIM activated"
                  className="relative z-10 h-52 w-auto object-contain drop-shadow-2xl"
                />
              </div>

              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-2xl bg-[#0D6EFD] flex items-center justify-center">
                    <Smartphone className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-black text-lg text-[#212529] font-heading">Android</h3>
                    <span className="text-xs text-[#ADB5BD] font-medium font-body">{SAMSUNGS.length + OTHERS.length} models supported</span>
                  </div>
                </div>

                <h4 className="text-xs font-bold text-[#212529] mb-2 font-heading uppercase tracking-wider">Samsung Galaxy</h4>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {(showAllSamsungs ? SAMSUNGS : SAMSUNGS.slice(0, 9)).map(m => (
                    <span key={m} className="flex items-center gap-1.5 text-xs bg-[#F8F9FA] border border-[rgba(0,0,0,0.04)] text-[#6C757D] px-2.5 py-1.5 rounded-lg hover:border-[rgba(0,198,255,0.15)] transition-colors font-body">
                      <CheckCircle2 className="w-3 h-3 text-[#00A3D9]" /> {m}
                    </span>
                  ))}
                </div>

                <h4 className="text-xs font-bold text-[#212529] mb-2 font-heading uppercase tracking-wider">Google, OnePlus, Motorola & More</h4>
                <div className="flex flex-wrap gap-1.5">
                  {OTHERS.slice(0, 6).map(m => (
                    <span key={m} className="flex items-center gap-1.5 text-xs bg-[#F8F9FA] border border-[rgba(0,0,0,0.04)] text-[#6C757D] px-2.5 py-1.5 rounded-lg hover:border-[rgba(13,110,253,0.12)] transition-colors font-body">
                      <CheckCircle2 className="w-3 h-3 text-[#0D6EFD]" /> {m}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => setShowAllSamsungs(v => !v)}
                  className="mt-3 text-xs text-[#0D6EFD] font-semibold hover:text-[#0A58CA] font-heading"
                >
                  {showAllSamsungs ? 'Show less' : 'Show all models'}
                </button>
              </div>
            </div>
          </div>

          {/* Compatibility notice */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
            <div className="inline-flex items-center gap-2.5 text-sm text-[#6C757D] bg-[rgba(245,158,11,0.05)] border border-[rgba(245,158,11,0.15)] rounded-full px-5 py-2.5 font-body">
              <span className="text-[#D97706] font-bold text-xs">!</span>
              Phone must be <strong className="text-[#D97706] mx-0.5">carrier-unlocked</strong> & <strong className="text-[#D97706] mx-0.5">eSIM-capable</strong>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ QR CODE CTA ═══════════ */}
      <section className="relative overflow-hidden py-20 px-5" style={{ background: '#020308' }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 80% 70% at 50% 50%, rgba(13,110,253,0.10) 0%, transparent 70%)' }} />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Left: Text */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-white/[0.04] border border-white/[0.08] rounded-full px-4 py-2 mb-8 backdrop-blur-sm">
                <QrCode className="w-3.5 h-3.5 text-[#3D8BFD]" />
                <span className="text-sm text-slate-400 font-medium font-body">Instant Activation</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black text-white mb-6 font-heading tracking-tight leading-tight">
                Scan QR Code.
                <br />
                <span className="gradient-text">Go Online Instantly.</span>
              </h2>

              <p className="text-slate-400 text-base mb-8 max-w-md font-body leading-relaxed">
                After purchase, your QR code arrives on WhatsApp & email in under 2 minutes. Scan it from your phone settings and you&apos;re connected — no physical SIM needed.
              </p>

              <div className="space-y-3 mb-10">
                {[
                  { icon: Zap, text: 'QR code delivered in under 2 minutes', color: '#F59E0B' },
                  { icon: Wifi, text: 'Auto-connects to local 4G/5G network', color: '#00C6FF' },
                  { icon: Shield, text: 'Works alongside your existing SIM', color: '#10B981' },
                ].map(({ icon: Icon, text, color }) => (
                  <div key={text} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${color}15`, border: `1px solid ${color}30` }}>
                      <Icon className="w-4 h-4" style={{ color }} />
                    </div>
                    <span className="text-sm text-slate-300 font-body">{text}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/plans#top"
                  className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-sm font-bold text-white bg-gradient-to-r from-[#0D6EFD] to-[#0A58CA] shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40 hover:scale-[1.03] transition-all duration-300 font-heading"
                >
                  <Sparkles className="w-4 h-4" />
                  Get Your eSIM Now
                </Link>
                <a
                  href="https://wa.me/923349542871"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold text-slate-300 bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] transition-all font-heading"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  Ask on WhatsApp
                </a>
              </div>
            </div>

            {/* Right: Phone mockup */}
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                <div className="w-[80%] h-[80%] rounded-full blur-[100px]" style={{ background: 'radial-gradient(circle, rgba(13,110,253,0.25), transparent 70%)' }} />
              </div>
              <img
                src="/qr-mockup.png"
                alt="eSIM QR code activation on iPhone and Samsung"
                className="relative z-10 w-full max-w-lg object-contain drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

/* ── Plan Card Component ── */
function PlanCard({
  plan,
  currency,
}: {
  plan: Plan
  currency: 'PKR' | 'USD'
}) {
  const isFeatured = plan.is_featured

  return (
    <div className={`relative h-full flex flex-col rounded-2xl overflow-hidden transition-all duration-300 ${
      isFeatured
        ? 'bg-gradient-to-br from-[#0D6EFD] to-[#0041A8] shadow-2xl shadow-blue-600/25 border border-blue-400/20 scale-[1.02]'
        : 'bg-white border border-[rgba(0,0,0,0.06)] hover:border-[rgba(13,110,253,0.20)] hover:shadow-xl hover:shadow-blue-600/8'
    }`}>

      {isFeatured && (
        <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-white/40 to-transparent" />
      )}

      <div className="p-6 flex flex-col h-full">
        {/* Badge */}
        {plan.badge && (
          <div className="mb-4">
            <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-full tracking-wide uppercase font-heading ${
              isFeatured
                ? 'bg-white/15 text-white border border-white/20'
                : 'bg-[#F8F9FA] text-[#6C757D] border border-[rgba(0,0,0,0.06)]'
            }`}>
              {isFeatured && <Star className="w-2.5 h-2.5 fill-current" />}
              {plan.badge}
            </span>
          </div>
        )}

        {/* Plan name */}
        <h3 className={`text-base font-bold mb-1 font-heading ${isFeatured ? 'text-blue-100' : 'text-[#6C757D]'}`}>
          Global Data Plan
        </h3>

        {/* Data amount */}
        <div className="flex items-baseline gap-1.5 mb-0.5">
          <span className={`text-5xl font-black leading-none price-tag ${isFeatured ? 'text-white' : 'text-[#212529]'}`}>
            {plan.data_gb}
          </span>
          <span className={`text-xl font-bold ${isFeatured ? 'text-blue-200' : 'text-[#ADB5BD]'}`}>GB</span>
        </div>
        <div className={`flex items-center gap-3 text-xs mb-5 font-body ${isFeatured ? 'text-blue-200' : 'text-[#ADB5BD]'}`}>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" /> {plan.validity_days} days
          </span>
          <span className="flex items-center gap-1">
            <Globe className="w-3 h-3" /> 150+ countries
          </span>
        </div>

        {/* Price */}
        <div className={`mb-4 p-3.5 rounded-xl ${
          isFeatured
            ? 'bg-white/10 border border-white/15'
            : 'bg-[#F8F9FA] border border-[rgba(0,0,0,0.04)]'
        }`}>
          {currency === 'PKR' ? (
            <>
              <div className={`text-2xl font-black price-tag ${isFeatured ? 'text-white' : 'text-[#212529]'}`}>
                Rs {plan.price_pkr.toLocaleString()}
              </div>
              <div className={`text-xs mt-0.5 font-body ${isFeatured ? 'text-blue-200' : 'text-[#ADB5BD]'}`}>
                ${plan.price_usd} USD
              </div>
            </>
          ) : (
            <>
              <div className={`text-2xl font-black price-tag ${isFeatured ? 'text-white' : 'text-[#212529]'}`}>
                ${plan.price_usd}
              </div>
              <div className={`text-xs mt-0.5 font-body ${isFeatured ? 'text-blue-200' : 'text-[#ADB5BD]'}`}>
                Rs {plan.price_pkr.toLocaleString()} PKR
              </div>
            </>
          )}
        </div>

        {/* Features */}
        <div className="space-y-2 mb-5 flex-1">
          {[
            { label: 'Data only (no calls)', icon: Signal },
            { label: 'Instant WhatsApp delivery', icon: Zap },
            { label: 'Hotspot / tethering OK', icon: Wifi },
            { label: '4G/5G speeds', icon: CheckCircle2 },
          ].map(({ label, icon: Icon }) => (
            <div key={label} className={`flex items-center gap-2 text-xs font-body ${
              isFeatured ? 'text-blue-100' : 'text-[#6C757D]'
            }`}>
              <Icon className={`w-3 h-3 flex-shrink-0 ${isFeatured ? 'text-blue-200' : 'text-[#10B981]'}`} />
              {label}
            </div>
          ))}
        </div>

        {/* CTA */}
        <Link
          href={`/checkout?plan=${plan.id}`}
          className={`w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all duration-200 mt-auto font-heading ${
            isFeatured
              ? 'bg-white text-[#0D6EFD] hover:bg-blue-50 shadow-lg shadow-black/10'
              : 'btn-primary'
          }`}
        >
          Buy Now <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  )
}
