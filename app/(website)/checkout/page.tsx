import { createServiceClient } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import CheckoutClient from './CheckoutClient'
import { STATIC_PLANS_BY_ID } from '@/data/plans'

interface Props {
  searchParams: Promise<{ plan?: string }>
}

export default async function CheckoutPage({ searchParams }: Props) {
  const { plan: planId } = await searchParams
  if (!planId) notFound()

  // Static plan IDs (e.g. "p-5gb") resolve instantly without a DB query
  if (STATIC_PLANS_BY_ID[planId]) {
    return <CheckoutClient plan={STATIC_PLANS_BY_ID[planId]} />
  }

  // Fall back to DB lookup for UUID-based plan IDs
  const supabase = createServiceClient()
  const { data: plan } = await supabase.from('plans').select('*').eq('id', planId).single()
  if (!plan) notFound()

  return <CheckoutClient plan={plan} />
}
