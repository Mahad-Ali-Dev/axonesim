import Link from 'next/link'
import { Wifi, MessageCircle, Mail, MapPin, Globe, Shield, ArrowUpRight } from 'lucide-react'

const PLAN_LINKS = ['Asia', 'Europe', 'Middle East', 'Americas', 'Global']
const SUPPORT_LINKS = [
  { label: 'Activation Guide', href: '/activate' },
  { label: 'All Plans',        href: '/plans' },
  { label: 'Track Order',      href: '/order' },
  { label: 'WhatsApp Support', href: 'https://wa.me/923349542871', external: true },
]
const LEGAL_LINKS = [
  { label: 'Privacy', href: '/privacy-policy' },
  { label: 'Terms',   href: '/privacy-policy' },
  { label: 'Refunds', href: '/refund-policy' },
]

export default function Footer() {
  return (
    <footer style={{ background: '#010206' }} className="border-t border-white/[0.04]">

      {/* Main grid */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Brand column */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-6 group">
              <div className="w-8 h-8 rounded-[10px] bg-gradient-to-br from-violet-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-violet-600/20 group-hover:shadow-violet-600/40 transition-all duration-300">
                <Wifi className="w-4 h-4 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-base font-black">
                <span className="gradient-text">Axon</span>
                <span className="text-white"> eSIM</span>
              </span>
            </Link>

            <p className="text-sm text-slate-600 leading-relaxed mb-8 max-w-xs">
              Instant eSIM data plans for Pakistani travelers. 150+ countries. Pay with JazzCash or Easypaisa.
            </p>

            <div className="space-y-2.5">
              <a
                href="https://wa.me/923349542871"
                className="flex items-center gap-3 text-sm text-slate-600 hover:text-emerald-400 transition-colors group"
              >
                <div className="w-8 h-8 rounded-xl bg-emerald-500/6 border border-emerald-500/12 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-500/12 group-hover:border-emerald-500/25 transition-all">
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                +92 334 9542871
              </a>
              <a
                href="mailto:support@axonesim.com"
                className="flex items-center gap-3 text-sm text-slate-600 hover:text-violet-400 transition-colors group"
              >
                <div className="w-8 h-8 rounded-xl bg-violet-500/6 border border-violet-500/12 flex items-center justify-center flex-shrink-0 group-hover:bg-violet-500/12 group-hover:border-violet-500/25 transition-all">
                  <Mail className="w-3.5 h-3.5 text-violet-400" />
                </div>
                support@axonesim.com
              </a>
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/6 border border-cyan-500/12 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                </div>
                Pakistan
              </div>
            </div>
          </div>

          {/* Plans */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 mb-6 flex items-center gap-2 uppercase tracking-widest">
              <Globe className="w-3.5 h-3.5 text-violet-500" />
              eSIM Plans
            </h4>
            <ul className="space-y-3">
              {PLAN_LINKS.map(r => (
                <li key={r}>
                  <Link
                    href={`/plans?region=${r}`}
                    className="text-sm text-slate-600 hover:text-violet-400 transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-slate-800 group-hover:bg-violet-400 transition-colors" />
                    {r}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 mb-6 uppercase tracking-widest">Support</h4>
            <ul className="space-y-3">
              {SUPPORT_LINKS.map(({ label, href, external }) => (
                <li key={label}>
                  <Link
                    href={href}
                    target={external ? '_blank' : undefined}
                    rel={external ? 'noopener noreferrer' : undefined}
                    className="text-sm text-slate-600 hover:text-violet-400 transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-slate-800 group-hover:bg-violet-400 transition-colors" />
                    {label}
                    {external && <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-60 transition-opacity" />}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Payments */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 mb-6 uppercase tracking-widest">Payments</h4>
            <div className="grid grid-cols-2 gap-2 mb-5">
              {[
                { name:'JazzCash',   color:'text-red-400',     bg:'bg-red-500/5 border-red-500/12'     },
                { name:'Easypaisa',  color:'text-emerald-400', bg:'bg-emerald-500/5 border-emerald-500/12' },
                { name:'Visa',       color:'text-blue-400',    bg:'bg-blue-500/5 border-blue-500/12'   },
                { name:'Mastercard', color:'text-orange-400',  bg:'bg-orange-500/5 border-orange-500/12' },
              ].map(({ name, color, bg }) => (
                <div key={name} className={`flex items-center justify-center py-2.5 px-3 rounded-xl border text-xs font-semibold ${bg} ${color}`}>
                  {name}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-violet-500/[0.04] border border-violet-500/10">
              <Shield className="w-4 h-4 text-violet-500 flex-shrink-0" />
              <p className="text-xs text-slate-600 leading-relaxed">
                Secured by{' '}
                <span className="text-violet-400 font-semibold">Safepay</span>{' '}
                &amp;{' '}
                <span className="text-violet-400 font-semibold">Stripe</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/[0.03]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-700">
            &copy; {new Date().getFullYear()} Axon eSIM &middot; Tase LLC
          </p>
          <div className="flex items-center gap-5">
            {LEGAL_LINKS.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="text-xs text-slate-700 hover:text-slate-500 transition-colors"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
