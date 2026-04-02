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
    <div className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs shadow-lg">
      <p className="text-slate-400 mb-1 font-medium">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.stroke }} className="font-semibold">
          {p.name}: {p.name === 'PKR' ? `Rs ${p.value.toLocaleString()}` : `$${p.value.toFixed(2)}`}
        </p>
      ))}
    </div>
  )
}

export default function DashboardMiniChart({ data }: Props) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-slate-400 text-sm">
        No revenue data yet
      </div>
    )
  }
  return (
    <ResponsiveContainer width="100%" height={160}>
      <AreaChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="pkrGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#7c3aed" stopOpacity={0.15} />
            <stop offset="95%" stopColor="#7c3aed" stopOpacity={0}    />
          </linearGradient>
          <linearGradient id="usdGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#10b981" stopOpacity={0.15} />
            <stop offset="95%" stopColor="#10b981" stopOpacity={0}    />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
        <XAxis dataKey="day" tick={{ fill: '#94a3b8', fontSize: 10 }} tickLine={false} axisLine={false} />
        <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} tickLine={false} axisLine={false}
          tickFormatter={(v) => v >= 1000 ? `${(v/1000).toFixed(0)}k` : v} />
        <Tooltip content={<CustomTooltip />} />
        <Area type="monotone" dataKey="pkr" name="PKR" stroke="#7c3aed" strokeWidth={2}
          fill="url(#pkrGrad)" dot={false} activeDot={{ r: 4, fill: '#7c3aed' }} />
        <Area type="monotone" dataKey="usd" name="USD" stroke="#10b981" strokeWidth={2}
          fill="url(#usdGrad)" dot={false} activeDot={{ r: 4, fill: '#10b981' }} />
      </AreaChart>
    </ResponsiveContainer>
  )
}
