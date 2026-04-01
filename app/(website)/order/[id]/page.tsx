import { createServiceClient, createAdminClient } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import OrderClient from './OrderClient'
import { stripe } from '@/lib/stripe'
import { deliverESIM } from '@/lib/esim'

interface Props {
  params: Promise<{ id: string }>
  searchParams: Promise<{
    redirect_status?: string
    payment_intent?: string
    payment_intent_client_secret?: string
  }>
}

export default async function OrderPage({ params, searchParams }: Props) {
  const { id } = await params
  const { redirect_status, payment_intent } = await searchParams

  // ── Stripe redirect handler ──────────────────────────────────
  // When confirmPayment() succeeds, Stripe redirects here with
  // ?payment_intent=pi_...&redirect_status=succeeded
  // We verify server-side and update the order immediately,
  // so the page reflects the real status without needing a webhook.
  if (redirect_status === 'succeeded' && payment_intent) {
    try {
      const pi = await stripe.paymentIntents.retrieve(payment_intent)

      if (pi.status === 'succeeded') {
        const admin = createAdminClient()

        // Only update if still pending (idempotent — safe to run twice)
        const { data: existingOrder } = await admin
          .from('orders')
          .select('status')
          .eq('id', id)
          .single()

        if (existingOrder?.status === 'pending') {
          await admin.from('payments').update({
            status: 'success',
            transaction_id: pi.id,
            gateway_response: { stripe_status: pi.status } as any,
          }).eq('order_id', id).eq('gateway', 'stripe')

          await admin.from('orders').update({ status: 'paid' }).eq('id', id)

          // Fire-and-forget eSIM delivery
          deliverESIM(id).catch(console.error)
        }
      }
    } catch (err) {
      console.error('[order page] Stripe redirect verification failed:', err)
    }
  }

  // ── Fetch final order state (after any updates above) ────────
  const supabase = createServiceClient()

  const { data: order } = await supabase
    .from('orders')
    .select('*, customers(*), plans(*)')
    .eq('id', id)
    .single()

  if (!order) notFound()

  return <OrderClient order={order as any} />
}
