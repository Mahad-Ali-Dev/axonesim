import { createSupabaseServerClient } from '@/lib/supabase/server'
import { createAdminClient }          from '@/lib/supabase'
import { redirect }                   from 'next/navigation'
import { userSignOut }                from '@/app/actions/user-auth'
import Link                           from 'next/link'
import Image                          from 'next/image'
import {
  Globe, Wifi, Package, Clock, CheckCircle2,
  XCircle, QrCode, LogOut, ChevronRight, Zap,
  type LucideIcon
} from 'lucide-react'
import CopyButton from '@/components/website/CopyButton'

const STATUS_META: Record<string, { label: string; color: string; icon: LucideIcon }> = {
  pending:    { label: 'Pending',    color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',  icon: Clock         },
  paid:       { label: 'Paid',       color: 'text-blue-400   bg-blue-400/10   border-blue-400/20',    icon: CheckCircle2  },
  processing: { label: 'Processing', color: 'text-cyan-400   bg-cyan-400/10   border-cyan-400/20',    icon: Zap           },
  delivered:  { label: 'Delivered',  color: 'text-green-400  bg-green-400/10  border-green-400/20',   icon: CheckCircle2  },
  activated:  { label: 'Active',     color: 'text-green-400  bg-green-400/10  border-green-400/20',   icon: Wifi          },
  expired:    { label: 'Expired',    color: 'text-gray-400   bg-gray-400/10   border-gray-400/20',    icon: XCircle       },
  cancelled:  { label: 'Cancelled',  color: 'text-red-400    bg-red-400/10    border-red-400/20',     icon: XCircle       },
}

export default async function AccountPage() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/account/login')

  // Fetch orders tied to this user's email via the customers table
  const admin = createAdminClient()
  const { data: orders } = await admin
    .from('orders')
    .select('*, plans(*), esim_profiles(*)')
    .eq('customers.email', user.email!)   // filter via FK join
    .order('created_at', { ascending: false })

  // fallback: fetch by customer email directly
  let userOrders: any[] = orders ?? []
  if (userOrders.length === 0) {
    const { data: customerRows } = await admin
      .from('customers')
      .select('id')
      .eq('email', user.email!)

    if (customerRows && customerRows.length > 0) {
      const customerIds = customerRows.map((c: any) => c.id)
      const { data: ords } = await admin
        .from('orders')
        .select('*, plans(*), esim_profiles(*)')
        .in('customer_id', customerIds)
        .order('created_at', { ascending: false })
      userOrders = ords ?? []
    }
  }

  const activeCount    = userOrders.filter(o => o.status === 'activated').length
  const deliveredCount = userOrders.filter(o => ['delivered', 'activated'].includes(o.status)).length

  return (
    <div className="min-h-screen bg-[#010206]">
      {/* Top nav */}
      <header className="border-b border-white/[0.05] bg-[#010206]/95 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
          <Link href="/">
            <Image src="/navbar_logo.png" alt="Axon eSIM" width={180} height={54} className="h-14 w-auto object-contain opacity-90 hover:opacity-100 transition-opacity" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-xs font-semibold text-white">{user.user_metadata?.full_name ?? 'My Account'}</span>
              <span className="text-xs text-slate-500">{user.email}</span>
            </div>
            <form action={userSignOut}>
              <button type="submit" className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-red-400 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-500/5">
                <LogOut className="w-3.5 h-3.5" />
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-5 sm:px-8 py-10">
        {/* Greeting */}
        <div className="mb-8">
          <h1 className="text-2xl font-black text-white mb-1">
            My eSIMs
          </h1>
          <p className="text-sm text-slate-500">Manage your plans and track usage</p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4 text-center">
            <div className="text-2xl font-black text-white mb-1">{userOrders.length}</div>
            <div className="text-xs text-slate-500">Total Orders</div>
          </div>
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4 text-center">
            <div className="text-2xl font-black text-green-400 mb-1">{deliveredCount}</div>
            <div className="text-xs text-slate-500">Delivered</div>
          </div>
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4 text-center">
            <div className="text-2xl font-black text-violet-400 mb-1">{activeCount}</div>
            <div className="text-xs text-slate-500">Active</div>
          </div>
        </div>

        {/* Order list */}
        {userOrders.length === 0 ? (
          <div className="bg-white/[0.02] border border-white/[0.05] rounded-3xl p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mx-auto mb-4">
              <Globe className="w-8 h-8 text-violet-400" />
            </div>
            <h3 className="text-white font-bold text-lg mb-2">No orders yet</h3>
            <p className="text-slate-500 text-sm mb-6">
              Browse our plans and get connected in 150+ countries.
            </p>
            <Link
              href="/plans"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-500 text-white text-sm font-bold shadow-lg shadow-violet-600/25 hover:shadow-violet-600/40 hover:scale-[1.02] transition-all"
            >
              <Globe className="w-4 h-4" />
              Browse eSIM Plans
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {userOrders.map((order: any) => {
              const meta   = STATUS_META[order.status] ?? STATUS_META.pending
              const StatusIcon = meta.icon
              const esim   = order.esim_profiles?.[0]
              const plan   = order.plans

              return (
                <div key={order.id} className="bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden">
                  {/* Header */}
                  <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.05]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                        <Package className="w-5 h-5 text-violet-400" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{plan?.name ?? 'eSIM Plan'}</p>
                        <p className="text-xs text-slate-500 font-mono">{order.id}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${meta.color}`}>
                        <StatusIcon className="w-3 h-3" />
                        {meta.label}
                      </span>
                      <Link href={`/order/${order.id}`} className="text-slate-600 hover:text-slate-400 transition-colors">
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="px-5 py-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                    <div>
                      <p className="text-slate-500 mb-0.5">Region</p>
                      <p className="text-slate-300 font-semibold">{plan?.region ?? '—'}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 mb-0.5">Data</p>
                      <p className="text-slate-300 font-semibold">{plan?.data_gb ? `${plan.data_gb} GB` : '—'}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 mb-0.5">Validity</p>
                      <p className="text-slate-300 font-semibold">{plan?.validity_days ? `${plan.validity_days} days` : '—'}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 mb-0.5">Ordered</p>
                      <p className="text-slate-300 font-semibold">{new Date(order.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    </div>
                  </div>

                  {/* eSIM profile — only if delivered/activated */}
                  {esim && ['delivered', 'activated'].includes(order.status) && (
                    <div className="mx-5 mb-5 rounded-xl bg-gradient-to-br from-green-500/[0.08] to-emerald-500/[0.04] border border-green-500/20 p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <QrCode className="w-4 h-4 text-green-400" />
                        <span className="text-xs font-bold text-green-400 uppercase tracking-wide">eSIM Ready</span>
                      </div>

                      {esim.qr_code_url && (
                        <div className="flex justify-center mb-4">
                          <div className="bg-white p-3 rounded-xl inline-block shadow-lg">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={esim.qr_code_url} alt="eSIM QR Code" className="w-40 h-40 object-contain" />
                          </div>
                        </div>
                      )}

                      {esim.activation_code && (
                        <div className="bg-slate-900/70 rounded-xl p-3 mt-2">
                          <p className="text-xs text-slate-400 mb-1 font-semibold">Activation Code</p>
                          <div className="flex items-center gap-2">
                            <code className="text-xs text-green-300 font-mono break-all flex-1 leading-relaxed">{esim.activation_code}</code>
                            <CopyButton text={esim.activation_code} />
                          </div>
                        </div>
                      )}

                      {esim.iccid && (
                        <div className="mt-2 px-3 py-2 bg-slate-900/40 rounded-lg">
                          <span className="text-xs text-slate-500 mr-2">ICCID:</span>
                          <code className="text-xs text-slate-300 font-mono">{esim.iccid}</code>
                        </div>
                      )}

                      {/* Data usage note — live monitoring coming soon via LoopeSIM API */}
                      <div className="mt-3 flex items-start gap-2 bg-white/[0.04] border border-white/[0.06] rounded-xl px-3 py-2.5">
                        <span className="text-base leading-none mt-0.5">📊</span>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          <span className="text-slate-300 font-semibold">Data usage &amp; time remaining</span> — check in your phone&apos;s{' '}
                          <span className="text-violet-300 font-semibold">Settings → Cellular → [your eSIM plan] → Current Period</span>.
                          Live monitoring will be available here soon.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* Footer note */}
        <p className="text-center text-xs text-slate-700 mt-10">
          Need help?{' '}
          <a href="https://wa.me/923349542871" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-slate-400">
            WhatsApp Support
          </a>
          {' · '}
          <a href="mailto:supportaxonesim@gmail.com" className="text-slate-500 hover:text-slate-400">
            supportaxonesim@gmail.com
          </a>
        </p>
      </main>
    </div>
  )
}
