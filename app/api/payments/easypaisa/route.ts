import { NextRequest, NextResponse } from 'next/server'
import { verifyEasypaisaCallback } from '@/lib/easypaisa'
import { createAdminClient } from '@/lib/supabase' // eslint-disable-line
import { deliverESIM } from '@/lib/esim'

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const params: Record<string, string> = {}
  formData.forEach((val, key) => { params[key] = String(val) })

  const appUrl = process.env.NEXT_PUBLIC_APP_URL!
  const orderId = params.orderId
  const status = params.transactionStatus

  if (!verifyEasypaisaCallback(params)) {
    return NextResponse.redirect(`${appUrl}/order/${orderId}?error=invalid_signature`)
  }

  const supabase = createAdminClient()
  const isSuccess = status === 'SUCCESS'

  await supabase.from('payments').update({
    status: isSuccess ? 'success' : 'failed',
    transaction_id: params.transactionId,
    gateway_response: params as any,
  }).eq('order_id', orderId)

  if (isSuccess) {
    await supabase.from('orders').update({ status: 'paid' }).eq('id', orderId)
    deliverESIM(orderId).catch(console.error)
  }

  return NextResponse.redirect(`${appUrl}/order/${orderId}`)
}

export async function GET(req: NextRequest) {
  return POST(req)
}
