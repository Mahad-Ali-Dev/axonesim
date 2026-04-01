import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'
import { createSafepayTracker } from '@/lib/safepay'
import { stripe } from '@/lib/stripe'
import { generateOrderId } from '@/lib/utils'
import { STATIC_PLANS_BY_ID } from '@/data/plans'
import { sendOrderReceivedEmail } from '@/lib/email'

export async function POST(req: NextRequest) {
  try {
    const { planId, customer, paymentMethod, currency, amount, screenshotUrl } = await req.json()

    if (!planId || !customer?.name || !customer?.email || !customer?.phone || !paymentMethod) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const supabase = createAdminClient()

    // Resolve static plan ID (e.g. "p-5gb") to a real DB UUID
    let resolvedPlanId = planId
    if (STATIC_PLANS_BY_ID[planId]) {
      const staticPlan = STATIC_PLANS_BY_ID[planId]
      // Find matching plan in DB by data size and validity
      const { data: dbPlan } = await supabase
        .from('plans')
        .select('id')
        .eq('data_gb', staticPlan.data_gb)
        .eq('validity_days', staticPlan.validity_days)
        .single()

      if (dbPlan) {
        resolvedPlanId = dbPlan.id
      } else {
        // Plan not in DB yet — upsert it now
        const { data: inserted } = await supabase
          .from('plans')
          .insert({
            name: staticPlan.name,
            data_gb: staticPlan.data_gb,
            validity_days: staticPlan.validity_days,
            region: staticPlan.region,
            countries: staticPlan.countries,
            price_pkr: staticPlan.price_pkr,
            price_usd: staticPlan.price_usd,
            is_active: true,
            is_featured: staticPlan.is_featured,
            badge: staticPlan.badge,
            description: staticPlan.description,
          })
          .select('id')
          .single()
        if (!inserted) {
          return NextResponse.json({ error: 'Failed to resolve plan' }, { status: 500 })
        }
        resolvedPlanId = inserted.id
      }
    }

    // Upsert customer
    let customerId: string
    const { data: existingCustomer, error: fetchErr } = await supabase
      .from('customers')
      .select('id')
      .eq('email', customer.email)
      .single()

    if (fetchErr && fetchErr.code !== 'PGRST116') {
      // PGRST116 = no rows found (expected when new customer), anything else is a real error
      console.error('Customer fetch error:', fetchErr)
      return NextResponse.json({ error: 'Database error: ' + fetchErr.message }, { status: 500 })
    }

    if (existingCustomer) {
      customerId = existingCustomer.id
      await supabase.from('customers').update({
        name: customer.name,
        phone: customer.phone,
        whatsapp: customer.whatsapp || customer.phone,
      }).eq('id', customerId)
    } else {
      const { data: newCustomer, error: insertErr } = await supabase
        .from('customers')
        .insert({
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
          whatsapp: customer.whatsapp || customer.phone,
        })
        .select('id')
        .single()
      if (insertErr || !newCustomer) {
        console.error('Customer insert error:', insertErr)
        return NextResponse.json({ error: 'Failed to create customer: ' + insertErr?.message }, { status: 500 })
      }
      customerId = newCustomer.id
    }

    const orderId = generateOrderId()

    // Create order record
    const { error: orderError } = await supabase.from('orders').insert({
      id: orderId,
      customer_id: customerId,
      plan_id: resolvedPlanId,
      status: 'pending',
      payment_method: paymentMethod,
      amount_paid: amount,
      currency,
    })
    if (orderError) {
      console.error('Order insert error:', orderError)
      return NextResponse.json({ error: 'Failed to create order: ' + orderError.message }, { status: 500 })
    }

    // Create pending payment record
    const { error: paymentError } = await supabase.from('payments').insert({
      order_id: orderId,
      gateway: paymentMethod,
      amount,
      currency,
      status: 'pending',
    })
    if (paymentError) {
      console.error('Payment insert error:', paymentError)
      // non-fatal, continue
    }

    // ── SAFEPAY (PKR — JazzCash, Easypaisa, PK Cards) ──
    if (paymentMethod === 'safepay') {
      const { checkoutUrl, token } = await createSafepayTracker({
        orderId,
        amount,
        customerEmail: customer.email,
        customerName: customer.name,
      })

      await supabase.from('payments').update({
        transaction_id: token,
      }).eq('order_id', orderId).eq('gateway', 'safepay')

      return NextResponse.json({ checkoutUrl, orderId })
    }

    // ── STRIPE (USD — International cards) ──
    if (paymentMethod === 'stripe') {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100),
        currency: 'usd',
        metadata: { orderId, planId, customerId },
        description: `Axon eSIM Order ${orderId}`,
      })

      await supabase.from('payments').update({
        transaction_id: paymentIntent.id,
      }).eq('order_id', orderId).eq('gateway', 'stripe')

      return NextResponse.json({
        orderId,
        stripeClientSecret: paymentIntent.client_secret,
      })
    }

    // ── MANUAL (screenshot-based — admin verifies and delivers via WhatsApp) ──
    if (paymentMethod === 'manual') {
      if (screenshotUrl) {
        await supabase.from('payments').update({
          transaction_id: `screenshot:${screenshotUrl}`,
        }).eq('order_id', orderId).eq('gateway', 'manual')
      }

      // Fetch plan details for email
      const { data: planRow } = await supabase.from('plans').select('name,data_gb,validity_days').eq('id', resolvedPlanId).single()

      // Send order confirmation email (non-blocking)
      sendOrderReceivedEmail({
        customerName:  customer.name,
        customerEmail: customer.email,
        orderId,
        planName:      planRow?.name      ?? 'eSIM Plan',
        dataGb:        planRow?.data_gb   ?? 0,
        validityDays:  planRow?.validity_days ?? 0,
        amount,
        currency,
        screenshotUrl: screenshotUrl ?? null,
      }).catch(e => console.error('Order email error:', e))

      return NextResponse.json({ orderId })
    }

    return NextResponse.json({ error: 'Invalid payment method' }, { status: 400 })

  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e)
    console.error('Orders API error:', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
