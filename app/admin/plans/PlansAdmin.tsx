'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Edit2, Trash2, ToggleLeft, ToggleRight, Loader2, X } from 'lucide-react'
import type { Plan } from '@/types/database'

const EMPTY_FORM = {
  name: '', data_gb: '', validity_days: '', region: 'Asia',
  countries: '', price_pkr: '', price_usd: '',
  is_featured: false, badge: '', description: '',
}

const REGIONS = ['Asia', 'Europe', 'Middle East', 'North America', 'Global']

export default function PlansAdmin({ plans }: { plans: Plan[] }) {
  const router = useRouter()
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Plan | null>(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function openNew() {
    setEditing(null)
    setForm(EMPTY_FORM)
    setShowForm(true)
  }

  function openEdit(plan: Plan) {
    setEditing(plan)
    setForm({
      name: plan.name,
      data_gb: String(plan.data_gb),
      validity_days: String(plan.validity_days),
      region: plan.region,
      countries: plan.countries?.join(', ') ?? '',
      price_pkr: String(plan.price_pkr),
      price_usd: String(plan.price_usd),
      is_featured: plan.is_featured,
      badge: plan.badge ?? '',
      description: plan.description ?? '',
    })
    setShowForm(true)
  }

  function change(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value, type } = e.target
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value }))
  }

  async function save() {
    setLoading(true)
    setError('')
    const payload = {
      name: form.name, data_gb: Number(form.data_gb),
      validity_days: Number(form.validity_days), region: form.region,
      countries: form.countries.split(',').map(s => s.trim()).filter(Boolean),
      price_pkr: Number(form.price_pkr), price_usd: Number(form.price_usd),
      is_featured: form.is_featured, badge: form.badge || null,
      description: form.description || null, is_active: true,
    }
    const res = await fetch('/api/admin/plans' + (editing ? `/${editing.id}` : ''), {
      method: editing ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const data = await res.json()
    if (!res.ok) { setError(data.error || 'Failed'); setLoading(false); return }
    setShowForm(false)
    setLoading(false)
    router.refresh()
  }

  async function toggle(plan: Plan) {
    await fetch(`/api/admin/plans/${plan.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_active: !plan.is_active }),
    })
    router.refresh()
  }

  async function deletePlan(id: string) {
    if (!confirm('Delete this plan?')) return
    await fetch(`/api/admin/plans/${id}`, { method: 'DELETE' })
    router.refresh()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black mb-1">Plans</h1>
          <p className="text-gray-500 text-sm">{plans.length} plans</p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 bg-cyan-400 hover:bg-cyan-300 text-black font-semibold px-4 py-2 rounded-xl text-sm transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Plan
        </button>
      </div>

      {/* Table */}
      <div className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-xs text-gray-500 border-b border-white/5">
                <th className="text-left px-5 py-3 font-medium">Plan</th>
                <th className="text-left px-5 py-3 font-medium">Region</th>
                <th className="text-left px-5 py-3 font-medium">Data / Days</th>
                <th className="text-left px-5 py-3 font-medium">PKR</th>
                <th className="text-left px-5 py-3 font-medium">USD</th>
                <th className="text-left px-5 py-3 font-medium">Active</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {plans.map(plan => (
                <tr key={plan.id} className="border-b border-white/3 hover:bg-white/2 transition-colors">
                  <td className="px-5 py-3">
                    <div className="font-medium text-sm">{plan.name}</div>
                    {plan.badge && <span className="text-xs text-cyan-400">{plan.badge}</span>}
                  </td>
                  <td className="px-5 py-3 text-sm text-gray-400">{plan.region}</td>
                  <td className="px-5 py-3 text-sm">{plan.data_gb} GB / {plan.validity_days}d</td>
                  <td className="px-5 py-3 text-sm">Rs {plan.price_pkr.toLocaleString()}</td>
                  <td className="px-5 py-3 text-sm">${plan.price_usd}</td>
                  <td className="px-5 py-3">
                    <button onClick={() => toggle(plan)}>
                      {plan.is_active
                        ? <ToggleRight className="w-5 h-5 text-green-400" />
                        : <ToggleLeft className="w-5 h-5 text-gray-600" />}
                    </button>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(plan)} className="text-gray-500 hover:text-white transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => deletePlan(plan.id)} className="text-gray-500 hover:text-red-400 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Plan Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4">
          <div className="bg-[#111] border border-white/10 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold">{editing ? 'Edit Plan' : 'New Plan'}</h2>
              <button onClick={() => setShowForm(false)}><X className="w-5 h-5 text-gray-500" /></button>
            </div>

            <div className="space-y-4">
              {[
                { name: 'name', label: 'Plan Name', placeholder: 'Asia Explorer' },
              ].map(f => (
                <div key={f.name}>
                  <label className="text-xs text-gray-500 mb-1.5 block">{f.label}</label>
                  <input name={f.name} value={(form as any)[f.name]} onChange={change} placeholder={f.placeholder}
                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-cyan-400/50" />
                </div>
              ))}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 mb-1.5 block">Data (GB)</label>
                  <input name="data_gb" type="number" value={form.data_gb} onChange={change}
                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400/50" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1.5 block">Validity (days)</label>
                  <input name="validity_days" type="number" value={form.validity_days} onChange={change}
                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400/50" />
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-500 mb-1.5 block">Region</label>
                <select name="region" value={form.region} onChange={change}
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400/50">
                  {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>

              <div>
                <label className="text-xs text-gray-500 mb-1.5 block">Countries (comma-separated)</label>
                <input name="countries" value={form.countries} onChange={change} placeholder="Thailand, Malaysia, Singapore"
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-cyan-400/50" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 mb-1.5 block">Price PKR</label>
                  <input name="price_pkr" type="number" value={form.price_pkr} onChange={change}
                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400/50" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1.5 block">Price USD</label>
                  <input name="price_usd" type="number" value={form.price_usd} onChange={change}
                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400/50" />
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-500 mb-1.5 block">Badge (optional)</label>
                <input name="badge" value={form.badge} onChange={change} placeholder="Most Popular"
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-cyan-400/50" />
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" name="is_featured" checked={form.is_featured} onChange={change} className="accent-cyan-400" />
                <span className="text-sm text-gray-400">Featured on homepage</span>
              </label>

              {error && <p className="text-red-400 text-sm">{error}</p>}

              <button
                onClick={save}
                disabled={loading}
                className="w-full bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 text-black font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {editing ? 'Save Changes' : 'Create Plan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
