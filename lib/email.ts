import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY!)
const FROM = process.env.RESEND_FROM_EMAIL!

interface OrderEmailData {
  customerName: string
  customerEmail: string
  orderId: string
  planName: string
  dataGb: number
  validityDays: number
  qrCodeUrl: string
  esimCode: string
  activationGuideUrl: string
}

export async function sendOrderConfirmationEmail(data: OrderEmailData) {
  return resend.emails.send({
    from: FROM,
    to: data.customerEmail,
    subject: `Your Axon eSIM is Ready — Order ${data.orderId}`,
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="font-family:sans-serif;background:#0f0f0f;color:#fff;margin:0;padding:0">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px">
    <div style="text-align:center;margin-bottom:32px">
      <h1 style="color:#00d4ff;font-size:28px;margin:0">Axon eSIM</h1>
      <p style="color:#888;margin-top:8px">Your eSIM is ready to activate!</p>
    </div>

    <div style="background:#1a1a1a;border-radius:16px;padding:32px;margin-bottom:24px">
      <h2 style="margin:0 0 8px;font-size:18px">Hi ${data.customerName},</h2>
      <p style="color:#aaa;margin-top:8px">Your order <strong style="color:#00d4ff">${data.orderId}</strong> has been confirmed.</p>

      <div style="background:#111;border-radius:12px;padding:20px;margin:24px 0">
        <div style="display:flex;justify-content:space-between;margin-bottom:12px">
          <span style="color:#888">Plan</span>
          <span style="font-weight:600">${data.planName}</span>
        </div>
        <div style="display:flex;justify-content:space-between;margin-bottom:12px">
          <span style="color:#888">Data</span>
          <span style="font-weight:600">${data.dataGb} GB</span>
        </div>
        <div style="display:flex;justify-content:space-between">
          <span style="color:#888">Validity</span>
          <span style="font-weight:600">${data.validityDays} days</span>
        </div>
      </div>

      <div style="text-align:center;margin:32px 0">
        <p style="color:#888;margin-bottom:16px">Scan this QR code in your phone's eSIM settings</p>
        <img src="${data.qrCodeUrl}" alt="eSIM QR Code" style="width:200px;height:200px;border-radius:12px;border:4px solid #00d4ff">
      </div>

      <div style="background:#111;border-radius:12px;padding:16px;text-align:center">
        <p style="color:#888;margin:0 0 8px;font-size:12px">ACTIVATION CODE</p>
        <code style="color:#00d4ff;font-size:13px;word-break:break-all">${data.esimCode}</code>
      </div>
    </div>

    <div style="text-align:center">
      <a href="${data.activationGuideUrl}" style="display:inline-block;background:#00d4ff;color:#000;font-weight:700;padding:14px 32px;border-radius:50px;text-decoration:none">
        View Activation Guide
      </a>
    </div>

    <p style="text-align:center;color:#555;font-size:12px;margin-top:32px">
      Need help? Reply to this email or WhatsApp us at +92 311 0000000
    </p>
  </div>
</body>
</html>
    `,
  })
}
