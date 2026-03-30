import { createServiceClient } from '@/lib/supabase'
import PlansClient from './PlansClient'

export const revalidate = 60

export default async function PlansPage() {
  const supabase = createServiceClient()
  const { data: plans } = await supabase
    .from('plans')
    .select('*')
    .eq('is_active', true)
    .order('price_pkr', { ascending: true })

  return <PlansClient plans={plans ?? []} />
}
