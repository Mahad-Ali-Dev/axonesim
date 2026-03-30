import twilio from 'twilio'

function getClient() {
  return twilio(
    process.env.TWILIO_ACCOUNT_SID!,
    process.env.TWILIO_AUTH_TOKEN!
  )
}

const FROM = process.env.TWILIO_WHATSAPP_FROM!

interface WhatsAppOrderData {
  customerPhone: string // format: +923001234567
  customerName: string
  orderId: string
  planName: string
  dataGb: number
  validityDays: number
  qrCodeUrl: string
  activationGuideUrl: string
}

export async function sendOrderWhatsApp(data: WhatsAppOrderData) {
  const to = `whatsapp:${data.customerPhone}`

  return getClient().messages.create({
    from: FROM,
    to,
    body: `🌐 *Axon eSIM — Your eSIM is Ready!*\n\nHi ${data.customerName}! Your order *${data.orderId}* is confirmed.\n\n📦 *Plan:* ${data.planName}\n📶 *Data:* ${data.dataGb} GB\n⏱ *Validity:* ${data.validityDays} days\n\n📲 *How to activate:*\n1. Go to Settings > Cellular > Add eSIM\n2. Scan the QR code below\n\n🔗 *QR Code:* ${data.qrCodeUrl}\n\n📖 *Activation Guide:* ${data.activationGuideUrl}\n\nNeed help? Just reply here! ✅`,
  })
}
