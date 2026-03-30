'use client'
import { useState } from 'react'
import Link from 'next/link'
import { ChevronRight, Globe, Search, Clock, CheckCircle2, Zap, Shield, Wifi } from 'lucide-react'
import type { Plan } from '@/types/database'
import { TiltCard } from '@/components/ui/tilt-card'

const REGIONS = ['All', 'Asia', 'Europe', 'Middle East', 'North America', 'Global']

const REGION_META: Record<string, { flag: string }> = {
  All:            { flag: '🌐' },
  Asia:           { flag: '🌏' },
  Europe:         { flag: '🌍' },
  'Middle East':  { flag: '🕌' },
  'North America':{ flag: '🌎' },
  Global:         { flag: '🛰️' },
}

export default function PlansClient({ plans }: { plans: Plan[] }) {
  const [region, setRegion] = useState('All')
  const [currency, setCurrency] = useState<'PKR' | 'USD'>('PKR')
  const [search, setSearch] = useState('')

  const filtered = plans.filter(p => {
    const matchRegion = region === 'All' || p.region === region
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase())
    return matchRegion && matchSearch
  })

  return (
    <div className="min-h-screen" style={{ background: '#F8F9FA' }}>

      {/* ── Page header ── */}
      <section className="relative px-5 pt-28 pb-14 overflow-hidden" style={{ background: '#FFFFFF', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(rgba(13,110,253,0.06) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full opacity-[0.06] blur-[120px] pointer-events-none" style={{ background: 'radial-gradient(circle, #0D6EFD, transparent 70%)' }} />

        <div className="max-w-6xl mx-auto relative z-10 text-center">
          <div className="badge-pill inline-flex mb-5">
            <Globe className="w-3.5 h-3.5" /> 150+ Countries
          </div>
          <h1 className="display-md mb-4 text-[#212529]">
            eSIM Data <span className="gradient-text">Plans</span>
          </h1>
          <p className="text-[#6C757D] text-lg max-w-xl mx-auto font-body">
            Instant activation. No roaming fees. Pay with JazzCash, Easypaisa, or card.
          </p>
        </div>
      </section>

      {/* ── Sticky filter bar ── */}
      <div className="sticky top-[64px] z-40 bg-white/90 backdrop-blur-xl border-b border-[rgba(0,0,0,0.06)]">
        <div className="max-w-6xl mx-auto px-5 py-3">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">

            {/* Search */}
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#ADB5BD]" />
              <input
                type="text"
                placeholder="Search plans…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="input pl-9 py-2.5 text-sm"
              />
            </div>

            {/* Region pills + currency toggle */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <div className="flex items-center gap-1.5 flex-wrap">
                {REGIONS.map(r => (
                  <button
                    key={r}
                    onClick={() => setRegion(r)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                      region === r
                        ? 'bg-[#0D6EFD] text-white shadow-lg shadow-blue-600/20'
                        : 'bg-[#F8F9FA] border border-[rgba(0,0,0,0.08)] text-[#6C757D] hover:text-[#212529] hover:bg-[rgba(13,110,253,0.06)] hover:border-[rgba(13,110,253,0.20)]'
                    }`}
                  >
                    <span>{REGION_META[r]?.flag}</span>
                    <span>{r}</span>
                  </button>
                ))}
              </div>

              {/* Currency toggle */}
              <div className="flex items-center bg-[#F8F9FA] border border-[rgba(0,0,0,0.08)] rounded-full p-1 gap-1">
                {(['PKR', 'USD'] as const).map(c => (
                  <button
                    key={c}
                    onClick={() => setCurrency(c)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                      currency === c
                        ? 'bg-[#0D6EFD] text-white shadow-sm'
                        : 'text-[#6C757D] hover:text-[#212529]'
                    }`}
                  >
                    {c === 'PKR' ? '🇵🇰 PKR' : '🌍 USD'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Plans grid ── */}
      <section className="px-5 py-10">
        <div className="max-w-6xl mx-auto">
          {filtered.length === 0 ? (
            <div className="text-center py-28">
              <Globe className="w-10 h-10 text-[#ADB5BD] mx-auto mb-4" />
              <p className="text-[#6C757D] text-lg font-medium font-heading">No plans found</p>
              <p className="text-[#ADB5BD] text-sm mt-1 font-body">Try a different region or search term</p>
            </div>
          ) : (
            <>
              <p className="text-xs text-[#ADB5BD] mb-6 font-semibold uppercase tracking-widest font-display">
                {filtered.length} plan{filtered.length !== 1 ? 's' : ''} available
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filtered.map(plan => (
                  <TiltCard key={plan.id} intensity={5}>
                    <PlanCard plan={plan} currency={currency} />
                  </TiltCard>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  )
}

function PlanCard({ plan, currency }: { plan: Plan; currency: 'PKR' | 'USD' }) {
  const isFeatured = !!plan.badge

  return (
    <div className={`relative h-full flex flex-col rounded-2xl overflow-hidden transition-all duration-300 ${
      isFeatured
        ? 'bg-gradient-to-br from-[#0D6EFD] to-[#0041A8] shadow-2xl shadow-blue-600/25 border border-blue-400/20'
        : 'bg-white border border-[rgba(0,0,0,0.06)] hover:border-[rgba(13,110,253,0.20)] hover:shadow-xl hover:shadow-blue-600/08'
    }`}>

      {/* Featured shimmer top bar */}
      {isFeatured && (
        <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-white/40 to-transparent" />
      )}

      <div className="p-6 flex flex-col h-full">
        {/* Badge */}
        {plan.badge && (
          <div className="mb-4">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-full tracking-wide uppercase bg-white/15 text-white border border-white/20 font-heading">
              {plan.badge}
            </span>
          </div>
        )}

        {/* Region + name */}
        <div className="mb-4">
          <div className="flex items-center gap-1.5 mb-1.5">
            <Globe className={`w-3 h-3 ${isFeatured ? 'text-blue-200' : 'text-[#0D6EFD]'}`} />
            <span className={`text-xs font-bold uppercase tracking-widest font-display ${isFeatured ? 'text-blue-200' : 'text-[#0D6EFD]'}`}>
              {plan.region}
            </span>
          </div>
          <h3 className={`text-lg font-black leading-tight font-heading ${isFeatured ? 'text-white' : 'text-[#212529]'}`}>
            {plan.name}
          </h3>
          {plan.countries && plan.countries.length > 0 && (
            <p className={`text-xs mt-1 line-clamp-1 font-body ${isFeatured ? 'text-blue-200' : 'text-[#ADB5BD]'}`}>
              {plan.countries.slice(0, 4).join(', ')}{plan.countries.length > 4 ? ` +${plan.countries.length - 4}` : ''}
            </p>
          )}
        </div>

        {/* Data amount */}
        <div className="flex items-baseline gap-1.5 mb-0.5">
          <span className={`text-5xl font-black leading-none price-tag ${isFeatured ? 'text-white' : 'text-[#212529]'}`}>
            {plan.data_gb}
          </span>
          <span className={`font-bold mb-1 ${isFeatured ? 'text-blue-200' : 'text-[#ADB5BD]'}`}>GB</span>
        </div>
        <div className={`flex items-center gap-1.5 text-xs mb-5 font-body ${isFeatured ? 'text-blue-200' : 'text-[#ADB5BD]'}`}>
          <Clock className="w-3 h-3" /> {plan.validity_days} days validity
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

        {/* Mini features */}
        <div className="flex flex-wrap gap-1.5 mb-5 flex-1">
          {['Instant delivery', 'Hotspot OK', '4G/5G'].map(f => (
            <span key={f} className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg font-body ${
              isFeatured
                ? 'bg-white/10 border border-white/15 text-blue-100'
                : 'bg-[#F8F9FA] border border-[rgba(0,0,0,0.05)] text-[#6C757D]'
            }`}>
              <CheckCircle2 className={`w-2.5 h-2.5 ${isFeatured ? 'text-blue-200' : 'text-[#10B981]'}`} />
              {f}
            </span>
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
