'use client'
import { useRef, useEffect, useState, type MutableRefObject } from 'react'
import { Globe } from 'lucide-react'
import dynamic from 'next/dynamic'

/* ─── Lazy-load the heavy R3F canvas (no SSR) ─── */
const ESIMScene = dynamic(
  () => import('@/components/ui/esim-scene').then(m => m.ESIMScene),
  { ssr: false, loading: () => null }
)

/* ─── 5 Scroll Phases ─── */
const PHASES = [
  {
    label:   'Your eSIM',
    title:   'Digital. Instant.',
    titleHL: 'Global.',
    sub:     'No plastic. No store visit. Just scan a QR and connect anywhere on earth.',
    accent:  '#0D6EFD',
    accentCls: 'text-blue-400',
    icon:    '🌐',
  },
  {
    label:   '150+ Countries',
    title:   'Every Corner.',
    titleHL: 'One eSIM.',
    sub:     'Asia. Europe. Americas. Middle East. Our network spans 150+ countries on a single plan.',
    accent:  '#00C6FF',
    accentCls: 'text-cyan-400',
    icon:    '🗺️',
  },
  {
    label:   '4G / 5G Speeds',
    title:   'Full Throttle.',
    titleHL: 'No Limits.',
    sub:     'Premium local networks everywhere. No speed caps, no throttling, no fair-use BS.',
    accent:  '#f59e0b',
    accentCls: 'text-amber-400',
    icon:    '⚡',
  },
  {
    label:   'Instant Delivery',
    title:   'QR Code in',
    titleHL: '2 Minutes.',
    sub:     'Pay → receive QR on WhatsApp & email → scan → connected. That\'s the entire process.',
    accent:  '#10b981',
    accentCls: 'text-emerald-400',
    icon:    '📲',
  },
  {
    label:   'Secure Payments',
    title:   'JazzCash · Easypaisa',
    titleHL: '· Visa.',
    sub:     'Pay the Pakistani way. Fully encrypted by Safepay and Stripe. Zero friction.',
    accent:  '#FF6B6B',
    accentCls: 'text-red-400',
    icon:    '🔒',
  },
] as const

type Phase = typeof PHASES[number]

/* ─── Phase indicator dots ─── */
function PhaseDots({ phase, phases }: { phase: number; phases: readonly Phase[] }) {
  return (
    <div className="flex items-center gap-2">
      {phases.map((ph, i) => (
        <div
          key={i}
          className="rounded-full transition-all duration-500 ease-out"
          style={{
            width:      i === phase ? 22 : 7,
            height:     7,
            background: i === phase ? ph.accent : 'rgba(0,0,0,0.06)',
            boxShadow:  i === phase ? `0 0 10px ${ph.accent}80` : 'none',
          }}
        />
      ))}
    </div>
  )
}

/* ─── Phase text overlay ─── */
function PhaseText({ ph, phase }: { ph: Phase; phase: number }) {
  return (
    <div className="text-center px-4 max-w-3xl mx-auto">
      {/* Label bubble floating */}
      <div
        key={`label-${phase}`}
        className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-4 animate-fade-up backdrop-blur-md"
        style={{
          background: `rgba(255,255,255,0.03)`,
          border:     `1px solid rgba(255,255,255,0.1)`,
        }}
      >
        <span className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: ph.accent }}>
          {ph.label}
        </span>
      </div>

      {/* Heading */}
      <h2
        key={`title-${phase}`}
        className="animate-fade-up text-white font-extrabold tracking-tight leading-tight mb-3 font-display drop-shadow-lg"
        style={{
          fontSize: 'clamp(28px, 5vw, 56px)',
          animationDelay: '0.06s',
          letterSpacing: '-0.02em',
        }}
      >
        {ph.title}{' '}
        <span className="gradient-text gradient-glow" style={{
          backgroundImage: `linear-gradient(135deg, ${ph.accent}, #FFFFFF)`,
          color: 'transparent'
        }}>
          {ph.titleHL}
        </span>
      </h2>

      {/* Sub */}
      <p
        key={`sub-${phase}`}
        className="text-slate-300 text-sm sm:text-base leading-relaxed animate-fade-up font-body drop-shadow"
        style={{ animationDelay: '0.12s', maxWidth: '420px', margin: '0 auto' }}
      >
        {ph.sub}
      </p>

      {/* Add CTA */}
      <div
        key={`cta-${phase}`}
        className="mt-6 animate-fade-up flex justify-center"
        style={{ animationDelay: '0.18s' }}
      >
        <a href="/plans" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-bold text-white transition-all duration-300 hover:scale-105"
           style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)' }}>
          Get eSIM <Globe className="w-4 h-4 ml-1 opacity-70" />
        </a>
      </div>
    </div>
  )
}

/* ─── Main exported section ─── */
export function ScrollEsimSection() {
  const outerRef      = useRef<HTMLDivElement>(null)
  const progressRef   = useRef(0)
  const barRef        = useRef<HTMLDivElement>(null)
  const bgRef         = useRef<HTMLDivElement>(null)
  const [phase, setPhase]     = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    const handleScroll = () => {
      if (!outerRef.current) return
      const rect          = outerRef.current.getBoundingClientRect()
      const totalScrollable = outerRef.current.offsetHeight - window.innerHeight
      const scrolled      = -rect.top
      const p             = Math.max(0, Math.min(1, scrolled / totalScrollable))

      progressRef.current = p

      /* Progress bar — via DOM, no state re-render */
      if (barRef.current) barRef.current.style.transform = `scaleX(${p})`

      /* Background tint — via DOM */
      if (bgRef.current) {
        const ph = PHASES[Math.min(4, Math.floor(p * 5))]
        bgRef.current.style.background =
          `radial-gradient(ellipse 75% 55% at 50% 42%, ${ph.accent}30 0%, transparent 65%)`
      }

      /* Phase state (only 5 possible, cheap) */
      const newPhase = Math.min(4, Math.floor(p * 5))
      setPhase(prev => (prev !== newPhase ? newPhase : prev))
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const ph = PHASES[phase]

  return (
    /* ── Tall scroll container (380vh = ~5 screen-heights) ── */
    <section ref={outerRef} style={{ height: '380vh' }} className="relative">

      {/* ── Sticky viewport ── */}
      <div className="sticky top-0 h-screen overflow-hidden">

        {/* Solid dark base — prevents white page bleeding through */}
        <div className="absolute inset-0" style={{ background: '#070D1E' }} />

        {/* Atmospheric colored glow */}
        <div
          ref={bgRef}
          className="absolute inset-0 transition-all duration-700"
          style={{
            background: `radial-gradient(ellipse 75% 55% at 50% 42%, ${ph.accent}30 0%, transparent 65%)`,
          }}
        />
        {/* Fine grid overlay */}
        <div className="absolute inset-0 grid-bg-fine opacity-30" />

        {/* ── 3D Canvas ── */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          {mounted && <ESIMScene progressRef={progressRef} />}
        </div>

        {/* ── Phase dots ── */}
        <div className="absolute top-8 left-0 right-0 flex flex-col items-center gap-3 z-20 pointer-events-none">
          <PhaseDots phase={phase} phases={PHASES} />
        </div>

        {/* ── BOTTOM: Floating Text UI ── */}
        <div className="absolute inset-x-0 bottom-12 z-30 pointer-events-auto">
          {/* Animated text block — key forces re-animation on phase change */}
          <PhaseText key={phase} ph={ph} phase={phase} />
        </div>

        {/* ── Scroll progress bar ── */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] z-30 bg-black/[0.04]">
          <div
            ref={barRef}
            className="h-full origin-left"
            style={{
              background: `linear-gradient(90deg, #0D6EFD, ${ph.accent})`,
              transform: 'scaleX(0)',
            }}
          />
        </div>

        {/* ── Scroll hint ── */}
        {phase === 0 && (
          <div className="absolute top-1/2 mt-32 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1.5 animate-float-slow pointer-events-none opacity-40">
            <span className="text-[9px] text-white uppercase tracking-[0.25em] font-bold">Scroll</span>
            <div className="w-[1px] h-8 bg-gradient-to-b from-white to-transparent" />
          </div>
        )}
      </div>
    </section>
  )
}
