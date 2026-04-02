import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase'
import AdminShell from '@/components/admin/AdminShell'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createSupabaseServerClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/sign-in')

  const adminClient = createAdminClient()
  const { data: admin } = await adminClient
    .from('admins')
    .select('id, role')
    .eq('id', user.id)
    .single()

  if (!admin) redirect('/sign-in')

  return <AdminShell>{children}</AdminShell>
}
