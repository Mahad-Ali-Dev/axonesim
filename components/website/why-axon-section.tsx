'use client'
import { useRef, useEffect, useState } from 'react'
import {
  Zap, Signal, Shield, Lock, Globe, MessageCircle, ArrowRight,
} from 'lucide-react'
import Link from 'next/link'
import { TiltCard } from '@/components/ui/tilt-card'

/* ─── Feature data ─── */
const FEATURES = [
  {
    icon: Zap,
    label: 'Instant Delivery',
    desc: 'QR code delivered to your WhatsApp in under 2 minutes. No store visit, no waiting around.',
    stat: '2',
    unit: 'min',
    statLabel: 'avg delivery',
    color: '#0D6EFD',
    bg: 'rgba(13,110,253,0.06)',
    border: 'rgba(13,110,253,0.14)',
    barWidth: '92%',
    delay: 0,
  },
  {
    icon: Signal,
    label: '4G / 5G Speeds',
    desc: 'Premium local networks everywhere. No throttling, no fair-use limits. Full throttle, full speed.',
    stat: '87',
    unit: 'Mbps',
    statLabel: 'avg download',
    color: '#00C6FF',
    bg: 'rgba(0,198,255,0.06)',
    border: 'rgba(0,198,255,0.14)',
    barWidth: '87%',
    delay: 80,
  },
  {
    icon: Shield,
    label: 'No Hidden Fees',
    desc: 'What you see is what you pay. Flat pricing in PKR or USD. Zero roaming surprises. Ever.',
    stat: 'Rs 0',
    unit: '',
    statLabel: 'hidden charges',
    color: '#10B981',
    bg: 'rgba(16,185,129,0.06)',
    border: 'rgba(16,185,129,0.14)',
    barWidth: '100%',
    delay: 160,
  },
  {
    icon: Lock,
    label: 'Secure Payments',
    desc: 'Pay with JazzCash, Easypaisa, or Visa/MC. End-to-end encrypted via Safepay & Stripe.',
    stat: '100',
    unit: '%',
    statLabel: 'encrypted',
    color: '#8B5CF6',
    bg: 'rgba(139,92,246,0.06)',
    border: 'rgba(139,92,246,0.14)',
    barWidth: '100%',
    delay: 240,
  },
  {
    icon: Globe,
    label: '150+ Countries',
    desc: 'Asia, Europe, Americas, Middle East, Africa. One eSIM covers every corner of the globe.',
    stat: '150',
    unit: '+',
    statLabel: 'countries covered',
    color: '#F59E0B',
    bg: 'rgba(245,158,11,0.06)',
    border: 'rgba(245,158,11,0.14)',
    barWidth: '95%',
    delay: 320,
  },
  {
    icon: MessageCircle,
    label: '24/7 WhatsApp',
    desc: 'Real humans, always online. Support on WhatsApp around the clock — no bots, no tickets.',
    stat: '24',
    unit: '/7',
    statLabel: 'live support',
    color: '#FF6B6B',
    bg: 'rgba(255,107,107,0.06)',
    border: 'rgba(255,107,107,0.14)',
    barWidth: '100%',
    delay: 400,
  },
]

/* ─── Intersection Observer ─── */
function useInView(threshold = 0.08) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true) },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, inView }
}

/* ─── Animated counter ─── */
function AnimNum({ value, inView }: { value: string; inView: boolean }) {
  const [display, setDisplay] = useState('0')
  const numPart = value.replace(/[^0-9.]/g, '')
  const suffix = value.replace(/[0-9.]/g, '')

  useEffect(() => {
    if (!inView) return
    const target = parseFloat(numPart)
    if (isNaN(target)) { setDisplay(value); return }
    const steps = 40
    const duration = 1400
    let step = 0
    const timer = setInterval(() => {
      step++
      const progress = step / steps
      const eased = 1 - Math.pow(2, -10 * progress)
      setDisplay(String(Math.round(target * eased)))
      if (step >= steps) { setDisplay(String(target)); clearInterval(timer) }
    }, duration / steps)
    return () => clearInterval(timer)
  }, [inView, numPart, value])

  return <>{display}{suffix}</>
}

/* ─── Feature Card ─── */
function FeatureCard({ f, inView }: { f: typeof FEATURES[number]; inView: boolean }) {
  const Icon = f.icon
  return (
    <TiltCard intensity={5}>
      <div
        className="why-feature-card group h-full flex flex-col"
        style={{
          opacity: inView ? 1 : 0,
          transform: inView ? 'translateY(0)' : 'translateY(40px)',
          transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${f.delay}ms, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${f.delay}ms`,
        }}
      >
        {/* Colored top accent bar */}
        <div
          className="h-0.5 rounded-full mb-6 transition-all duration-500 group-hover:opacity-100"
          style={{
            background: `linear-gradient(90deg, ${f.color}, transparent)`,
            opacity: 0.6,
          }}
        />

        {/* Icon */}
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3 flex-shrink-0"
          style={{ background: f.bg, border: `1px solid ${f.border}` }}
        >
          <Icon className="w-5 h-5" style={{ color: f.color }} />
        </div>

        {/* Content */}
        <h3 className="text-lg font-bold text-[#212529] mb-2 font-heading tracking-tight">
          {f.label}
        </h3>
        <p className="text-sm text-[#6C757D] leading-relaxed font-body flex-1">
          {f.desc}
        </p>

        {/* Stat */}
        <div className="mt-5 pt-5 border-t border-[rgba(0,0,0,0.06)]">
          <div className="flex items-baseline gap-2 mb-3">
            <span
              className="text-3xl font-extrabold font-display tracking-tight leading-none"
              style={{ color: f.color }}
            >
              <AnimNum value={f.stat + f.unit} inView={inView} />
            </span>
            <span className="text-xs text-[#ADB5BD] font-semibold uppercase tracking-wider font-heading">
              {f.statLabel}
            </span>
          </div>
          {/* Animated progress bar */}
          <div className="h-1 rounded-full bg-[#F0F2F5] overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-[1800ms] ease-out"
              style={{
                background: `linear-gradient(90deg, ${f.color}, ${f.color}66)`,
                width: inView ? f.barWidth : '0%',
                transitionDelay: `${f.delay + 500}ms`,
              }}
            />
          </div>
        </div>
      </div>
    </TiltCard>
  )
}

/* ─── Stats banner ─── */
function StatBanner({ inView }: { inView: boolean }) {
  const stats = [
    { n: '5,000+', label: 'Happy travelers', color: '#0D6EFD' },
    { n: '150+',   label: 'Countries covered', color: '#00C6FF' },
    { n: '2 min',  label: 'Avg delivery', color: '#10B981' },
    { n: '4.9★',   label: 'Customer rating', color: '#F59E0B' },
  ]
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-16">
      {stats.map((s, i) => (
        <div
          key={s.label}
          className="text-center py-6 px-4 rounded-2xl bg-white border border-[rgba(0,0,0,0.06)] hover:border-[rgba(13,110,253,0.15)] hover:shadow-lg transition-all duration-300"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? 'translateY(0)' : 'translateY(20px)',
            transition: `all 0.6s cubic-bezier(0.16,1,0.3,1) ${200 + i * 80}ms`,
          }}
        >
          <div className="text-2xl font-extrabold font-display mb-1" style={{ color: s.color }}>{s.n}</div>
          <div className="text-xs text-[#ADB5BD] font-semibold uppercase tracking-wider font-heading">{s.label}</div>
        </div>
      ))}
    </div>
  )
}

/* ─── Main Section ─── */
export function WhyAxonSection() {
  const { ref, inView } = useInView(0.06)

  return (
    <section
      ref={ref}
      className="section relative overflow-hidden"
      style={{ background: '#F8F9FA' }}
    >
      {/* Decorations */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-[0.03] pointer-events-none blur-[140px]"
        style={{ background: 'radial-gradient(circle, #0D6EFD, transparent)' }} />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full opacity-[0.03] pointer-events-none blur-[120px]"
        style={{ background: 'radial-gradient(circle, #00C6FF, transparent)' }} />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* Section header */}
        <div
          className="text-center mb-14"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? 'none' : 'translateY(24px)',
            transition: 'all 0.7s cubic-bezier(0.16,1,0.3,1)',
          }}
        >
          <div className="badge-pill inline-flex mb-5">
            <Shield className="w-3.5 h-3.5" /> Built for Pakistan
          </div>
          <h2 className="display-md mb-5 text-[#212529]">
            Why Travelers Choose{' '}
            <span className="gradient-text">Axon</span>
          </h2>
          <p className="text-[#6C757D] max-w-xl mx-auto text-lg font-body">
            The only eSIM built specifically for Pakistani travelers — local payments, instant delivery, real support.
          </p>
        </div>

        {/* Stats banner */}
        <StatBanner inView={inView} />

        {/* 6-card bento grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map(f => (
            <FeatureCard key={f.label} f={f} inView={inView} />
          ))}
        </div>

        {/* CTA */}
        <div
          className="text-center mt-14"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? 'none' : 'translateY(20px)',
            transition: 'all 0.7s cubic-bezier(0.16,1,0.3,1) 700ms',
          }}
        >
          <Link
            href="/plans"
            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full text-base font-bold text-white btn-primary shadow-lg"
            style={{ boxShadow: '0 8px 32px rgba(13,110,253,0.25)' }}
          >
            Browse All Plans
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}

export default WhyAxonSection
