'use client'

import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts'

interface Props {
  data: { day: string; pkr: number; usd: number }[]
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[#1a1a1a] border border-white/10 rounded-xl px-3 py-2 text-xs shadow-xl">
      <p className="text-gray-400 mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.stroke }}>
          {p.name}: <span className="font-bold">{p.name === 'PKR' ? `Rs ${p.value.toLocaleString()}` : `$${p.value.toFixed(2)}`}</span>
        </p>
      ))}
    </div>
  )
}

export default function DashboardMiniChart({ data }: Props) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-gray-600 text-sm">
        No revenue data yet
      </div>
    )
  }
  return (
    <ResponsiveContainer width="100%" height={160}>
      <AreaChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="pkrGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#22d3ee" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}   />
          </linearGradient>
          <linearGradient id="usdGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#34d399" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#34d399" stopOpacity={0}   />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
        <XAxis dataKey="day" tick={{ fill: '#6b7280', fontSize: 10 }} tickLine={false} axisLine={false} />
        <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} tickLine={false} axisLine={false}
          tickFormatter={(v) => v >= 1000 ? `${(v/1000).toFixed(0)}k` : v} />
        <Tooltip content={<CustomTooltip />} />
        <Area type="monotone" dataKey="pkr" name="PKR" stroke="#22d3ee" strokeWidth={2}
          fill="url(#pkrGrad)" dot={false} activeDot={{ r: 4 }} />
        <Area type="monotone" dataKey="usd" name="USD" stroke="#34d399" strokeWidth={2}
          fill="url(#usdGrad)" dot={false} activeDot={{ r: 4 }} />
      </AreaChart>
    </ResponsiveContainer>
  )
}
