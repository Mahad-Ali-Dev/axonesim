import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createAdminClient } from '@/lib/supabase' // eslint-disable-line
import { deliverESIM } from '@/lib/esim'
import Stripe from 'stripe'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 })
  }

  if (event.type === 'payment_intent.succeeded') {
    const pi = event.data.object as Stripe.PaymentIntent
    const orderId = pi.metadata.orderId
    const supabase = createAdminClient()

    await supabase.from('payments').update({
      status: 'success',
      transaction_id: pi.id,
      gateway_response: pi as any,
    }).eq('order_id', orderId)

    await supabase.from('orders').update({ status: 'paid' }).eq('id', orderId)
    deliverESIM(orderId).catch(console.error)
  }

  if (event.type === 'payment_intent.payment_failed') {
    const pi = event.data.object as Stripe.PaymentIntent
    const orderId = pi.metadata.orderId
    const supabase = createAdminClient()
    await supabase.from('payments').update({ status: 'failed' }).eq('order_id', orderId)
  }

  return NextResponse.json({ received: true })
}
