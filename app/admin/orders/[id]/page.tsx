import { createServiceClient } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import OrderActions from './OrderActions'

interface Props {
  params: Promise<{ id: string }>
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
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/orders" className="text-gray-500 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-xl font-black font-mono">{order.id}</h1>
          <p className="text-xs text-gray-500">{new Date(order.created_at).toLocaleString()}</p>
        </div>
        <span className={`ml-auto text-xs font-semibold px-3 py-1.5 rounded-full capitalize ${STATUS_COLORS[order.status]}`}>
          {order.status}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left: Details */}
        <div className="lg:col-span-2 space-y-5">
          {/* Customer */}
          <div className="bg-[#111] border border-white/5 rounded-2xl p-5">
            <h3 className="font-semibold mb-4 text-sm text-gray-400 uppercase tracking-wider">Customer</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Name</span>
                <span>{(order as any).customers.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Email</span>
                <span>{(order as any).customers.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Phone</span>
                <span>{(order as any).customers.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">WhatsApp</span>
                <span>{(order as any).customers.whatsapp || '—'}</span>
              </div>
            </div>
          </div>

          {/* Plan */}
          <div className="bg-[#111] border border-white/5 rounded-2xl p-5">
            <h3 className="font-semibold mb-4 text-sm text-gray-400 uppercase tracking-wider">Plan</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Name</span>
                <span>{(order as any).plans.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Region</span>
                <span>{(order as any).plans.region}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Data</span>
                <span>{(order as any).plans.data_gb} GB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Validity</span>
                <span>{(order as any).plans.validity_days} days</span>
              </div>
            </div>
          </div>

          {/* eSIM */}
          {(order.qr_code_url || order.esim_code) && (
            <div className="bg-[#111] border border-white/5 rounded-2xl p-5">
              <h3 className="font-semibold mb-4 text-sm text-gray-400 uppercase tracking-wider">eSIM Details</h3>
              {order.qr_code_url && (
                <div className="mb-4">
                  <div className="bg-white p-3 rounded-xl inline-block">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={order.qr_code_url} alt="QR" className="w-32 h-32" />
                  </div>
                  <a href={order.qr_code_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-cyan-400 mt-2">
                    View QR <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
              {order.esim_code && (
                <div className="bg-black rounded-xl p-3">
                  <div className="text-xs text-gray-500 mb-1">Activation Code</div>
                  <code className="text-cyan-400 text-xs break-all">{order.esim_code}</code>
                </div>
              )}
            </div>
          )}

          {/* Payments */}
          {(order as any).payments?.length > 0 && (
            <div className="bg-[#111] border border-white/5 rounded-2xl p-5">
              <h3 className="font-semibold mb-4 text-sm text-gray-400 uppercase tracking-wider">Payment History</h3>
              {(order as any).payments.map((p: any) => (
                <div key={p.id} className="flex items-center justify-between text-sm py-2 border-b border-white/5 last:border-0">
                  <div>
                    <div className="capitalize font-medium">{p.gateway}</div>
                    <div className="text-xs text-gray-500 font-mono">{p.transaction_id || '—'}</div>
                  </div>
                  <div className="text-right">
                    <div>{p.currency === 'PKR' ? `Rs ${p.amount.toLocaleString()}` : `$${p.amount}`}</div>
                    <div className={`text-xs ${p.status === 'success' ? 'text-green-400' : p.status === 'failed' ? 'text-red-400' : 'text-yellow-400'}`}>
                      {p.status}
                    </div>
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
