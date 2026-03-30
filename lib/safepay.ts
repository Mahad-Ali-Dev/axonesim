/**
 * Safepay Payment Integration
 * Handles PKR payments via JazzCash, Easypaisa, and Pakistani debit/credit cards
 * Docs: https://docs.getsafepay.com
 */

const SAFEPAY_PUBLIC_KEY = process.env.SAFEPAY_PUBLIC_KEY!
const SAFEPAY_SECRET_KEY = process.env.SAFEPAY_SECRET_KEY!
const IS_SANDBOX = process.env.SAFEPAY_ENV !== 'production'

const BASE_URL = IS_SANDBOX
  ? 'https://sandbox.api.getsafepay.com'
  : 'https://api.getsafepay.com'

const CHECKOUT_URL = IS_SANDBOX
  ? 'https://sandbox.getsafepay.com/checkout'
  : 'https://getsafepay.com/checkout'

interface CreateTrackerOptions {
  orderId: string
  amount: number   // in PKR (we convert to paisa internally)
  customerEmail?: string
  customerName?: string
}

interface SafepayTracker {
  token: string
  checkoutUrl: string
}

/**
 * Step 1: Create a payment tracker on Safepay
 * Returns a tracker token used to build the checkout URL
 */
export async function createSafepayTracker(opts: CreateTrackerOptions): Promise<SafepayTracker> {
  const response = await fetch(`${BASE_URL}/order/v1/init`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-SFPY-MERCHANT-SECRET': SAFEPAY_SECRET_KEY,
    },
    body: JSON.stringify({
      client: SAFEPAY_PUBLIC_KEY,
      amount: Math.round(opts.amount * 100), // convert PKR to paisa
      currency: 'PKR',
      environment: IS_SANDBOX ? 'sandbox' : 'production',
      source: 'custom',
      metadata: {
        order_id: opts.orderId,
        customer_email: opts.customerEmail ?? '',
        customer_name: opts.customerName ?? '',
      },
    }),
  })

  if (!response.ok) {
    const err = await response.text()
    throw new Error(`Safepay tracker creation failed: ${err}`)
  }

  const data = await response.json()
  const token = data?.data?.token as string

  if (!token) throw new Error('No tracker token returned from Safepay')

  const appUrl = process.env.NEXT_PUBLIC_APP_URL!
  const env = IS_SANDBOX ? 'sandbox' : 'production'

  const checkoutUrl =
    `${CHECKOUT_URL}/?env=${env}` +
    `&beacon=${token}` +
    `&source=custom` +
    `&redirect_url=${encodeURIComponent(`${appUrl}/api/payments/safepay/callback?order_id=${opts.orderId}`)}` +
    `&cancel_url=${encodeURIComponent(`${appUrl}/order/${opts.orderId}?cancelled=1`)}`

  return { token, checkoutUrl }
}

/**
 * Step 2: Verify a completed payment by fetching tracker status
 */
export async function verifySafepayPayment(trackerToken: string): Promise<{
  success: boolean
  status: string
  transactionId: string | null
}> {
  const response = await fetch(`${BASE_URL}/order/payments/${trackerToken}`, {
    headers: {
      'X-SFPY-MERCHANT-SECRET': SAFEPAY_SECRET_KEY,
    },
  })

  if (!response.ok) {
    return { success: false, status: 'error', transactionId: null }
  }

  const data = await response.json()
  const state = data?.data?.state as string
  const transactionId = data?.data?.transaction_id ?? null

  return {
    success: state === 'paid',
    status: state,
    transactionId,
  }
}
