import { createServiceClient } from '@/lib/supabase'
import Link from 'next/link'
import { Search } from 'lucide-react'

export const revalidate = 10

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-400/10 text-yellow-400',
  paid: 'bg-blue-400/10 text-blue-400',
  processing: 'bg-cyan-400/10 text-cyan-400',
  delivered: 'bg-green-400/10 text-green-400',
  activated: 'bg-green-400/10 text-green-400',
  expired: 'bg-gray-400/10 text-gray-400',
  cancelled: 'bg-red-400/10 text-red-400',
}

interface Props {
  searchParams: Promise<{ status?: string; q?: string }>
}

export default async function OrdersPage({ searchParams }: Props) {
  const { status, q } = await searchParams
  const supabase = createServiceClient()

  let query = supabase
    .from('orders')
    .select('*, customers(name, email), plans(name, region)')
    .order('created_at', { ascending: false })
    .limit(100)

  if (status && status !== 'all') {
    query = query.eq('status', status)
  }

  const { data: orders } = await query

  const filtered = q
    ? (orders ?? []).filter((o: any) =>
        o.id.toLowerCase().includes(q.toLowerCase()) ||
        o.customers?.email?.toLowerCase().includes(q.toLowerCase()) ||
        o.customers?.name?.toLowerCase().includes(q.toLowerCase())
      )
    : (orders ?? [])

  const STATUSES = ['all', 'pending', 'paid', 'processing', 'delivered', 'activated', 'expired', 'cancelled']

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black mb-1">Orders</h1>
          <p className="text-gray-500 text-sm">{filtered.length} orders</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
        <form className="flex items-center gap-2 bg-[#111] border border-white/5 rounded-xl px-3 py-2 flex-1 max-w-sm">
          <Search className="w-4 h-4 text-gray-500 flex-shrink-0" />
          <input
            name="q"
            defaultValue={q}
            placeholder="Search orders, customers..."
            className="bg-transparent text-sm text-white placeholder-gray-600 outline-none flex-1"
          />
        </form>

        <div className="flex gap-2 flex-wrap">
          {STATUSES.map(s => (
            <Link
              key={s}
              href={`/admin/orders${s !== 'all' ? `?status=${s}` : ''}`}
              className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-colors ${
                (status ?? 'all') === s
                  ? 'bg-cyan-400 text-black'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              {s}
            </Link>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-xs text-gray-500 border-b border-white/5">
                <th className="text-left px-5 py-3 font-medium">Order ID</th>
                <th className="text-left px-5 py-3 font-medium">Customer</th>
                <th className="text-left px-5 py-3 font-medium">Plan</th>
                <th className="text-left px-5 py-3 font-medium">Payment</th>
                <th className="text-left px-5 py-3 font-medium">Amount</th>
                <th className="text-left px-5 py-3 font-medium">Status</th>
                <th className="text-left px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((order: any) => (
                <tr key={order.id} className="border-b border-white/3 hover:bg-white/2 transition-colors">
                  <td className="px-5 py-3">
                    <Link href={`/admin/orders/${order.id}`} className="text-cyan-400 hover:text-cyan-300 font-mono text-xs">
                      {order.id}
                    </Link>
                  </td>
                  <td className="px-5 py-3">
                    <div className="text-sm font-medium">{order.customers?.name}</div>
                    <div className="text-xs text-gray-500">{order.customers?.email}</div>
                  </td>
                  <td className="px-5 py-3">
                    <div className="text-sm">{order.plans?.name}</div>
                    <div className="text-xs text-gray-600">{order.plans?.region}</div>
                  </td>
                  <td className="px-5 py-3 text-sm text-gray-400 capitalize">{order.payment_method}</td>
                  <td className="px-5 py-3 text-sm font-semibold">
                    {order.currency === 'PKR' ? `Rs ${order.amount_paid.toLocaleString()}` : `$${order.amount_paid}`}
                  </td>
                  <td className="px-5 py-3">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_COLORS[order.status] ?? 'bg-gray-400/10 text-gray-400'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-xs text-gray-500 whitespace-nowrap">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-3">
                    <Link href={`/admin/orders/${order.id}`} className="text-xs text-gray-500 hover:text-white">
                      View →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-10 text-gray-500 text-sm">No orders found</div>
          )}
        </div>
      </div>
    </div>
  )
}
