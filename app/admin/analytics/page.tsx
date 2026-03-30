import { createServiceClient } from '@/lib/supabase'

export const revalidate = 60

async function getAnalytics() {
  const supabase = createServiceClient()

  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const [
    { data: orders },
    { data: planRevenue },
  ] = await Promise.all([
    supabase.from('orders').select('id, status, amount_paid, currency, created_at, payment_method')
      .gte('created_at', thirtyDaysAgo.toISOString())
      .order('created_at', { ascending: true }),
    supabase.from('orders').select('plans(name, region), amount_paid, currency')
      .in('status', ['delivered', 'activated']),
  ])

  const ordersArr = (orders ?? []) as any[]

  // Daily revenue (last 30 days)
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

  return { dailyMap, methodMap, statusMap, totalPKR, totalUSD, totalOrders: ordersArr.length }
}

const METHOD_COLORS: Record<string, string> = {
  jazzcash: 'bg-red-400',
  easypaisa: 'bg-green-400',
  stripe: 'bg-blue-400',
  manual: 'bg-yellow-400',
}

export default async function AnalyticsPage() {
  const { dailyMap, methodMap, statusMap, totalPKR, totalUSD, totalOrders } = await getAnalytics()

  const maxDailyRevenue = Math.max(...Object.values(dailyMap), 1)
  const sortedDays = Object.entries(dailyMap).slice(-14) // last 14 days

  const totalMethodOrders = Object.values(methodMap).reduce((s, v) => s + v, 0)

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black mb-1">Analytics</h1>
        <p className="text-gray-500 text-sm">Last 30 days</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">
        {/* Daily Revenue Chart */}
        <div className="bg-[#111] border border-white/5 rounded-2xl p-5">
          <h2 className="font-semibold text-sm mb-4">Daily Revenue (PKR, last 14 days)</h2>
          {sortedDays.length === 0 ? (
            <div className="text-gray-500 text-sm text-center py-8">No data yet</div>
          ) : (
            <div className="flex items-end gap-1.5 h-32">
              {sortedDays.map(([day, value]) => (
                <div key={day} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full bg-cyan-400/20 hover:bg-cyan-400/40 rounded-t transition-all"
                    style={{ height: `${(value / maxDailyRevenue) * 100}%`, minHeight: '4px' }}
                    title={`Rs ${value.toLocaleString()}`}
                  />
                  <span className="text-xs text-gray-600" style={{ fontSize: '9px' }}>
                    {day.slice(8)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Payment Methods */}
        <div className="bg-[#111] border border-white/5 rounded-2xl p-5">
          <h2 className="font-semibold text-sm mb-4">Payment Methods</h2>
          <div className="space-y-3">
            {Object.entries(methodMap).map(([method, count]) => (
              <div key={method}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="capitalize text-gray-400">{method}</span>
                  <span className="font-semibold">{count}</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${METHOD_COLORS[method] || 'bg-gray-400'}`}
                    style={{ width: `${(count / totalMethodOrders) * 100}%` }}
                  />
                </div>
              </div>
            ))}
            {Object.keys(methodMap).length === 0 && (
              <div className="text-gray-500 text-sm text-center py-4">No data yet</div>
            )}
          </div>
        </div>
      </div>

      {/* Order Status Breakdown */}
      <div className="bg-[#111] border border-white/5 rounded-2xl p-5">
        <h2 className="font-semibold text-sm mb-4">Order Status Breakdown</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {Object.entries(statusMap).map(([status, count]) => (
            <div key={status} className="bg-black rounded-xl p-4 text-center">
              <div className="text-2xl font-black mb-1">{count}</div>
              <div className="text-xs text-gray-500 capitalize">{status}</div>
            </div>
          ))}
          {Object.keys(statusMap).length === 0 && (
            <div className="col-span-4 text-gray-500 text-sm text-center py-4">No data yet</div>
          )}
        </div>
      </div>
    </div>
  )
}
