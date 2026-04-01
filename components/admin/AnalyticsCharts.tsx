'use client'

import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'

interface Props {
  dailyData: { day: string; revenue: number }[]
  methodData: { name: string; value: number }[]
  statusData: { status: string; count: number }[]
}

const PIE_COLORS = ['#f87171', '#34d399', '#60a5fa', '#fbbf24', '#a78bfa']

const STATUS_COLORS: Record<string, string> = {
  pending:   '#fbbf24',
  paid:      '#60a5fa',
  delivered: '#34d399',
  activated: '#a78bfa',
  cancelled: '#f87171',
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[#1a1a1a] border border-white/10 rounded-xl px-3 py-2 text-xs shadow-xl">
      {label && <p className="text-gray-400 mb-1">{label}</p>}
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color || p.fill }}>
          {p.name}: <span className="font-bold">{typeof p.value === 'number' && p.name?.toLowerCase().includes('rev') ? `Rs ${p.value.toLocaleString()}` : p.value}</span>
        </p>
      ))}
    </div>
  )
}

export default function AnalyticsCharts({ dailyData, methodData, statusData }: Props) {
  return (
    <div className="space-y-5">
      {/* Revenue area chart */}
      <div className="bg-[#111] border border-white/5 rounded-2xl p-5">
        <h2 className="font-semibold text-sm text-gray-300 mb-5">Daily Revenue — PKR (last 14 days)</h2>
        {dailyData.length === 0 ? (
          <div className="flex items-center justify-center h-40 text-gray-600 text-sm">No revenue data yet</div>
        ) : (
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={dailyData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#22d3ee" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}    />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="day" tick={{ fill: '#6b7280', fontSize: 10 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} tickLine={false} axisLine={false}
                tickFormatter={(v) => v >= 1000 ? `${(v/1000).toFixed(0)}k` : v} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#22d3ee" strokeWidth={2}
                fill="url(#revenueGrad)" dot={false} activeDot={{ r: 4, fill: '#22d3ee' }} />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Payment methods pie */}
        <div className="bg-[#111] border border-white/5 rounded-2xl p-5">
          <h2 className="font-semibold text-sm text-gray-300 mb-5">Payment Methods</h2>
          {methodData.length === 0 ? (
            <div className="flex items-center justify-center h-40 text-gray-600 text-sm">No data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={methodData} dataKey="value" nameKey="name" cx="50%" cy="50%"
                  innerRadius={55} outerRadius={80} paddingAngle={3} strokeWidth={0}>
                  {methodData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend formatter={(v) => <span style={{ color: '#9ca3af', fontSize: 12, textTransform: 'capitalize' }}>{v}</span>} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Order status bar */}
        <div className="bg-[#111] border border-white/5 rounded-2xl p-5">
          <h2 className="font-semibold text-sm text-gray-300 mb-5">Order Status Breakdown</h2>
          {statusData.length === 0 ? (
            <div className="flex items-center justify-center h-40 text-gray-600 text-sm">No data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={statusData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }} barSize={32}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis dataKey="status" tick={{ fill: '#6b7280', fontSize: 11 }} tickLine={false} axisLine={false}
                  tickFormatter={(v) => v.charAt(0).toUpperCase() + v.slice(1)} />
                <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                <Bar dataKey="count" name="Orders" radius={[6, 6, 0, 0]}>
                  {statusData.map((entry, i) => (
                    <Cell key={i} fill={STATUS_COLORS[entry.status] || '#6b7280'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  )
}
