import { createServiceClient } from '@/lib/supabase'
import PlansAdmin from './PlansAdmin'

export const revalidate = 10

export default async function AdminPlansPage() {
  const supabase = createServiceClient()
  const { data: plans } = await supabase.from('plans').select('*').order('created_at', { ascending: false })
  return <PlansAdmin plans={plans ?? []} />
}
