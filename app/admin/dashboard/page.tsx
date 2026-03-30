import { createServiceClient } from '@/lib/supabase'
import { ShoppingCart, TrendingUp, Users, Wifi, Package } from 'lucide-react'
import Link from 'next/link'

export const revalidate = 30

async function getStats() {
  const supabase = createServiceClient()
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [
    { count: totalOrders },
    { count: todayOrders },
    { data: revenueData },
    { count: totalCustomers },
    { data: recentOrders },
  ] = await Promise.all([
    supabase.from('orders').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('*', { count: 'exact', head: true }).gte('created_at', today.toISOString()),
    supabase.from('orders').select('amount_paid, currency').eq('status', 'delivered').or('status.eq.activated'),
    supabase.from('customers').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('*, customers(name,email), plans(name)').order('created_at', { ascending: false }).limit(8),
  ])

  const revenueArr = (revenueData || []) as any[]
  const pkrRevenue = revenueArr.filter(o => o.currency === 'PKR').reduce((s: number, o: any) => s + o.amount_paid, 0)
  const usdRevenue = revenueArr.filter(o => o.currency === 'USD').reduce((s: number, o: any) => s + o.amount_paid, 0)

  return { totalOrders, todayOrders, pkrRevenue, usdRevenue, totalCustomers, recentOrders }
}

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-400/10 text-yellow-400',
  paid: 'bg-blue-400/10 text-blue-400',
  processing: 'bg-cyan-400/10 text-cyan-400',
  delivered: 'bg-green-400/10 text-green-400',
  activated: 'bg-green-400/10 text-green-400',
  expired: 'bg-gray-400/10 text-gray-400',
  cancelled: 'bg-red-400/10 text-red-400',
}

export default async function DashboardPage() {
  const { totalOrders, todayOrders, pkrRevenue, usdRevenue, totalCustomers, recentOrders } = await getStats()

  const stats = [
    { label: 'Total Orders', value: totalOrders ?? 0, icon: ShoppingCart, color: 'text-cyan-400', bg: 'bg-cyan-400/10' },
    { label: "Today's Orders", value: todayOrders ?? 0, icon: TrendingUp, color: 'text-green-400', bg: 'bg-green-400/10' },
    { label: 'Total Customers', value: totalCustomers ?? 0, icon: Users, color: 'text-purple-400', bg: 'bg-purple-400/10' },
    { label: 'Revenue (PKR)', value: `Rs ${(pkrRevenue).toLocaleString()}`, icon: Package, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-black mb-1">Dashboard</h1>
        <p className="text-gray-500 text-sm">Welcome back, Admin</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-[#111] border border-white/5 rounded-2xl p-5">
            <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-3`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <div className="text-2xl font-black mb-1">{value}</div>
            <div className="text-sm text-gray-500">{label}</div>
          </div>
        ))}
      </div>

      {/* USD Revenue */}
      {usdRevenue > 0 && (
        <div className="bg-[#111] border border-white/5 rounded-2xl p-5 mb-8 flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-500 mb-1">USD Revenue</div>
            <div className="text-xl font-bold text-green-400">${usdRevenue.toFixed(2)}</div>
          </div>
          <Wifi className="w-8 h-8 text-white/5" />
        </div>
      )}

      {/* Recent Orders */}
      <div className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-white/5">
          <h2 className="font-bold">Recent Orders</h2>
          <Link href="/admin/orders" className="text-sm text-cyan-400 hover:text-cyan-300">View all →</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-xs text-gray-500 border-b border-white/5">
                <th className="text-left px-5 py-3 font-medium">Order ID</th>
                <th className="text-left px-5 py-3 font-medium">Customer</th>
                <th className="text-left px-5 py-3 font-medium">Plan</th>
                <th className="text-left px-5 py-3 font-medium">Status</th>
                <th className="text-left px-5 py-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {(recentOrders ?? []).map((order: any) => (
                <tr key={order.id} className="border-b border-white/3 hover:bg-white/2 transition-colors">
                  <td className="px-5 py-3">
                    <Link href={`/admin/orders/${order.id}`} className="text-cyan-400 hover:text-cyan-300 font-mono text-sm">
                      {order.id}
                    </Link>
                  </td>
                  <td className="px-5 py-3">
                    <div className="text-sm">{order.customers?.name}</div>
                    <div className="text-xs text-gray-500">{order.customers?.email}</div>
                  </td>
                  <td className="px-5 py-3 text-sm text-gray-400">{order.plans?.name}</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_COLORS[order.status] ?? 'bg-gray-400/10 text-gray-400'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-xs text-gray-500">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {(!recentOrders || recentOrders.length === 0) && (
            <div className="text-center py-10 text-gray-500 text-sm">No orders yet</div>
          )}
        </div>
      </div>
    </div>
  )
}
