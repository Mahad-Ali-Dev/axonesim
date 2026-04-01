import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase'
import AdminSidebar from '@/components/admin/AdminSidebar'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createSupabaseServerClient()

  // Verify identity with Supabase Auth (token validated server-side)
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/sign-in')

  // Use service role client to bypass RLS on the admins table
  const adminClient = createAdminClient()
  const { data: admin } = await adminClient
    .from('admins')
    .select('id, role')
    .eq('id', user.id)
    .single()

  if (!admin) redirect('/sign-in')

  return (
    <div className="flex min-h-screen bg-[#0a0a0a]">
      <AdminSidebar />
      <main className="flex-1 ml-64 p-8 overflow-auto">
        {children}
      </main>
    </div>
  )
}
