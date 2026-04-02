import { createServiceClient } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import OrderActions from './OrderActions'

interface Props {
  params: Promise<{ id: string }>
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

export default async function AdminOrderDetailPage({ params }: Props) {
  const { id } = await params
  const supabase = createServiceClient()

  const { data: rawOrder } = await supabase
    .from('orders')
    .select('*, customers(*), plans(*), payments(*)')
    .eq('id', id)
    .single()

  if (!rawOrder) notFound()
  const order = rawOrder as any

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/orders" className="p-2 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-slate-800 hover:border-slate-300 transition-colors shadow-sm">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-lg font-extrabold font-mono text-slate-800">{order.id}</h1>
          <p className="text-xs text-slate-400">{new Date(order.created_at).toLocaleString()}</p>
        </div>
        <span className={`ml-auto text-xs font-semibold px-3 py-1.5 rounded-full capitalize ${STATUS_COLORS[order.status] ?? 'bg-slate-100 text-slate-500'}`}>
          {order.status}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left: Details */}
        <div className="lg:col-span-2 space-y-4">

          {/* Customer */}
          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
            <h3 className="font-semibold mb-4 text-xs text-slate-400 uppercase tracking-wider">Customer</h3>
            <div className="space-y-2.5 text-sm">
              {[
                ['Name',      order.customers?.name],
                ['Email',     order.customers?.email],
                ['Phone',     order.customers?.phone],
                ['WhatsApp',  order.customers?.whatsapp || '—'],
              ].map(([label, val]) => (
                <div key={label} className="flex justify-between items-center">
                  <span className="text-slate-400">{label}</span>
                  <span className="font-medium text-slate-700">{val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Plan */}
          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
            <h3 className="font-semibold mb-4 text-xs text-slate-400 uppercase tracking-wider">Plan</h3>
            <div className="space-y-2.5 text-sm">
              {[
                ['Name',     order.plans?.name],
                ['Region',   order.plans?.region],
                ['Data',     `${order.plans?.data_gb} GB`],
                ['Validity', `${order.plans?.validity_days} days`],
              ].map(([label, val]) => (
                <div key={label} className="flex justify-between items-center">
                  <span className="text-slate-400">{label}</span>
                  <span className="font-medium text-slate-700">{val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* eSIM Details */}
          {(order.qr_code_url || order.esim_code) && (
            <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
              <h3 className="font-semibold mb-4 text-xs text-slate-400 uppercase tracking-wider">eSIM Details</h3>
              {order.qr_code_url && (
                <div className="mb-4">
                  <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl inline-block">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={order.qr_code_url} alt="QR" className="w-32 h-32" />
                  </div>
                  <a href={order.qr_code_url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-violet-600 mt-2 hover:text-violet-700">
                    View QR <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
              {order.esim_code && (
                <div className="bg-slate-800 rounded-xl p-3">
                  <div className="text-xs text-slate-400 mb-1">Activation Code</div>
                  <code className="text-emerald-400 text-xs break-all">{order.esim_code}</code>
                </div>
              )}
            </div>
          )}

          {/* Payment History */}
          {order.payments?.length > 0 && (
            <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
              <h3 className="font-semibold mb-4 text-xs text-slate-400 uppercase tracking-wider">Payment History</h3>
              {order.payments.map((p: any) => (
                <div key={p.id} className="flex items-center justify-between text-sm py-2.5 border-b border-slate-50 last:border-0">
                  <div>
                    <div className="capitalize font-semibold text-slate-700">{p.gateway}</div>
                    <div className="text-xs text-slate-400 font-mono truncate max-w-[200px]">{p.transaction_id || '—'}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-slate-700">
                      {p.currency === 'PKR' ? `Rs ${p.amount.toLocaleString()}` : `$${p.amount}`}
                    </div>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      p.status === 'success' ? 'bg-green-50 text-green-600' :
                      p.status === 'failed'  ? 'bg-red-50 text-red-600'    :
                      'bg-amber-50 text-amber-600'
                    }`}>
                      {p.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Actions */}
        <div>
          <OrderActions order={order as any} />
        </div>
      </div>
    </div>
  )
}
