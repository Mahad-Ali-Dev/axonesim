"use client"

import { useRef, useEffect, useCallback, Suspense, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { EsimScene } from './esim-3d-chip'
import { Globe, Zap, QrCode, Shield, MessageCircle } from 'lucide-react'

/* ─── Helpers ─── */
const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v))
const smoothstep = (e0: number, e1: number, x: number) => {
  const t = clamp((x - e0) / (e1 - e0), 0, 1)
  return t * t * (3 - 2 * t)
}

/* ─── Phase data ─── */
const PHASES = [
  {
    title: 'Global Coverage',
    subtitle: '150+ Countries. One eSIM. Everywhere You Travel.',
    Icon: Globe,
    color: 'from-violet-400 to-indigo-400',
    start: 0.02, end: 0.20,
  },
  {
    title: 'Blazing Fast',
    subtitle: 'Full 4G/5G Speeds. No Throttling. No Caps.',
    Icon: Zap,
    color: 'from-cyan-400 to-blue-400',
    start: 0.20, end: 0.40,
  },
  {
    title: '2-Minute Delivery',
    subtitle: 'QR Code on WhatsApp. Scan & Go Online Instantly.',
    Icon: QrCode,
    color: 'from-emerald-400 to-teal-400',
    start: 0.40, end: 0.60,
  },
  {
    title: 'Secure Payments',
    subtitle: 'JazzCash · Easypaisa · Visa · Mastercard',
    Icon: Shield,
    color: 'from-amber-400 to-orange-400',
    start: 0.60, end: 0.80,
  },
  {
    title: '24/7 Support',
    subtitle: 'Real Humans on WhatsApp. Always Online.',
    Icon: MessageCircle,
    color: 'from-pink-400 to-rose-400',
    start: 0.80, end: 1.0,
  },
]

/* ─── Component ─── */
export function ScrollEsimSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const stickyRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef(0)
  const textRefs = useRef<(HTMLDivElement | null)[]>([])
  const dotRefs = useRef<(HTMLDivElement | null)[]>([])
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsMobile(window.innerWidth < 768)
    const handler = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  const updateOverlays = useCallback((progress: number) => {
    /* Update text overlays */
    PHASES.forEach((phase, i) => {
      const el = textRefs.current[i]
      if (!el) return
      const fadeIn = smoothstep(phase.start, phase.start + 0.06, progress)
      const fadeOut = 1 - smoothstep(phase.end - 0.06, phase.end, progress)
      const opacity = fadeIn * fadeOut
      const y = (1 - fadeIn) * 40 + (1 - fadeOut) * -40
      el.style.opacity = String(opacity)
      el.style.transform = `translateY(${y}px)`
      el.style.pointerEvents = opacity > 0.5 ? 'auto' : 'none'
    })

    /* Update phase dots */
    PHASES.forEach((phase, i) => {
      const dot = dotRefs.current[i]
      if (!dot) return
      const active = progress >= phase.start && progress < phase.end
      dot.style.opacity = active ? '1' : '0.25'
      dot.style.transform = active ? 'scale(1.5)' : 'scale(1)'
      dot.style.background = active ? '#7c3aed' : 'rgba(255,255,255,0.15)'
      dot.style.boxShadow = active ? '0 0 12px rgba(124,58,237,0.6)' : 'none'
    })
  }, [])

  useEffect(() => {
    let ticking = false
    const handleScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        const section = sectionRef.current
        if (!section) { ticking = false; return }
        const rect = section.getBoundingClientRect()
        const scrollable = rect.height - window.innerHeight
        const scrolled = Math.max(0, -rect.top)
        const progress = clamp(scrolled / scrollable, 0, 1)
        progressRef.current = progress
        updateOverlays(progress)
        ticking = false
      })
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [updateOverlays])

  return (
    <section
      ref={sectionRef}
      className="scroll-esim-outer relative"
      style={{ height: isMobile ? '300vh' : '380vh' }}
    >
      <div
        ref={stickyRef}
        className="sticky top-0 h-[100dvh] w-full overflow-hidden"
      >
        {/* Top / bottom gradient fades */}
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#020308] to-transparent z-20 pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#020308] to-transparent z-20 pointer-events-none" />

        {/* Atmospheric glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-violet-600/[0.06] blur-[140px] pointer-events-none animate-breathe" />
        <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] rounded-full bg-cyan-600/[0.04] blur-[120px] pointer-events-none animate-breathe delay-700" />

        {/* 3D Canvas */}
        <div className="absolute inset-0 z-0">
          <Suspense fallback={null}>
            <Canvas
              camera={{ position: [0, 0, 5], fov: 45 }}
              dpr={[1, isMobile ? 1.5 : 2]}
              gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
              style={{ background: 'transparent' }}
            >
              <EsimScene progressRef={progressRef} />
            </Canvas>
          </Suspense>
        </div>

        {/* Phase text overlays */}
        <div className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center px-5">
          {PHASES.map((phase, i) => (
            <div
              key={i}
              ref={el => { textRefs.current[i] = el }}
              className="absolute text-center max-w-xl"
              style={{
                opacity: 0,
                transition: 'none',
                bottom: isMobile ? '12%' : '14%',
              }}
            >
              {/* Icon */}
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/[0.08] mb-4 backdrop-blur-sm">
                <phase.Icon className="w-5 h-5 text-violet-400" />
              </div>

              {/* Title */}
              <h3
                className={`text-3xl sm:text-4xl md:text-5xl font-black mb-3 tracking-tight bg-gradient-to-r ${phase.color} bg-clip-text`}
                style={{ WebkitTextFillColor: 'transparent' }}
              >
                {phase.title}
              </h3>

              {/* Subtitle */}
              <p className="text-sm sm:text-base text-slate-400 font-medium leading-relaxed max-w-md mx-auto">
                {phase.subtitle}
              </p>
            </div>
          ))}
        </div>

        {/* Phase indicator dots */}
        <div className="absolute right-5 sm:right-8 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-3">
          {PHASES.map((_, i) => (
            <div
              key={i}
              ref={el => { dotRefs.current[i] = el }}
              className="w-2 h-2 rounded-full transition-all duration-300"
              style={{ background: 'rgba(255,255,255,0.15)', opacity: 0.25 }}
            />
          ))}
        </div>

        {/* Section header (visible at start) */}
        <div
          className="absolute top-8 left-1/2 -translate-x-1/2 z-10 text-center pointer-events-none"
          style={{ opacity: 1 }}
        >
          <div className="badge-pill inline-flex mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
            Interactive 3D Experience
          </div>
          <p className="text-[10px] text-slate-700 uppercase tracking-[0.2em] font-bold">
            Scroll to explore
          </p>
        </div>
      </div>
    </section>
  )
}

export default ScrollEsimSection
