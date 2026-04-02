import { createServiceClient } from '@/lib/supabase'
import Link from 'next/link'
import { Search } from 'lucide-react'

export const revalidate = 10

const STATUS_COLORS: Record<string, string> = {
  pending:    'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  paid:       'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
  processing: 'bg-sky-50 text-sky-700 ring-1 ring-sky-200',
  delivered:  'bg-green-50 text-green-700 ring-1 ring-green-200',
  activated:  'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  expired:    'bg-slate-100 text-slate-500 ring-1 ring-slate-200',
  cancelled:  'bg-red-50 text-red-600 ring-1 ring-red-200',
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

  if (status && status !== 'all') query = query.eq('status', status)

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
          <h1 className="text-2xl font-extrabold text-slate-800 mb-0.5">Orders</h1>
          <p className="text-slate-400 text-sm">{filtered.length} orders</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-5">
        <form className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 w-full sm:max-w-xs shadow-sm">
          <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <input
            name="q"
            defaultValue={q}
            placeholder="Search orders, customers..."
            className="bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none flex-1"
          />
        </form>
        <div className="flex gap-1.5 flex-wrap">
          {STATUSES.map(s => (
            <Link
              key={s}
              href={`/admin/orders${s !== 'all' ? `?status=${s}` : ''}`}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition-colors ${
                (status ?? 'all') === s
                  ? 'bg-violet-600 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-500 hover:border-violet-300 hover:text-violet-600'
              }`}
            >
              {s}
            </Link>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-xs text-slate-400 border-b border-slate-100 bg-slate-50/60">
                <th className="text-left px-5 py-3 font-semibold">Order ID</th>
                <th className="text-left px-5 py-3 font-semibold">Customer</th>
                <th className="text-left px-5 py-3 font-semibold hidden md:table-cell">Plan</th>
                <th className="text-left px-5 py-3 font-semibold hidden sm:table-cell">Payment</th>
                <th className="text-left px-5 py-3 font-semibold">Amount</th>
                <th className="text-left px-5 py-3 font-semibold">Status</th>
                <th className="text-left px-5 py-3 font-semibold hidden lg:table-cell">Date</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((order: any) => (
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
                  <td className="px-5 py-3 hidden md:table-cell">
                    <div className="text-sm text-slate-600">{order.plans?.name}</div>
                    <div className="text-xs text-slate-400">{order.plans?.region}</div>
                  </td>
                  <td className="px-5 py-3 text-sm text-slate-500 capitalize hidden sm:table-cell">{order.payment_method}</td>
                  <td className="px-5 py-3 text-sm font-semibold text-slate-700">
                    {order.currency === 'PKR' ? `Rs ${order.amount_paid.toLocaleString()}` : `$${order.amount_paid}`}
                  </td>
                  <td className="px-5 py-3">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${STATUS_COLORS[order.status] ?? 'bg-slate-100 text-slate-500'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-xs text-slate-400 whitespace-nowrap hidden lg:table-cell">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-3">
                    <Link href={`/admin/orders/${order.id}`} className="text-xs text-violet-500 hover:text-violet-700 font-medium">
                      View →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-slate-400 text-sm">No orders found</div>
          )}
        </div>
      </div>
    </div>
  )
}
