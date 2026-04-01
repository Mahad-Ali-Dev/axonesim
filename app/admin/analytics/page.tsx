import { createServiceClient } from '@/lib/supabase'
import AnalyticsCharts from '@/components/admin/AnalyticsCharts'

export const revalidate = 60

async function getAnalytics() {
  const supabase = createServiceClient()

  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const [
    { data: orders },
  ] = await Promise.all([
    supabase.from('orders').select('id, status, amount_paid, currency, created_at, payment_method')
      .gte('created_at', thirtyDaysAgo.toISOString())
      .order('created_at', { ascending: true }),
  ])

  const ordersArr = (orders ?? []) as any[]

  // Daily revenue (last 14 days)
  const dailyMap: Record<string, number> = {}
  ordersArr.filter(o => ['delivered', 'activated', 'paid'].includes(o.status)).forEach(o => {
    const day = o.created_at.slice(0, 10)
    const pkr = o.currency === 'PKR' ? o.amount_paid : o.amount_paid * 280
    dailyMap[day] = (dailyMap[day] || 0) + pkr
  })

  // Payment method breakdown
  const methodMap: Record<string, number> = {}
  ordersArr.forEach(o => { methodMap[o.payment_method] = (methodMap[o.payment_method] || 0) + 1 })

  // Status breakdown
  const statusMap: Record<string, number> = {}
  ordersArr.forEach(o => { statusMap[o.status] = (statusMap[o.status] || 0) + 1 })

  const totalPKR = ordersArr
    .filter(o => ['delivered', 'activated'].includes(o.status) && o.currency === 'PKR')
    .reduce((s: number, o: any) => s + o.amount_paid, 0)

  const totalUSD = ordersArr
    .filter(o => ['delivered', 'activated'].includes(o.status) && o.currency === 'USD')
    .reduce((s: number, o: any) => s + o.amount_paid, 0)

  // Shape data for charts
  const allDays = Object.keys(dailyMap).sort()
  const dailyData = allDays.slice(-14).map(day => ({
    day: day.slice(5),       // "MM-DD"
    revenue: Math.round(dailyMap[day]),
  }))

  const methodData = Object.entries(methodMap).map(([name, value]) => ({ name, value }))

  const statusData = Object.entries(statusMap).map(([status, count]) => ({ status, count }))

  return { dailyData, methodData, statusData, totalPKR, totalUSD, totalOrders: ordersArr.length }
}

export default async function AnalyticsPage() {
  const { dailyData, methodData, statusData, totalPKR, totalUSD, totalOrders } = await getAnalytics()

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black mb-1">Analytics</h1>
        <p className="text-gray-500 text-sm">Last 30 days</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">
        <div className="bg-[#111] border border-white/5 rounded-2xl p-5">
          <div className="text-xs text-gray-500 mb-2">PKR Revenue (30d)</div>
          <div className="text-2xl font-black text-cyan-400">Rs {totalPKR.toLocaleString()}</div>
        </div>
        <div className="bg-[#111] border border-white/5 rounded-2xl p-5">
          <div className="text-xs text-gray-500 mb-2">USD Revenue (30d)</div>
          <div className="text-2xl font-black text-green-400">${totalUSD.toFixed(2)}</div>
        </div>
        <div className="bg-[#111] border border-white/5 rounded-2xl p-5">
          <div className="text-xs text-gray-500 mb-2">Total Orders (30d)</div>
          <div className="text-2xl font-black">{totalOrders}</div>
        </div>
      </div>

      {/* Interactive charts */}
      <AnalyticsCharts dailyData={dailyData} methodData={methodData} statusData={statusData} />
    </div>
  )
}
