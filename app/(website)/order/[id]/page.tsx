import { createServiceClient } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import OrderClient from './OrderClient'

interface Props {
  params: Promise<{ id: string }>
}

export default async function OrderPage({ params }: Props) {
  const { id } = await params
  const supabase = createServiceClient()

  const { data: order } = await supabase
    .from('orders')
    .select('*, customers(*), plans(*)')
    .eq('id', id)
    .single()

  if (!order) notFound()

  return <OrderClient order={order as any} />
}
