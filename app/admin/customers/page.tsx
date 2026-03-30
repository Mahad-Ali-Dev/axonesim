import { createServiceClient } from '@/lib/supabase'
import { MessageCircle, Mail } from 'lucide-react'

export const revalidate = 30

export default async function CustomersPage() {
  const supabase = createServiceClient()
  const { data: customers, count } = await supabase
    .from('customers')
    .select('*, orders(id, status)', { count: 'exact' })
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black mb-1">Customers</h1>
          <p className="text-gray-500 text-sm">{count ?? 0} total</p>
        </div>
      </div>

      <div className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-xs text-gray-500 border-b border-white/5">
                <th className="text-left px-5 py-3 font-medium">Customer</th>
                <th className="text-left px-5 py-3 font-medium">Phone</th>
                <th className="text-left px-5 py-3 font-medium">Orders</th>
                <th className="text-left px-5 py-3 font-medium">Joined</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {(customers ?? []).map((c: any) => (
                <tr key={c.id} className="border-b border-white/3 hover:bg-white/2 transition-colors">
                  <td className="px-5 py-3">
                    <div className="font-medium text-sm">{c.name}</div>
                    <div className="text-xs text-gray-500">{c.email}</div>
                  </td>
                  <td className="px-5 py-3 text-sm text-gray-400">{c.phone}</td>
                  <td className="px-5 py-3">
                    <span className="text-sm font-semibold">{c.orders?.length ?? 0}</span>
                  </td>
                  <td className="px-5 py-3 text-xs text-gray-500">
                    {new Date(c.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <a href={`mailto:${c.email}`} className="text-gray-500 hover:text-white transition-colors">
                        <Mail className="w-4 h-4" />
                      </a>
                      {(c.whatsapp || c.phone) && (
                        <a
                          href={`https://wa.me/${(c.whatsapp || c.phone).replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-500 hover:text-green-400 transition-colors"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {(!customers || customers.length === 0) && (
            <div className="text-center py-10 text-gray-500 text-sm">No customers yet</div>
          )}
        </div>
      </div>
    </div>
  )
}
