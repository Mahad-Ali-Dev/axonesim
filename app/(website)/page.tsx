import Link from 'next/link'
import { ScrollEsimSection } from '@/components/website/scroll-esim-section'
import { WhyAxonSection } from '@/components/website/why-axon-section'
import {
  Globe, Shield, Zap, MessageCircle, Star, CheckCircle2,
  ChevronRight, Smartphone, CreditCard, Clock, Lock,
  Signal, ArrowRight, Sparkles, Wifi, ChevronDown,
  Plane, QrCode, Download, Users,
} from 'lucide-react'
import { TypingAnimation } from '@/components/ui/typing-animation'
import { Button as MovingBorderBtn } from '@/components/ui/moving-border'

import { OrbitingCircles } from '@/components/ui/orbiting-circles'
import { MaskContainer } from '@/components/ui/svg-mask-effect'
import { AnimatedCounter } from '@/components/ui/animated-counter'
import { Marquee } from '@/components/ui/marquee'
import { TextFlippingBoard } from '@/components/ui/text-flipping-board'

import { TiltCard } from '@/components/ui/tilt-card'
import { World } from '@/components/ui/globe-client'
import { WorldMap } from '@/components/ui/world-map-client'

/* ─── Globe config ─── */
const GLOBE_CONFIG = {
  pointSize: 5,
  globeColor: '#0D2151',
  showAtmosphere: true,
  atmosphereColor: '#0D6EFD',
  atmosphereAltitude: 0.22,
  emissive: '#0A1640',
  emissiveIntensity: 0.22,
  shininess: 1.0,
  polygonColor: 'rgba(13,110,253,0.35)',
  ambientLight: '#2A5099',
  directionalLeftLight: '#4A9EFF',
  directionalTopLight: '#ffffff',
  pointLight: '#0D6EFD',
  arcTime: 1000,
  arcLength: 0.9,
  rings: 3,
  maxRings: 5,
  initialPosition: { lat: 30.3753, lng: 69.3451 },
  autoRotate: true,
  autoRotateSpeed: 0.5,
}
const GC = ['#0D6EFD', '#00C6FF', '#3D8BFD', '#0A58CA']
const GLOBE_ARCS = [
  { order:1,  startLat:30.37, startLng:69.34, endLat:35.67,  endLng:139.65, arcAlt:0.4, color:GC[0] },
  { order:2,  startLat:30.37, startLng:69.34, endLat:51.50,  endLng:-0.12,  arcAlt:0.5, color:GC[1] },
  { order:3,  startLat:30.37, startLng:69.34, endLat:25.20,  endLng:55.27,  arcAlt:0.18,color:GC[2] },
  { order:4,  startLat:30.37, startLng:69.34, endLat:1.35,   endLng:103.81, arcAlt:0.3, color:GC[3] },
  { order:5,  startLat:30.37, startLng:69.34, endLat:48.85,  endLng:2.35,   arcAlt:0.5, color:GC[0] },
  { order:6,  startLat:30.37, startLng:69.34, endLat:40.71,  endLng:-74.00, arcAlt:0.6, color:GC[1] },
  { order:7,  startLat:30.37, startLng:69.34, endLat:-33.86, endLng:151.20, arcAlt:0.5, color:GC[2] },
  { order:8,  startLat:30.37, startLng:69.34, endLat:3.13,   endLng:101.68, arcAlt:0.3, color:GC[3] },
  { order:9,  startLat:30.37, startLng:69.34, endLat:41.00,  endLng:28.97,  arcAlt:0.3, color:GC[0] },
  { order:10, startLat:30.37, startLng:69.34, endLat:28.61,  endLng:77.20,  arcAlt:0.12,color:GC[1] },
  { order:11, startLat:30.37, startLng:69.34, endLat:34.05,  endLng:-118.24,arcAlt:0.6, color:GC[2] },
  { order:12, startLat:30.37, startLng:69.34, endLat:55.75,  endLng:37.61,  arcAlt:0.4, color:GC[3] },
]

/* ─── Static data ─── */
const PLANS = [
  { name:'Starter',  data:'5 GB',  days:30, pkr:1500, usd:6,  badge:'Most Popular', featured:true  },
  { name:'Explorer', data:'10 GB', days:30, pkr:2450, usd:9,  badge:'Best Value',   featured:false },
  { name:'Premium',  data:'20 GB', days:30, pkr:3850, usd:14, badge:'Power User',   featured:false },
]

const IPHONES = [
  'iPhone 17 Pro Max','iPhone 17 Pro','iPhone 17 Air','iPhone 17',
  'iPhone 16 Pro Max','iPhone 16 Pro','iPhone 16 Plus','iPhone 16',
  'iPhone 15 Pro Max','iPhone 15 Pro','iPhone 15 Plus','iPhone 15',
  'iPhone 14 Pro Max','iPhone 14 Pro','iPhone 14 Plus','iPhone 14',
  'iPhone 13 Pro Max','iPhone 13 Pro','iPhone 13 mini','iPhone 13',
  'iPhone 12 Pro Max','iPhone 12 Pro','iPhone 12 mini','iPhone 12',
  'iPhone 11 Pro Max','iPhone 11 Pro','iPhone 11',
  'iPhone XS Max','iPhone XS','iPhone XR',
]
const SAMSUNGS = [
  'Galaxy S25 Ultra','Galaxy S25+','Galaxy S25',
  'Galaxy S24 Ultra','Galaxy S24+','Galaxy S24',
  'Galaxy S23 Ultra','Galaxy S23+','Galaxy S23',
  'Galaxy S22 Ultra','Galaxy S22+','Galaxy S22',
  'Galaxy S21 Ultra','Galaxy S21+','Galaxy S21',
  'Galaxy S20 Ultra','Galaxy S20+','Galaxy S20',
  'Galaxy Z Fold 6','Galaxy Z Fold 5','Galaxy Z Fold 4','Galaxy Z Fold 3',
  'Galaxy Z Flip 6','Galaxy Z Flip 5','Galaxy Z Flip 4','Galaxy Z Flip 3',
  'Galaxy Note 20 Ultra','Galaxy Note 20',
]
const OTHERS = [
  { brand:'Google Pixel', models:['Pixel 9 Pro XL','Pixel 9 Pro','Pixel 9','Pixel 8 Pro','Pixel 8','Pixel 7 Pro','Pixel 7','Pixel 6 Pro','Pixel 6','Pixel 5','Pixel 4 XL','Pixel 4','Pixel 3a'] },
  { brand:'Motorola', models:['Razr 40 Ultra','Razr 40','Edge 40 Pro','Edge 30 Ultra','Moto G 5G (2023)'] },
  { brand:'Huawei', models:['P40','P40 Pro','Mate 40 Pro','P50 Pro'] },
  { brand:'OnePlus', models:['12','11','10 Pro'] },
]
const REVIEW_IMAGES = [
  "005273e0-2520-4f8f-88b5-bef916dac8d1.jpg",
  "00d0d2ed-e2a4-4f74-acec-598ef5f8ab1f.jpg",
  "0467f9bf-8fa5-4937-b613-79821fb7a77d.jpg",
  "0592ed72-4e5f-427c-97fc-45b739a8b7c0.jpg",
  "0f730577-1054-4883-adf1-1d693b337278.jpg",
  "135bece2-3e97-4704-99df-50688f905f8a.jpg",
  "1589b16e-75d1-49ff-8069-46a91e2880fc.jpg",
  "270e7636-850c-44c2-bbc3-3498e2652fc0.jpg",
  "42fd1d48-5ac0-4927-b254-c8beed5abda9.jpg",
  "493cad10-8c6b-4ab8-8630-ce7d718103a2.jpg",
  "499e35cc-fa19-45ee-b135-df8761b216f5.jpg",
  "51a32e72-f1f1-4cdc-bc15-6781bea58a26.jpg",
  "68b37208-1920-4536-8d81-bc2607a784bc.jpg",
  "6aa2dde4-1917-41b2-8e00-b6516343a9ba.jpg",
  "6e01b6e8-6a9d-49a0-8038-96942e905bd7.jpg",
  "6eb287f1-b191-46d4-8f9c-d05ad5d1ee57.jpg",
  "78739d17-9046-4d66-ae6d-8b9cd98a5a0a.jpg",
  "7ba31269-9274-4371-87f0-ee67cd3fe92c.jpg",
  "81cfe78d-6c5a-4744-80c4-a3a1cb706aec.jpg",
  "86ce38c4-7ffc-4be7-9af2-5b981f761a40.jpg",
  "976080c9-4be9-49a9-9b56-c9774d50f31a.jpg",
  "982b831c-ef3c-4064-9230-577bc9113ea0.jpg",
  "9b12f149-433c-4971-9b5a-673fb573d22a.jpg",
  "a2392c4d-2627-48ac-bcc6-3d0e3d6ee2ff.jpg",
  "a8b3ef71-4978-4965-9a36-6b11e516e832.jpg",
  "bcfda5f2-d969-41c6-b7be-70281f4c9990.jpg",
  "c15b2ab3-6fba-44e5-815e-9ba722b9c738.jpg",
  "c72593b7-210e-4ccd-b2ae-e8e71ea6228b.jpg",
  "d7e87634-9166-4fca-805a-6776c97d7e3e.jpg",
  "f2d6c8e9-b75b-446f-9ca4-9faf537124ff.jpg",
  "f310ab6a-ab4c-429b-884f-ab4b8616661e.jpg",
  "f9fbebd4-d5b5-49d6-a9bb-8ff585666efd.jpg"
].map(f => `/reviews/${f}`)

const MAP_DOTS = [
  { start:{ lat:31.54, lng:74.34, label:'Pakistan' }, end:{ lat:35.67, lng:139.65, label:'Tokyo' } },
  { start:{ lat:31.54, lng:74.34, label:'Pakistan' }, end:{ lat:51.50, lng:-0.12,  label:'London' } },
  { start:{ lat:31.54, lng:74.34, label:'Pakistan' }, end:{ lat:25.20, lng:55.27,  label:'Dubai' } },
  { start:{ lat:31.54, lng:74.34, label:'Pakistan' }, end:{ lat:1.35,  lng:103.81, label:'Singapore' } },
  { start:{ lat:31.54, lng:74.34, label:'Pakistan' }, end:{ lat:48.85, lng:2.35,   label:'Paris' } },
  { start:{ lat:31.54, lng:74.34, label:'Pakistan' }, end:{ lat:40.71, lng:-74.00, label:'New York' } },
  { start:{ lat:31.54, lng:74.34, label:'Pakistan' }, end:{ lat:-33.86,lng:151.20, label:'Sydney' } },
  { start:{ lat:31.54, lng:74.34, label:'Pakistan' }, end:{ lat:3.13,  lng:101.68, label:'Kuala Lumpur' } },
]

const FAQS = [
  { q:'What is an eSIM?', a:'An eSIM (embedded SIM) is a digital SIM built into your phone. Instead of inserting a physical card, you scan a QR code to activate a data plan instantly. No store visit needed.' },
  { q:'How fast do I get the eSIM?', a:'Within 2 minutes of payment. Your QR code is delivered to WhatsApp and email automatically. Most customers are online in under 5 minutes total.' },
  { q:'What payment methods are accepted?', a:'JazzCash, Easypaisa, and Pakistani debit/credit cards via Safepay (in PKR). International Visa/Mastercard via Stripe (in USD). Zero hidden fees.' },
  { q:'When does validity start?', a:'Validity begins when you first connect to a network abroad, NOT from the purchase date. Buy early, activate when you land.' },
  { q:'Can I use hotspot/tethering?', a:'Yes! All plans include unlimited personal hotspot. Share data with laptops, tablets, or other devices.' },
  { q:'Do I need to remove my Pakistani SIM?', a:'No. Your phone supports dual SIM. Keep your local number active and use the eSIM for data abroad. Just set eSIM as the data line.' },
  { q:'What speeds will I get?', a:'Full 4G LTE / 5G speeds on premium local networks. No throttling, no speed caps, no fair usage limits.' },
]

/* ─── Sub-components ─── */
function Stars({ size = 'sm' }: { size?: 'sm' | 'md' }) {
  const cls = size === 'md' ? 'w-4 h-4' : 'w-3.5 h-3.5'
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`${cls} fill-[#F59E0B] text-[#F59E0B]`} />
      ))}
    </div>
  )
}

function FaqItem({ q, a }: { q: string; a: string }) {
  return (
    <details className="group border border-[rgba(0,0,0,0.06)] bg-white rounded-2xl p-5 cursor-pointer hover:border-[rgba(13,110,253,0.15)] hover:shadow-md hover:shadow-blue-500/5 transition-all duration-200">
      <summary className="flex items-center justify-between gap-4 font-semibold text-sm list-none [&::-webkit-details-marker]:hidden font-heading">
        <span className="text-[#212529]">{q}</span>
        <ChevronDown className="w-4 h-4 text-[#ADB5BD] flex-shrink-0 transition-transform duration-300 group-open:rotate-180 group-open:text-[#0D6EFD]" />
      </summary>
      <p className="text-sm text-[#6C757D] leading-relaxed mt-4 pt-4 border-t border-[rgba(0,0,0,0.06)]">{a}</p>
    </details>
  )
}

/* ─── Page ─── */
export default function HomePage() {
  return (
    <div className="overflow-x-clip" style={{ background: '#FFFFFF' }}>

      {/* ═══════════════════ HERO (DARK) ═══════════════════ */}
      <section className="relative min-h-[100dvh] flex items-center justify-center px-5 pt-20 pb-24 overflow-hidden dark-hero">
        {/* Background layers */}
        <div className="absolute inset-0 dot-bg opacity-30" style={{ backgroundImage: 'radial-gradient(rgba(13,110,253,0.15) 1px, transparent 1px)' }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full blur-[160px] pointer-events-none animate-breathe" style={{ background: 'rgba(13,110,253,0.10)' }} />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[400px] rounded-full blur-[130px] pointer-events-none animate-breathe delay-700" style={{ background: 'rgba(0,198,255,0.06)' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#020308] pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          {/* Live badge */}
          <div className="inline-flex items-center gap-2.5 bg-white/[0.04] border border-white/[0.08] rounded-full px-4 py-2 mb-10 backdrop-blur-sm">
            <span className="status-live" />
            <span className="text-sm text-slate-400 font-medium font-body">Delivering eSIMs to Pakistani travelers right now</span>
          </div>

          {/* Headline */}
          <h1 className="display-xl mb-6">
            <span className="block gradient-text-hero">Travel the World.</span>
            <span className="block text-white">Stay Connected.</span>
          </h1>

          {/* Animated subtitle */}
          <div className="h-9 mb-6 flex items-center justify-center">
            <TypingAnimation
              words={['Pay with JazzCash & Easypaisa.', 'Get eSIM on WhatsApp in 2 min.', '150+ countries. One flat price.', 'No roaming shock. Ever.']}
              loop
              className="text-lg text-slate-400 font-medium font-body"
            />
          </div>

          <p className="text-base sm:text-lg text-slate-500 max-w-xl mx-auto mb-12 leading-relaxed font-body">
            Pakistan&apos;s first eSIM service with local payment methods.
            QR code delivered to your WhatsApp in under{' '}
            <span className="text-white font-semibold">2 minutes</span>.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
            <Link
              href="/plans"
              className="relative flex items-center gap-2.5 px-8 py-4 rounded-full text-base font-bold text-white btn-primary shadow-lg"
              style={{ boxShadow: '0 8px 32px rgba(13,110,253,0.35)' }}
            >
              <span>Browse Plans</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="https://wa.me/923349542871"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 px-8 py-4 rounded-full text-base font-semibold text-slate-300 bg-white/[0.04] border border-white/[0.09] hover:bg-white/[0.08] hover:border-white/[0.16] transition-all"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              WhatsApp Us
            </a>
          </div>

          {/* Trust chips */}
          <div className="flex items-center justify-center gap-3 flex-wrap">
            {[
              { label: 'JazzCash',    color: 'text-red-400' },
              { label: 'Easypaisa',   color: 'text-emerald-400' },
              { label: 'Visa / MC',   color: 'text-[#00C6FF]' },
              { label: '150+ Countries', color: 'text-[#3D8BFD]' },
            ].map(({ label, color }) => (
              <span
                key={label}
                className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.07] ${color}`}
              >
                <span className="w-1 h-1 rounded-full bg-current opacity-60" />
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 animate-float-slow">
          <span className="text-[10px] text-slate-700 uppercase tracking-[0.22em] font-bold font-display">Scroll</span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-700" />
        </div>
      </section>

      {/* ═══════════════════ STATS ═══════════════════ */}
      <div className="divider-fade" />
      <div className="py-12 px-5" style={{ background: '#F8F9FA' }}>
        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label:'Countries Covered',  val:150,  suffix:'+',    icon:Globe,          color:'text-[#0D6EFD]', bg:'bg-[rgba(13,110,253,0.05)] border-[rgba(13,110,253,0.12)]' },
            { label:'Happy Travelers',    val:50,   suffix:'+',    icon:Users,          color:'text-[#00C6FF]', bg:'bg-[rgba(0,198,255,0.05)] border-[rgba(0,198,255,0.12)]' },
            { label:'Delivery Time',      val:2,    suffix:' min', icon:Zap,            color:'text-[#F59E0B]', bg:'bg-[rgba(245,158,11,0.05)] border-[rgba(245,158,11,0.12)]' },
            { label:'Support',            val:24,   suffix:'/7',   icon:MessageCircle,  color:'text-[#10B981]', bg:'bg-[rgba(16,185,129,0.05)] border-[rgba(16,185,129,0.12)]' },
          ].map(({ label, val, suffix, icon: Icon, color, bg }) => (
            <div key={label} className={`flex flex-col gap-3 p-5 rounded-2xl border bg-white ${bg} group hover:scale-[1.02] hover:shadow-md transition-all duration-300`}>
              <Icon className={`w-5 h-5 ${color}`} />
              <div>
                <div className={`text-3xl font-black stat-number ${color}`}>
                  <AnimatedCounter target={val} suffix={suffix} />
                </div>
                <p className="text-xs text-[#6C757D] font-semibold uppercase tracking-wider mt-1 font-heading">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="divider-fade" />

      {/* ═══════════════════ 3D SCROLL eSIM ═══════════════════ */}
      <ScrollEsimSection />

      <div className="divider-glow" />

      {/* ═══════════════════ TEXT FLIP BOARD ═══════════════════ */}
      <section className="py-20 overflow-hidden">
        <div className="text-center mb-8">
          <p className="section-label">Connecting Pakistan to the World</p>
        </div>
        <TextFlippingBoard
          rows={[
            'INSTANT ESIM DELIVERY ',
            'PAY WITH JAZZCASH NOW ',
            'WORKS IN 150+ COUNTRIES',
            'SCAN QR AND GO ONLINE ',
            'EASYPAISA ACCEPTED TOO',
            'NO ROAMING SURPRISES  ',
          ]}
          className="text-white"
        />
      </section>

      {/* ═══════════════════ PRICING ═══════════════════ */}
      <section className="section relative overflow-hidden" style={{ background: '#F8F9FA' }}>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full opacity-[0.04] blur-[180px] pointer-events-none" style={{ background: 'radial-gradient(circle, #0D6EFD, transparent 70%)' }} />

        <div className="max-w-6xl mx-auto relative z-10">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="badge-pill inline-flex mb-5">
              <Sparkles className="w-3.5 h-3.5" /> Popular Plans
            </div>
            <h2 className="display-md mb-5 text-[#212529]">
              Simple, Transparent <span className="gradient-text">Pricing</span>
            </h2>
            <p className="text-[#6C757D] max-w-lg mx-auto text-lg font-body">
              One plan. Global coverage. No hidden fees. No roaming charges.
            </p>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {PLANS.map((plan, i) => (
              <TiltCard key={plan.name} intensity={7}>
                <div className={`relative rounded-[22px] p-7 flex flex-col h-full transition-all duration-300 ${
                  plan.featured
                    ? 'card-featured border-gradient-strong'
                    : 'border border-[rgba(0,0,0,0.06)] bg-white hover:border-[rgba(13,110,253,0.20)] hover:shadow-lg'
                }`}>

                  {/* Featured accent line */}
                  {plan.featured && (
                    <div className="absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-[#0D6EFD] to-transparent" />
                  )}

                  {/* Badge */}
                  <div className="mb-5">
                    <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-full tracking-wide uppercase font-heading ${
                      plan.featured
                        ? 'bg-gradient-to-r from-[#0D6EFD] to-[#0A58CA] text-white shadow-lg shadow-blue-600/20'
                        : 'bg-[#F8F9FA] text-[#6C757D] border border-[rgba(0,0,0,0.06)]'
                    }`}>
                      {plan.featured && <Sparkles className="w-2.5 h-2.5" />}
                      {plan.badge}
                    </span>
                  </div>

                  {/* Plan name */}
                  <h3 className="text-xl font-black text-[#212529] mb-1 font-heading">{plan.name}</h3>
                  <p className="text-sm text-[#ADB5BD] mb-6 font-body">Global coverage · 150+ countries</p>

                  {/* Data display */}
                  <div className="flex items-baseline gap-1.5 mb-1">
                    <span className="text-6xl font-black price-tag leading-none text-[#212529]">{plan.data.split(' ')[0]}</span>
                    <span className="text-xl font-bold text-[#ADB5BD]">GB</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#ADB5BD] mb-7 font-body">
                    <Clock className="w-3 h-3" /> {plan.days} days validity
                  </div>

                  {/* Price box */}
                  <div className={`mb-7 p-4 rounded-2xl ${
                    plan.featured
                      ? 'bg-[rgba(13,110,253,0.05)] border border-[rgba(13,110,253,0.12)]'
                      : 'bg-[#F8F9FA] border border-[rgba(0,0,0,0.04)]'
                  }`}>
                    <div className="text-3xl font-black text-[#212529] price-tag">Rs {plan.pkr.toLocaleString()}</div>
                    <div className="text-sm text-[#ADB5BD] mt-0.5 font-body">${plan.usd} USD</div>
                  </div>

                  {/* Features */}
                  <div className="space-y-2.5 mb-8 flex-1">
                    {['4G/5G speeds', 'Hotspot included', 'WhatsApp delivery', '24/7 support'].map((f) => (
                      <div key={f} className="flex items-center gap-2.5 text-sm text-[#6C757D] font-body">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981] flex-shrink-0" />
                        {f}
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <Link
                    href="/plans"
                    className={`w-full py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all duration-300 mt-auto font-heading ${
                      plan.featured
                        ? 'btn-glow rounded-xl'
                        : 'bg-[#F8F9FA] border border-[rgba(0,0,0,0.08)] text-[#212529] hover:bg-[rgba(13,110,253,0.06)] hover:border-[rgba(13,110,253,0.20)] hover:text-[#0D6EFD]'
                    }`}
                  >
                    Get This Plan <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </TiltCard>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/plans" className="inline-flex items-center gap-2 text-sm text-[#0D6EFD] hover:text-[#0A58CA] transition-colors font-semibold group font-heading">
              View all plans & regions <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      <div className="divider-fade" />

      {/* ═══════════════════ SOCIAL PROOF — TRAVELER PHOTOS ═══════════════════ */}
      <section className="py-16 overflow-hidden" style={{ background: '#F8F9FA' }}>
        <div className="max-w-6xl mx-auto px-5 mb-10 text-center">
          <div className="badge-pill badge-amber inline-flex mb-4">
            <Users className="w-3.5 h-3.5" /> Real Travelers
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#212529] mb-3 font-heading tracking-tight">
            Connecting Pakistanis <span className="gradient-text">Worldwide</span>
          </h2>
          <p className="text-[#6C757D] text-base max-w-md mx-auto font-body">
            Join Pakistani travelers who stay connected without roaming bills.
          </p>
        </div>

        {/* Masonry-style photo wall */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 px-5 max-w-6xl mx-auto auto-rows-[200px]">
          {[
            { src: '/travelers/dubai.png', country: 'Dubai', flag: '🇦🇪', span: 'row-span-2' },
            { src: '/travelers/london.png', country: 'London', flag: '🇬🇧' },
            { src: '/travelers/singapore.png', country: 'Singapore', flag: '🇸🇬' },
            { src: '/travelers/paris.png', country: 'Paris', flag: '🇫🇷', span: 'row-span-2' },
            { src: '/travelers/tokyo.png', country: 'Tokyo', flag: '🇯🇵' },
            { src: '/travelers/newyork.png', country: 'New York', flag: '🇺🇸' },
            { src: '/travelers/istanbul.png', country: 'Istanbul', flag: '🇹🇷' },
            { src: '/travelers/kl.png', country: 'Kuala Lumpur', flag: '🇲🇾', span: 'col-span-2' },
          ].map(({ src, country, flag, span }) => (
            <div
              key={src}
              className={`relative overflow-hidden rounded-2xl bg-[#E9ECEF] group ${span || ''}`}
            >
              <img
                src={src}
                alt={`Pakistani traveler in ${country}`}
                className="w-full h-full object-cover absolute inset-0 group-hover:scale-105 transition-transform duration-500"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              {/* Country badge */}
              <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1.5">
                <span className="text-sm">{flag}</span>
                <span className="text-white text-xs font-semibold font-heading">{country}</span>
              </div>
              {/* Connected badge */}
              <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-[#10B981]/90 backdrop-blur-sm rounded-full px-2.5 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Signal className="w-3 h-3 text-white" />
                <span className="text-white text-[10px] font-bold font-heading">Connected</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="divider-fade" />

      {/* ═══════════════════ STEP-BY-STEP SETUP GUIDE ═══════════════════ */}
      <section className="section" style={{ background: '#FFFFFF' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="badge-pill badge-green inline-flex mb-5">
              <Smartphone className="w-3.5 h-3.5" /> Step-by-Step Guide
            </div>
            <h2 className="display-md mb-5 text-[#212529]">
              Setup Your eSIM in <span className="gradient-text">3 Easy Steps</span>
            </h2>
            <p className="text-[#6C757D] text-lg max-w-lg mx-auto font-body">
              Please follow these steps exactly. Most activation issues can be resolved by correctly configuring the Cellular / Mobile Data settings on your device.
            </p>
          </div>

          {/* Steps */}
          <div className="space-y-8">

            {/* Step 1 */}
            <div className="relative rounded-3xl border border-[rgba(0,0,0,0.06)] bg-white overflow-hidden hover:border-[rgba(13,110,253,0.15)] hover:shadow-xl hover:shadow-blue-600/5 transition-all duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                {/* Text */}
                <div className="p-8 sm:p-10 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm font-display text-white shadow-lg" style={{ background: '#0D6EFD' }}>
                      01
                    </div>
                    <h3 className="font-black text-xl text-[#212529] font-heading">Scan the QR Code</h3>
                  </div>
                  <p className="text-[#6C757D] text-sm leading-relaxed font-body mb-6">
                    Go to <strong className="text-[#212529]">Settings → Cellular</strong> (or Mobile Data) → <strong className="text-[#212529]">Add eSIM</strong> (or Add Data Plan). Center the QR code in the frame to install the eSIM.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-[rgba(13,110,253,0.06)] border border-[rgba(13,110,253,0.12)] text-[#0D6EFD]">
                      <CheckCircle2 className="w-3 h-3" /> QR sent via WhatsApp
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-[rgba(16,185,129,0.06)] border border-[rgba(16,185,129,0.12)] text-[#10B981]">
                      <CheckCircle2 className="w-3 h-3" /> Takes 30 seconds
                    </span>
                  </div>
                </div>
                {/* Image */}
                <div className="relative bg-[#0a0a0a] flex items-center justify-center p-6 min-h-[320px]">
                  <img
                    src="/settings/914ddd23-f261-406e-8d17-477724299be4.jpg"
                    alt="iPhone eSIM settings - Turn on line and data roaming"
                    className="rounded-2xl shadow-2xl max-h-[400px] w-auto object-contain"
                  />
                </div>
              </div>
              {/* Colored bottom line */}
              <div className="h-0.5 w-full" style={{ background: 'linear-gradient(90deg, #0D6EFD, transparent)' }} />
            </div>

            {/* Step 2 */}
            <div className="relative rounded-3xl border border-[rgba(0,0,0,0.06)] bg-white overflow-hidden hover:border-[rgba(0,198,255,0.15)] hover:shadow-xl hover:shadow-cyan-600/5 transition-all duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                {/* Image (left on desktop) */}
                <div className="relative bg-[#0a0a0a] flex items-center justify-center p-6 min-h-[320px] order-2 md:order-1">
                  <img
                    src="/settings/4ec00120-03bc-44b0-b974-8ab860a7661e.jpg"
                    alt="iPhone Mobile Data Network APN settings"
                    className="rounded-2xl shadow-2xl max-h-[400px] w-auto object-contain"
                  />
                </div>
                {/* Text */}
                <div className="p-8 sm:p-10 flex flex-col justify-center order-1 md:order-2">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm font-display text-white shadow-lg" style={{ background: '#00C6FF' }}>
                      02
                    </div>
                    <h3 className="font-black text-xl text-[#212529] font-heading">Turn On eSIM & Data Roaming</h3>
                  </div>
                  <p className="text-[#6C757D] text-sm leading-relaxed font-body mb-6">
                    After installation, select the new eSIM. Ensure its switch is <strong className="text-[#212529]">&apos;On&apos;</strong>. Now, turn on <strong className="text-[#212529]">&apos;Data Roaming&apos;</strong> for this specific line. This step is critical for international connectivity.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-[#6C757D] font-body">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#00A3D9] flex-shrink-0" />
                      Set APN to <strong className="text-[#212529] ml-1">&quot;plus&quot;</strong>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[#6C757D] font-body">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#00A3D9] flex-shrink-0" />
                      Leave Username & Password empty
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[#6C757D] font-body">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#00A3D9] flex-shrink-0" />
                      Enable Data Roaming toggle
                    </div>
                  </div>
                </div>
              </div>
              {/* Colored bottom line */}
              <div className="h-0.5 w-full" style={{ background: 'linear-gradient(90deg, #00C6FF, transparent)' }} />
            </div>

            {/* Step 3 */}
            <div className="relative rounded-3xl border border-[rgba(0,0,0,0.06)] bg-white overflow-hidden hover:border-[rgba(16,185,129,0.15)] hover:shadow-xl hover:shadow-emerald-600/5 transition-all duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                {/* Text */}
                <div className="p-8 sm:p-10 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm font-display text-white shadow-lg" style={{ background: '#10B981' }}>
                      03
                    </div>
                    <h3 className="font-black text-xl text-[#212529] font-heading">Select LTE & Go Online</h3>
                  </div>
                  <p className="text-[#6C757D] text-sm leading-relaxed font-body mb-6">
                    Go to <strong className="text-[#212529]">Voice & Data</strong> and select <strong className="text-[#212529]">LTE</strong>. Enable <strong className="text-[#212529]">VoLTE</strong> for best performance. When you land abroad, the eSIM connects automatically to the local 4G/5G network.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-[rgba(16,185,129,0.06)] border border-[rgba(16,185,129,0.12)] text-[#10B981]">
                      <Wifi className="w-3 h-3" /> Auto-connects on landing
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-[rgba(245,158,11,0.06)] border border-[rgba(245,158,11,0.12)] text-[#D97706]">
                      <Signal className="w-3 h-3" /> Full 4G/5G speeds
                    </span>
                  </div>
                </div>
                {/* Image */}
                <div className="relative bg-[#0a0a0a] flex items-center justify-center p-6 min-h-[320px]">
                  <img
                    src="/settings/ab617d1f-4991-4607-838e-f2d1d6d2001f.jpg"
                    alt="iPhone Voice & Data settings showing LTE selected and VoLTE enabled"
                    className="rounded-2xl shadow-2xl max-h-[400px] w-auto object-contain"
                  />
                </div>
              </div>
              {/* Colored bottom line */}
              <div className="h-0.5 w-full" style={{ background: 'linear-gradient(90deg, #10B981, transparent)' }} />
            </div>
          </div>

          {/* Pro tips */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-10">
            {[
              { icon: '💡', tip: 'Buy before you fly', desc: 'Purchase at home to avoid airport rush. eSIM activates only when you land.' },
              { icon: '📱', tip: 'Keep your local SIM', desc: 'Dual SIM means your Pakistani number stays active for calls while eSIM handles data.' },
              { icon: '🔋', tip: 'First time connecting?', desc: 'May take 2-3 minutes to register on local network after landing. Perfectly normal!' },
            ].map(({ icon, tip, desc }) => (
              <div key={tip} className="flex items-start gap-3.5 p-4 bg-[#F8F9FA] rounded-2xl border border-[rgba(0,0,0,0.06)] hover:border-[rgba(13,110,253,0.12)] hover:shadow-sm transition-all duration-200">
                <span className="text-2xl flex-shrink-0">{icon}</span>
                <div>
                  <div className="font-bold text-sm text-[#212529] mb-1 font-heading">{tip}</div>
                  <div className="text-xs text-[#6C757D] leading-relaxed font-body">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>



      <div className="divider-glow" />

      {/* ═══════════════════ 3D GLOBE (DARK) ═══════════════════ */}
      <section className="relative overflow-hidden py-16 sm:py-24" style={{ background: '#020308', color: 'white' }}>
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 80% 60% at 60% 50%, rgba(13,110,253,0.08) 0%, transparent 70%)' }} />

        <div className="max-w-7xl mx-auto px-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Left: Text */}
            <div className="relative z-10 order-2 lg:order-1 text-center lg:text-left">
              <div className="badge-pill badge-cyan inline-flex mb-6" style={{ background: 'rgba(0,198,255,0.08)', borderColor: 'rgba(0,198,255,0.20)', color: '#67e8f9' }}>
                <Globe className="w-3.5 h-3.5" /> Global Network
              </div>
              <h2 className="display-md mb-5 text-white leading-tight">
                From Pakistan<br />to <span className="gradient-text">Everywhere</span>
              </h2>
              <p className="text-slate-400 text-lg font-body mb-10 max-w-md">
                150+ countries. Premium local networks. Full 4G/5G speeds. One eSIM covers it all.
              </p>

              {/* Region grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-sm mx-auto lg:mx-0">
                {[
                  { region: 'Asia Pacific', count: '35+', icon: '🌏' },
                  { region: 'Europe',       count: '45+', icon: '🌍' },
                  { region: 'Americas',     count: '30+', icon: '🌎' },
                  { region: 'Middle East',  count: '15+', icon: '🕌' },
                  { region: 'Africa',       count: '20+', icon: '🌍' },
                  { region: 'Oceania',      count: '5+',  icon: '🏝️' },
                ].map(({ region, count, icon }) => (
                  <div key={region} className="flex items-center gap-2.5 px-3.5 py-3 rounded-2xl bg-white/[0.04] border border-white/[0.07] hover:border-[rgba(13,110,253,0.30)] hover:bg-[rgba(13,110,253,0.06)] transition-all duration-300 cursor-default">
                    <span className="text-base">{icon}</span>
                    <div>
                      <div className="text-sm font-black text-white font-display leading-none">{count}</div>
                      <div className="text-[10px] text-slate-500 font-body mt-0.5 leading-none">{region}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Globe */}
            <div className="order-1 lg:order-2 relative">
              {/* Spotlight glow behind globe */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                <div className="w-[70%] h-[70%] rounded-full blur-[100px]" style={{ background: 'radial-gradient(circle, rgba(13,110,253,0.40), transparent 70%)' }} />
              </div>
              <div className="relative w-full" style={{ aspectRatio: '1 / 1', maxWidth: '560px', margin: '0 auto' }}>
                <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#020308] to-transparent z-10 pointer-events-none" />
                <World data={GLOBE_ARCS} globeConfig={GLOBE_CONFIG} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ WORLD MAP (DARK) ═══════════════════ */}
      <section className="section-sm overflow-hidden" style={{ background: '#020308', color: 'white' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h3 className="text-2xl sm:text-3xl font-black mb-3 tracking-tight text-white font-heading">Live Connection Routes</h3>
            <p className="text-slate-500 text-sm font-body">Every arc is a Pakistani traveler staying connected abroad</p>
          </div>
          <div className="rounded-3xl overflow-hidden border border-white/[0.06] bg-[#050a18]">
            <WorldMap dots={MAP_DOTS} lineColor="#0D6EFD" />
          </div>
        </div>
      </section>

      <div className="divider-fade" />

      {/* ═══════════════════ WHY AXON (NEW) ═══════════════════ */}
      <WhyAxonSection />

      {/* ═══════════════════ SVG MASK REVEAL ═══════════════════ */}
      <section className="section-sm" style={{ background: '#FFFFFF' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-black mb-2 tracking-tight text-[#212529] font-heading">
              The Axon <span className="gradient-text">Difference</span>
            </h2>
            <p className="text-xs text-[#ADB5BD] uppercase tracking-widest font-semibold font-display">Hover to reveal</p>
          </div>
          <MaskContainer
            revealText={
              <p className="mx-auto max-w-3xl text-center text-xl sm:text-2xl font-bold text-[#212529] leading-relaxed px-8 font-heading">
                Pakistan&apos;s only eSIM with JazzCash + Easypaisa payments, WhatsApp delivery in 2 minutes, and 24/7 human support. Global 4G/5G. Zero roaming shock.
              </p>
            }
            className="h-[24rem] sm:h-[28rem] rounded-3xl border border-[rgba(0,0,0,0.06)] overflow-hidden"
          >
            <span className="text-white text-opacity-90 text-xl sm:text-2xl font-bold text-center block leading-relaxed px-8 font-heading tracking-wide">
              Instant delivery &middot; 150+ Countries &middot; Secure Payments &middot; 24/7 Support &middot; No Hidden Fees &middot; JazzCash &middot; Easypaisa &middot; 5G Ready
            </span>
          </MaskContainer>
        </div>
      </section>

      <div className="divider-fade" />

      {/* ═══════════════════ REVIEWS ═══════════════════ */}
      <section className="section overflow-hidden" style={{ background: '#F8F9FA' }}>
        <div className="max-w-6xl mx-auto mb-14 text-center">
          <div className="badge-pill badge-amber inline-flex mb-5">
            <Star className="w-3.5 h-3.5 fill-current" /> Trusted
          </div>
          <h2 className="display-md mb-5 text-[#212529]">
            Loved by <span className="gradient-text">Pakistani</span> Travelers
          </h2>
          <div className="flex items-center justify-center gap-2">
            <Stars size="md" />
            <span className="text-sm text-[#6C757D] ml-1 font-body">4.9 / 5 from 500+ reviews</span>
          </div>
        </div>

        <Marquee className="mb-6" pauseOnHover>
          {REVIEW_IMAGES.slice(0, 16).map((src) => (
            <img key={src} src={src} alt="Client Review" className="w-[350px] object-contain rounded-[20px] mx-2 border border-[rgba(0,0,0,0.06)] shadow-sm hover:scale-[1.02] transition-transform duration-300" />
          ))}
        </Marquee>
        <Marquee reverse pauseOnHover>
          {REVIEW_IMAGES.slice(16).map((src) => (
            <img key={src} src={src} alt="Client Review" className="w-[350px] object-contain rounded-[20px] mx-2 border border-[rgba(0,0,0,0.06)] shadow-sm hover:scale-[1.02] transition-transform duration-300" />
          ))}
        </Marquee>
      </section>

      <div className="divider-fade" />

      {/* ═══════════════════ DEVICE COMPATIBILITY ═══════════════════ */}
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
              All modern flagship phones support eSIM. Here&apos;s the full list.
            </p>
          </div>

          {/* Apple */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-2xl bg-[#212529] border border-[rgba(0,0,0,0.06)] flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
              </div>
              <h3 className="font-black text-lg text-[#212529] font-heading">Apple iPhone</h3>
              <span className="badge-pill text-[11px]">{IPHONES.length} models</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
              {IPHONES.map((m) => (
                <div key={m} className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-[#F8F9FA] border border-[rgba(0,0,0,0.04)] hover:border-[rgba(13,110,253,0.18)] hover:bg-[rgba(13,110,253,0.03)] transition-all duration-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981] flex-shrink-0" />
                  <span className="text-xs text-[#212529] font-medium font-body">{m}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Samsung */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-2xl bg-[#0D6EFD] border border-[rgba(13,110,253,0.20)] flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-black text-lg text-[#212529] font-heading">Samsung Galaxy</h3>
              <span className="badge-pill badge-cyan text-[11px]">{SAMSUNGS.length} models</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
              {SAMSUNGS.map((m) => (
                <div key={m} className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-[#F8F9FA] border border-[rgba(0,0,0,0.04)] hover:border-[rgba(0,198,255,0.18)] hover:bg-[rgba(0,198,255,0.03)] transition-all duration-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#00A3D9] flex-shrink-0" />
                  <span className="text-xs text-[#212529] font-medium font-body">{m}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Others */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {OTHERS.map(({ brand, models }) => (
              <div key={brand} className="rounded-2xl border border-[rgba(0,0,0,0.06)] bg-white p-6 hover:border-[rgba(13,110,253,0.15)] hover:shadow-md transition-all duration-300">
                <div className="flex items-center gap-2.5 mb-4">
                  <Smartphone className="w-4 h-4 text-[#0D6EFD]" />
                  <h4 className="font-bold text-[#212529] font-heading">{brand}</h4>
                  <span className="text-[11px] text-[#ADB5BD] font-medium font-body">{models.length} models</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {models.map((m) => (
                    <span key={m} className="flex items-center gap-1.5 text-xs bg-[#F8F9FA] border border-[rgba(0,0,0,0.04)] text-[#6C757D] px-2.5 py-1.5 rounded-lg hover:border-[rgba(13,110,253,0.12)] transition-colors font-body">
                      <CheckCircle2 className="w-3 h-3 text-[#0D6EFD]/60" /> {m}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Warning */}
          <div className="mt-10 flex flex-col sm:flex-row gap-3 items-center justify-center">
            <div className="inline-flex items-center gap-2.5 text-sm text-[#6C757D] bg-[rgba(245,158,11,0.05)] border border-[rgba(245,158,11,0.15)] rounded-full px-5 py-2.5 font-body">
              <span className="text-[#D97706] font-bold text-xs">!</span>
              Phone must be <strong className="text-[#D97706] mx-0.5">unlocked</strong> &amp; <strong className="text-[#D97706] mx-0.5">eSIM-capable</strong>
            </div>
            <div className="inline-flex items-center gap-2.5 text-sm text-[#6C757D] bg-[#F8F9FA] border border-[rgba(0,0,0,0.06)] rounded-full px-5 py-2.5 font-body">
              <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
              Dual SIM phones keep physical SIM active
            </div>
          </div>
        </div>
      </section>

      <div className="divider-fade" />

      {/* ═══════════════════ FAQ ═══════════════════ */}
      <section className="section" style={{ background: '#F8F9FA' }}>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <div className="badge-pill badge-green inline-flex mb-5">
              <MessageCircle className="w-3.5 h-3.5" /> FAQ
            </div>
            <h2 className="display-md mb-5 text-[#212529]">Got Questions?</h2>
            <p className="text-[#6C757D] text-lg font-body">Everything you need to know about Axon eSIM.</p>
          </div>
          <div className="space-y-2.5">
            {FAQS.map((faq) => <FaqItem key={faq.q} {...faq} />)}
          </div>
          <div className="text-center mt-12">
            <a
              href="https://wa.me/923349542871"
              className="inline-flex items-center gap-2.5 text-sm font-semibold text-[#10B981] hover:text-[#059669] transition-colors group font-heading"
            >
              <MessageCircle className="w-4 h-4" />
              Still have questions? Chat on WhatsApp
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </section>

      <div className="divider-fade" />

      {/* ═══════════════════ FINAL CTA ═══════════════════ */}
      <section className="section relative" style={{ background: '#FFFFFF' }}>
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-[28px] overflow-hidden">
            {/* Layers */}
            <div className="absolute inset-0" style={{ background: 'linear-gradient(145deg, #051B3D 0%, #0B1120 45%, #040D1E 100%)' }} />
            <div className="absolute inset-0 dot-bg opacity-20" style={{ backgroundImage: 'radial-gradient(rgba(13,110,253,0.12) 1px, transparent 1px)' }} />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] blur-[130px] opacity-25 pointer-events-none" style={{ background: 'radial-gradient(circle, #0D6EFD, transparent 70%)' }} />
            <div className="absolute inset-0 rounded-[28px] border border-[rgba(13,110,253,0.15)] pointer-events-none" />
            <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-[rgba(13,110,253,0.40)] to-transparent" />

            <div className="relative z-10 p-10 sm:p-14 lg:p-20 text-center">
              <div className="inline-flex items-center gap-2 bg-[rgba(13,110,253,0.10)] border border-[rgba(13,110,253,0.20)] rounded-full px-4 py-1.5 mb-8">
                <Plane className="w-3.5 h-3.5 text-[#3D8BFD]" />
                <span className="text-sm text-[#93C5FD] font-semibold font-heading">Ready for takeoff?</span>
              </div>

              <h2 className="display-md mb-6 text-white">
                Get Your eSIM{' '}
                <br className="hidden sm:block" />
                <span className="gradient-text">Before You Fly</span>
              </h2>

              <p className="text-slate-400 mb-12 max-w-xl mx-auto text-lg leading-relaxed font-body">
                Pick a plan. Pay with JazzCash or Easypaisa. Get your QR code on WhatsApp in under 2 minutes. It&apos;s that simple.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/plans">
                  <MovingBorderBtn
                    containerClassName="h-14 w-60"
                    borderClassName="bg-[radial-gradient(#0D6EFD_40%,transparent_60%)]"
                    className="bg-slate-950/90 border-[rgba(13,110,253,0.20)] text-white font-bold text-base flex items-center gap-2.5 font-heading"
                    duration={2000}
                  >
                    Browse All Plans <ArrowRight className="w-4 h-4" />
                  </MovingBorderBtn>
                </Link>
                <a
                  href="https://wa.me/923349542871"
                  className="flex items-center justify-center gap-2.5 px-8 py-4 rounded-full text-base font-semibold text-slate-300 bg-white/[0.05] border border-white/[0.08] hover:bg-white/[0.09] hover:border-white/[0.14] transition-all duration-300 font-heading"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" /> Chat on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
