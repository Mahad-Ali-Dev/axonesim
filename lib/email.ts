import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY!)
const FROM   = process.env.RESEND_FROM_EMAIL ?? 'order@axonesim.com'
const SUPPORT_WA = '+92 334 9542871'
const SITE_URL   = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://axonesim.com'

// ─── 1. Order received — sent immediately after checkout ────────────────────
export async function sendOrderReceivedEmail(data: {
  customerName:  string
  customerEmail: string
  orderId:       string
  planName:      string
  dataGb:        number
  validityDays:  number
  amount:        number
  currency:      string
  screenshotUrl: string | null
}) {
  const amountStr = data.currency === 'PKR'
    ? `Rs ${data.amount.toLocaleString()}`
    : `$${data.amount} USD`

  return resend.emails.send({
    from:    FROM,
    to:      data.customerEmail,
    subject: `Order Confirmed — ${data.orderId} | Axon eSIM`,
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#f8f9fa;margin:0;padding:0">
  <div style="max-width:580px;margin:0 auto;padding:40px 16px">

    <!-- Logo / Brand -->
    <div style="text-align:center;margin-bottom:32px">
      <h1 style="margin:0;font-size:24px;font-weight:900;color:#7c3aed;letter-spacing:-0.5px">Axon eSIM</h1>
      <p style="color:#6c757d;margin:4px 0 0;font-size:13px">Instant Global Connectivity</p>
    </div>

    <!-- Main card -->
    <div style="background:#fff;border-radius:20px;box-shadow:0 2px 16px rgba(0,0,0,0.06);overflow:hidden;margin-bottom:16px">

      <!-- Green header -->
      <div style="background:linear-gradient(135deg,#7c3aed,#4f46e5);padding:32px 32px 28px;text-align:center">
        <div style="font-size:40px;margin-bottom:8px">🎉</div>
        <h2 style="color:#fff;margin:0;font-size:22px;font-weight:900">Order Confirmed!</h2>
        <p style="color:rgba(255,255,255,0.8);margin:8px 0 0;font-size:14px">
          Thank you, ${data.customerName}. We've received your order.
        </p>
      </div>

      <!-- Body -->
      <div style="padding:28px 32px">

        <!-- Order ID badge -->
        <div style="background:#f3f4f6;border-radius:12px;padding:16px 20px;margin-bottom:24px;text-align:center">
          <p style="margin:0;font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:1px;font-weight:600">Your Order ID</p>
          <p style="margin:8px 0 0;font-size:22px;font-weight:900;color:#1f2937;font-family:monospace">${data.orderId}</p>
          <p style="margin:6px 0 0;font-size:12px;color:#9ca3af">Keep this for tracking your eSIM</p>
        </div>

        <!-- Plan details -->
        <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;color:#6b7280;font-size:14px">Plan</td>
            <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;text-align:right;font-weight:700;color:#1f2937;font-size:14px">${data.planName}</td>
          </tr>
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;color:#6b7280;font-size:14px">Data</td>
            <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;text-align:right;font-weight:700;color:#1f2937;font-size:14px">${data.dataGb} GB</td>
          </tr>
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;color:#6b7280;font-size:14px">Validity</td>
            <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;text-align:right;font-weight:700;color:#1f2937;font-size:14px">${data.validityDays} days</td>
          </tr>
          <tr>
            <td style="padding:10px 0;color:#6b7280;font-size:14px">Amount Paid</td>
            <td style="padding:10px 0;text-align:right;font-weight:900;color:#7c3aed;font-size:16px">${amountStr}</td>
          </tr>
        </table>

        <!-- Screenshot invoice link -->
        ${data.screenshotUrl ? `
        <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:14px 18px;margin-bottom:24px">
          <p style="margin:0;font-size:13px;color:#16a34a;font-weight:600">📎 Payment Receipt</p>
          <a href="${data.screenshotUrl}" style="display:inline-block;margin-top:6px;font-size:12px;color:#15803d;text-decoration:underline">
            View uploaded payment screenshot →
          </a>
        </div>` : ''}

        <!-- What happens next -->
        <div style="background:#faf5ff;border-radius:12px;padding:18px 20px;margin-bottom:24px">
          <p style="margin:0 0 12px;font-size:13px;font-weight:700;color:#7c3aed;text-transform:uppercase;letter-spacing:0.5px">What happens next</p>
          <div style="display:flex;align-items:flex-start;gap:10px;margin-bottom:10px">
            <span style="font-size:18px">🔍</span>
            <div><p style="margin:0;font-size:13px;font-weight:600;color:#1f2937">Payment verified</p><p style="margin:2px 0 0;font-size:12px;color:#6b7280">We check your screenshot — usually under 2 minutes</p></div>
          </div>
          <div style="display:flex;align-items:flex-start;gap:10px;margin-bottom:10px">
            <span style="font-size:18px">📲</span>
            <div><p style="margin:0;font-size:13px;font-weight:600;color:#1f2937">eSIM sent via WhatsApp</p><p style="margin:2px 0 0;font-size:12px;color:#6b7280">Your QR code will be sent to your WhatsApp number</p></div>
          </div>
          <div style="display:flex;align-items:flex-start;gap:10px">
            <span style="font-size:18px">✅</span>
            <div><p style="margin:0;font-size:13px;font-weight:600;color:#1f2937">Scan &amp; connect</p><p style="margin:2px 0 0;font-size:12px;color:#6b7280">Settings → Cellular → Add eSIM → Scan QR</p></div>
          </div>
        </div>

        <!-- CTA buttons -->
        <div style="text-align:center;margin-bottom:8px">
          <a href="${SITE_URL}/order/${data.orderId}" style="display:inline-block;background:linear-gradient(135deg,#7c3aed,#4f46e5);color:#fff;font-weight:700;padding:14px 28px;border-radius:50px;text-decoration:none;font-size:14px;margin-bottom:10px">
            Track Your Order →
          </a>
        </div>
        <div style="text-align:center">
          <a href="https://wa.me/923349542871?text=Hi! My order ID is ${data.orderId}" style="display:inline-block;background:#25d366;color:#fff;font-weight:700;padding:12px 24px;border-radius:50px;text-decoration:none;font-size:13px">
            💬 WhatsApp Support — ${SUPPORT_WA}
          </a>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <p style="text-align:center;color:#9ca3af;font-size:12px;margin:0">
      © ${new Date().getFullYear()} Axon Telecom · A project by Tase LLC<br>
      <a href="mailto:supportaxonesim@gmail.com" style="color:#9ca3af">supportaxonesim@gmail.com</a>
    </p>
  </div>
</body>
</html>`,
  })
}

// ─── 2. eSIM delivered — sent when admin sets QR + activation code ───────────
export async function sendESIMDeliveryEmail(data: {
  customerName:  string
  customerEmail: string
  orderId:       string
  planName:      string
  dataGb:        number
  validityDays:  number
  qrCodeUrl:     string
  esimCode:      string
}) {
  return resend.emails.send({
    from:    FROM,
    to:      data.customerEmail,
    subject: `Your eSIM is Ready! — ${data.orderId} | Axon eSIM`,
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#f8f9fa;margin:0;padding:0">
  <div style="max-width:580px;margin:0 auto;padding:40px 16px">

    <div style="text-align:center;margin-bottom:32px">
      <h1 style="margin:0;font-size:24px;font-weight:900;color:#7c3aed">Axon eSIM</h1>
    </div>

    <div style="background:#fff;border-radius:20px;box-shadow:0 2px 16px rgba(0,0,0,0.06);overflow:hidden;margin-bottom:16px">

      <div style="background:linear-gradient(135deg,#059669,#10b981);padding:32px;text-align:center">
        <div style="font-size:40px;margin-bottom:8px">📱</div>
        <h2 style="color:#fff;margin:0;font-size:22px;font-weight:900">Your eSIM is Ready!</h2>
        <p style="color:rgba(255,255,255,0.85);margin:8px 0 0;font-size:14px">
          Hi ${data.customerName}, your eSIM for <strong>${data.planName}</strong> is activated.
        </p>
      </div>

      <div style="padding:28px 32px">

        <!-- QR Code (only when provided) -->
        ${data.qrCodeUrl ? `
        <div style="text-align:center;margin-bottom:28px">
          <p style="margin:0 0 16px;font-size:13px;color:#6b7280;font-weight:600;text-transform:uppercase;letter-spacing:0.5px">Scan this QR code to install your eSIM</p>
          <div style="display:inline-block;background:#fff;padding:16px;border-radius:16px;border:2px solid #e5e7eb;box-shadow:0 4px 12px rgba(0,0,0,0.08)">
            <img src="${data.qrCodeUrl}" alt="eSIM QR Code" width="220" height="220" style="display:block;border-radius:8px">
          </div>
          <p style="margin:10px 0 0;font-size:11px;color:#9ca3af">If the QR doesn't load, right-click → Open image in new tab</p>
        </div>` : ''}

        <!-- Activation steps (only shown when QR is provided) -->
        ${data.qrCodeUrl ? `
        <div style="background:#f0fdf4;border-radius:12px;padding:18px 20px;margin-bottom:24px">
          <p style="margin:0 0 12px;font-size:13px;font-weight:700;color:#059669;text-transform:uppercase;letter-spacing:0.5px">How to install</p>
          ${['Go to Settings → Cellular / Mobile Data', 'Tap "Add eSIM" or "Add Data Plan"', 'Scan the QR code above', 'Follow prompts to activate'].map((s, i) => `
          <div style="display:flex;gap:10px;align-items:flex-start;margin-bottom:8px">
            <span style="background:#059669;color:#fff;font-weight:700;font-size:11px;width:20px;height:20px;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;text-align:center;line-height:20px">${i+1}</span>
            <p style="margin:0;font-size:13px;color:#1f2937;line-height:1.4">${s}</p>
          </div>`).join('')}
        </div>` : ''}

        <!-- Manual Activation Code (only when provided) -->
        ${data.esimCode ? `
        <div style="background:#1e1b4b;border-radius:12px;padding:18px 20px;margin-bottom:24px">
          <p style="margin:0 0 8px;font-size:11px;color:#a5b4fc;text-transform:uppercase;letter-spacing:1px;font-weight:600">Manual Activation Code</p>
          <code style="color:#34d399;font-size:13px;word-break:break-all;line-height:1.6">${data.esimCode}</code>
        </div>` : ''}

        <!-- Plan info -->
        <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
          <tr>
            <td style="padding:8px 0;border-bottom:1px solid #f3f4f6;color:#6b7280;font-size:13px">Order ID</td>
            <td style="padding:8px 0;border-bottom:1px solid #f3f4f6;text-align:right;font-weight:700;color:#1f2937;font-size:13px;font-family:monospace">${data.orderId}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;border-bottom:1px solid #f3f4f6;color:#6b7280;font-size:13px">Plan</td>
            <td style="padding:8px 0;border-bottom:1px solid #f3f4f6;text-align:right;font-weight:700;color:#1f2937;font-size:13px">${data.planName}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#6b7280;font-size:13px">Validity</td>
            <td style="padding:8px 0;text-align:right;font-weight:700;color:#1f2937;font-size:13px">${data.dataGb} GB · ${data.validityDays} days</td>
          </tr>
        </table>

        <div style="text-align:center">
          <a href="${SITE_URL}/activate" style="display:inline-block;background:linear-gradient(135deg,#059669,#10b981);color:#fff;font-weight:700;padding:14px 28px;border-radius:50px;text-decoration:none;font-size:14px;margin-bottom:10px">
            Full Setup Guide →
          </a><br>
          <a href="https://wa.me/923349542871?text=Hi! Need help with my eSIM order ${data.orderId}" style="display:inline-block;margin-top:10px;color:#059669;font-size:13px;text-decoration:none;font-weight:600">
            💬 Need help? WhatsApp ${SUPPORT_WA}
          </a>
        </div>
      </div>
    </div>

    <p style="text-align:center;color:#9ca3af;font-size:12px;margin:0">
      © ${new Date().getFullYear()} Axon Telecom · A project by Tase LLC
    </p>
  </div>
</body>
</html>`,
  })
}
