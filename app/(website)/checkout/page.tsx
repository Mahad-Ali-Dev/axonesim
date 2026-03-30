import { createServiceClient } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import CheckoutClient from './CheckoutClient'

interface Props {
  searchParams: Promise<{ plan?: string }>
}

export default async function CheckoutPage({ searchParams }: Props) {
  const { plan: planId } = await searchParams
  if (!planId) notFound()

  const supabase = createServiceClient()
  const { data: plan } = await supabase.from('plans').select('*').eq('id', planId).single()
  if (!plan) notFound()

  return <CheckoutClient plan={plan} />
}
