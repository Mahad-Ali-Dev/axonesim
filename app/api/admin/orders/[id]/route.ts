import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase' // eslint-disable-line
import { deliverESIM } from '@/lib/esim'
import { sendESIMDeliveryEmail } from '@/lib/email'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json()
  const { action } = body
  const supabase = createAdminClient()

  try {
    switch (action) {
      case 'deliver':
        await deliverESIM(id)
        return NextResponse.json({ message: 'eSIM delivered successfully' })

      case 'resend':
        await deliverESIM(id)
        return NextResponse.json({ message: 'eSIM resent successfully' })

      case 'markActivated':
        await (supabase.from('orders') as any).update({
          status: 'activated',
          activated_at: new Date().toISOString(),
        }).eq('id', id)
        return NextResponse.json({ message: 'Order marked as activated' })

      case 'cancel':
        await (supabase.from('orders') as any).update({ status: 'cancelled' }).eq('id', id)
        return NextResponse.json({ message: 'Order cancelled' })

      // ── Manual eSIM entry by admin ──────────────────────────────────────────
      case 'setEsim': {
        const { qrCodeUrl, esimCode } = body
        // Both fields are optional — at least one must be present
        if (!qrCodeUrl && !esimCode) {
          return NextResponse.json({ error: 'Provide at least a QR image/URL or an activation code' }, { status: 400 })
        }

        // Save to order
        await (supabase.from('orders') as any).update({
          qr_code_url: qrCodeUrl  || null,
          esim_code:   esimCode   || null,
          status:      'delivered',
          delivered_at: new Date().toISOString(),
        }).eq('id', id)

        // Fetch order + customer + plan for email
        const { data: orderRow } = await (supabase.from('orders') as any)
          .select('*, customers(*), plans(*)')
          .eq('id', id)
          .single()

        if (orderRow?.customers?.email) {
          sendESIMDeliveryEmail({
            customerName:  orderRow.customers.name,
            customerEmail: orderRow.customers.email,
            orderId:       id,
            planName:      orderRow.plans?.name         ?? 'eSIM Plan',
            dataGb:        orderRow.plans?.data_gb      ?? 0,
            validityDays:  orderRow.plans?.validity_days ?? 0,
            qrCodeUrl:     qrCodeUrl  || '',
            esimCode:      esimCode   || '',
          }).catch(e => console.error('Delivery email error:', e))
        }

        return NextResponse.json({ message: 'eSIM saved and order marked as delivered. Email sent to customer.' })
      }

      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
    }
  } catch (e) {
    console.error('Admin order action error:', e)
    return NextResponse.json({ error: 'Action failed' }, { status: 500 })
  }
}
