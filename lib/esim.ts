import { createAdminClient } from '@/lib/supabase'
import { sendOrderConfirmationEmail } from '@/lib/email'
import { sendOrderWhatsApp } from '@/lib/whatsapp'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL!

/**
 * Main eSIM delivery function.
 * Called after payment is confirmed.
 *
 * In production: integrate with your eSIM provider API
 * (e.g., Airalo, eSIM Access, BSCS) to generate real QR codes.
 * For now, uses a placeholder QR generator.
 */
export async function deliverESIM(orderId: string): Promise<void> {
  const supabase = createAdminClient()

  // Mark as processing
  await supabase.from('orders').update({ status: 'processing' }).eq('id', orderId)

  // Fetch order with customer + plan
  const { data: order, error } = await supabase
    .from('orders')
    .select('*, customers(*), plans(*)')
    .eq('id', orderId)
    .single()

  if (error || !order) throw new Error(`Order ${orderId} not found`)

  // Generate eSIM code (replace with real API call to your eSIM provider)
  const esimCode = await generateESIMCode(order.plans.region, order.plans.data_gb, order.plans.validity_days)

  // Generate QR code URL (replace with real QR from eSIM provider)
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(esimCode)}`

  // Calculate expiry
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + order.plans.validity_days)

  // Update order with eSIM details
  await supabase.from('orders').update({
    status: 'delivered',
    qr_code_url: qrCodeUrl,
    esim_code: esimCode,
    expires_at: expiresAt.toISOString(),
  }).eq('id', orderId)

  // Send email
  try {
    await sendOrderConfirmationEmail({
      customerName: order.customers.name,
      customerEmail: order.customers.email,
      orderId,
      planName: order.plans.name,
      dataGb: order.plans.data_gb,
      validityDays: order.plans.validity_days,
      qrCodeUrl,
      esimCode,
      activationGuideUrl: `${APP_URL}/activate`,
    })
  } catch (e) {
    console.error('Email send failed:', e)
  }

  // Send WhatsApp
  const whatsappNumber = order.customers.whatsapp || order.customers.phone
  if (whatsappNumber) {
    try {
      await sendOrderWhatsApp({
        customerPhone: whatsappNumber.startsWith('+') ? whatsappNumber : `+${whatsappNumber.replace(/\D/g, '')}`,
        customerName: order.customers.name,
        orderId,
        planName: order.plans.name,
        dataGb: order.plans.data_gb,
        validityDays: order.plans.validity_days,
        qrCodeUrl,
        activationGuideUrl: `${APP_URL}/activate`,
      })
    } catch (e) {
      console.error('WhatsApp send failed:', e)
    }
  }
}

/**
 * Generates an eSIM activation code.
 *
 * REPLACE THIS with your actual eSIM provider API call.
 * Popular providers: Airalo API, eSIM Access, Twilio Wireless
 *
 * The activation code format varies by provider.
 * A real LPA string looks like: LPA:1$smdp.example.com$MATCHING-ID
 */
async function generateESIMCode(region: string, dataGb: number, validityDays: number): Promise<string> {
  // Placeholder — replace with real eSIM provider API
  // Example with Airalo:
  // const response = await fetch('https://sandbox.airalo.com/v2/orders', {
  //   method: 'POST',
  //   headers: {
  //     'Authorization': `Bearer ${process.env.AIRALO_API_KEY}`,
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({ package_id: getAiraloPackageId(region, dataGb, validityDays), quantity: 1 })
  // })
  // const data = await response.json()
  // return data.data[0].lpa  // LPA activation string

  const mockCode = `LPA:1$axonesim.smdpplus.net$${region.toUpperCase().replace(/\s/g, '')}-${dataGb}GB-${validityDays}D-${Date.now().toString(36).toUpperCase()}`
  return mockCode
}
