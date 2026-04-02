import { createServiceClient } from '@/lib/supabase'
import { ShoppingCart, TrendingUp, Users, Package, BarChart2 } from 'lucide-react'
import Link from 'next/link'
import DashboardMiniChart from '@/components/admin/DashboardMiniChart'

export const revalidate = 30

async function getStats() {
  const supabase = createServiceClient()
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  const [
    { count: totalOrders },
    { count: todayOrders },
    { data: revenueData },
    { count: totalCustomers },
    { data: recentOrders },
    { data: trendOrders },
  ] = await Promise.all([
    supabase.from('orders').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('*', { count: 'exact', head: true }).gte('created_at', today.toISOString()),
    supabase.from('orders').select('amount_paid, currency').in('status', ['delivered', 'activated']),
    supabase.from('customers').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('*, customers(name,email), plans(name)').order('created_at', { ascending: false }).limit(8),
    supabase.from('orders').select('amount_paid, currency, created_at, status')
      .gte('created_at', sevenDaysAgo.toISOString())
      .in('status', ['delivered', 'activated', 'paid'])
      .order('created_at', { ascending: true }),
  ])

  const revenueArr = (revenueData || []) as any[]
  const pkrRevenue = revenueArr.filter(o => o.currency === 'PKR').reduce((s: number, o: any) => s + o.amount_paid, 0)
  const usdRevenue = revenueArr.filter(o => o.currency === 'USD').reduce((s: number, o: any) => s + o.amount_paid, 0)

  const trendMap: Record<string, { pkr: number; usd: number }> = {}
  ;(trendOrders || []).forEach((o: any) => {
    const day = (o.created_at as string).slice(5, 10)
    if (!trendMap[day]) trendMap[day] = { pkr: 0, usd: 0 }
    if (o.currency === 'PKR') trendMap[day].pkr += o.amount_paid
    else trendMap[day].usd += o.amount_paid
  })
  const trendData = Object.entries(trendMap).map(([day, v]) => ({
    day, pkr: Math.round(v.pkr), usd: parseFloat(v.usd.toFixed(2)),
  }))

  return { totalOrders, todayOrders, pkrRevenue, usdRevenue, totalCustomers, recentOrders, trendData }
}

const STATUS_COLORS: Record<string, string> = {
  pending:    'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  paid:       'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
  processing: 'bg-sky-50 text-sky-700 ring-1 ring-sky-200',
  delivered:  'bg-green-50 text-green-700 ring-1 ring-green-200',
  activated:  'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  expired:    'bg-slate-100 text-slate-500 ring-1 ring-slate-200',
  cancelled:  'bg-red-50 text-red-600 ring-1 ring-red-200',
}

export default async function DashboardPage() {
  const { totalOrders, todayOrders, pkrRevenue, usdRevenue, totalCustomers, recentOrders, trendData } = await getStats()

  const stats = [
    { label: 'Total Orders',    value: totalOrders ?? 0,                    icon: ShoppingCart, color: 'text-violet-600', bg: 'bg-violet-50',  border: 'border-violet-100' },
    { label: "Today's Orders",  value: todayOrders ?? 0,                    icon: TrendingUp,   color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
    { label: 'Total Customers', value: totalCustomers ?? 0,                 icon: Users,        color: 'text-blue-600',   bg: 'bg-blue-50',    border: 'border-blue-100' },
    { label: 'PKR Revenue',     value: `Rs ${pkrRevenue.toLocaleString()}`, icon: Package,      color: 'text-amber-600',  bg: 'bg-amber-50',   border: 'border-amber-100' },
  ]

  return (
    <div>
      <div className="mb-7">
        <h1 className="text-2xl font-extrabold text-slate-800 mb-0.5">Dashboard</h1>
        <p className="text-slate-400 text-sm">Welcome back, Admin</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map(({ label, value, icon: Icon, color, bg, border }) => (
          <div key={label} className={`bg-white rounded-2xl p-5 border ${border} shadow-sm`}>
            <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center mb-3`}>
              <Icon className={`w-4 h-4 ${color}`} />
            </div>
            <div className="text-xl font-extrabold text-slate-800 mb-0.5">{value}</div>
            <div className="text-xs text-slate-400 font-medium">{label}</div>
          </div>
        ))}
      </div>

      {/* Revenue trend chart */}
      <div className="bg-white border border-slate-100 rounded-2xl p-5 mb-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="font-bold text-sm text-slate-700">Revenue Trend — Last 7 Days</h2>
            <p className="text-xs text-slate-400 mt-0.5">PKR &amp; USD</p>
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-violet-400 inline-block rounded" /> PKR</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-emerald-400 inline-block rounded" /> USD</span>
            <Link href="/admin/analytics" className="text-violet-600 hover:text-violet-700 flex items-center gap-1 font-medium">
              <BarChart2 className="w-3 h-3" /> Full Analytics →
            </Link>
          </div>
        </div>
        <DashboardMiniChart data={trendData} />
      </div>

      {/* USD banner */}
      {usdRevenue > 0 && (
        <div className="bg-white border border-emerald-100 rounded-2xl p-5 mb-5 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 mb-1 font-medium">Total USD Revenue</div>
            <div className="text-xl font-extrabold text-emerald-600">${usdRevenue.toFixed(2)}</div>
          </div>
        </div>
      )}

      {/* Recent Orders */}
      <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h2 className="font-bold text-slate-700">Recent Orders</h2>
          <Link href="/admin/orders" className="text-sm text-violet-600 hover:text-violet-700 font-medium">View all →</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-xs text-slate-400 border-b border-slate-100 bg-slate-50/50">
                <th className="text-left px-5 py-3 font-semibold">Order ID</th>
                <th className="text-left px-5 py-3 font-semibold">Customer</th>
                <th className="text-left px-5 py-3 font-semibold hidden sm:table-cell">Plan</th>
                <th className="text-left px-5 py-3 font-semibold">Status</th>
                <th className="text-left px-5 py-3 font-semibold hidden md:table-cell">Date</th>
              </tr>
            </thead>
            <tbody>
              {(recentOrders ?? []).map((order: any) => (
                <tr key={order.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3">
                    <Link href={`/admin/orders/${order.id}`} className="text-violet-600 hover:text-violet-700 font-mono text-xs font-semibold">
                      {order.id}
                    </Link>
                  </td>
                  <td className="px-5 py-3">
                    <div className="text-sm font-medium text-slate-700">{order.customers?.name}</div>
                    <div className="text-xs text-slate-400">{order.customers?.email}</div>
                  </td>
                  <td className="px-5 py-3 text-sm text-slate-500 hidden sm:table-cell">{order.plans?.name}</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${STATUS_COLORS[order.status] ?? 'bg-slate-100 text-slate-500'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-xs text-slate-400 hidden md:table-cell">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {(!recentOrders || recentOrders.length === 0) && (
            <div className="text-center py-10 text-slate-400 text-sm">No orders yet</div>
          )}
        </div>
      </div>
    </div>
  )
}
