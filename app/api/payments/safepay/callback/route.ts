import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'
import { verifySafepayPayment } from '@/lib/safepay'
import { deliverESIM } from '@/lib/esim'

/**
 * Safepay redirects customer back here after payment attempt.
 * URL: /api/payments/safepay/callback?order_id=AXN-xxx&tracker=token
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const orderId = searchParams.get('order_id')
  const appUrl = process.env.NEXT_PUBLIC_APP_URL!

  if (!orderId) {
    return NextResponse.redirect(`${appUrl}/?error=missing_order`)
  }

  const supabase = createAdminClient()

  // Get the tracker token we stored during order creation
  const { data: payment } = await supabase
    .from('payments')
    .select('transaction_id')
    .eq('order_id', orderId)
    .eq('gateway', 'safepay')
    .single()

  if (!payment?.transaction_id) {
    return NextResponse.redirect(`${appUrl}/order/${orderId}?error=no_tracker`)
  }

  // Verify payment status with Safepay API
  const { success, status, transactionId } = await verifySafepayPayment(payment.transaction_id)

  await supabase.from('payments').update({
    status: success ? 'success' : 'failed',
    transaction_id: transactionId ?? payment.transaction_id,
    gateway_response: { status } as any,
  }).eq('order_id', orderId).eq('gateway', 'safepay')

  if (success) {
    await supabase.from('orders').update({ status: 'paid' }).eq('id', orderId)
    // Deliver eSIM asynchronously
    deliverESIM(orderId).catch(console.error)
  }

  return NextResponse.redirect(`${appUrl}/order/${orderId}`)
}
