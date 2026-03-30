import crypto from 'crypto'

const JAZZCASH_MERCHANT_ID = process.env.JAZZCASH_MERCHANT_ID!
const JAZZCASH_PASSWORD = process.env.JAZZCASH_PASSWORD!
const JAZZCASH_INTEGRITY_SALT = process.env.JAZZCASH_INTEGRITY_SALT!

const JAZZCASH_URL = process.env.NODE_ENV === 'production'
  ? 'https://payments.jazzcash.com.pk/CustomerPortal/transactionmanagement/merchantform/'
  : 'https://sandbox.jazzcash.com.pk/CustomerPortal/transactionmanagement/merchantform/'

interface JazzCashPayload {
  orderId: string
  amount: number // in paisas (multiply PKR by 100)
  description: string
  customerMobile: string
  returnUrl: string
}

function generateHash(params: Record<string, string>): string {
  // Sort params alphabetically and build hash string
  const sorted = Object.keys(params).sort().map(k => params[k]).join('&')
  const hashString = `${JAZZCASH_INTEGRITY_SALT}&${sorted}`
  return crypto.createHmac('sha256', JAZZCASH_INTEGRITY_SALT).update(hashString).digest('hex')
}

export function buildJazzCashForm(payload: JazzCashPayload) {
  const now = new Date()
  const txnDateTime = now.toISOString().replace(/[-:T]/g, '').slice(0, 14)
  const expireDateTime = new Date(now.getTime() + 30 * 60 * 1000)
    .toISOString().replace(/[-:T]/g, '').slice(0, 14)

  const params: Record<string, string> = {
    pp_Version: '1.1',
    pp_TxnType: 'MWALLET',
    pp_Language: 'EN',
    pp_MerchantID: JAZZCASH_MERCHANT_ID,
    pp_Password: JAZZCASH_PASSWORD,
    pp_TxnRefNo: payload.orderId,
    pp_Amount: String(payload.amount * 100),
    pp_TxnCurrency: 'PKR',
    pp_TxnDateTime: txnDateTime,
    pp_BillReference: payload.orderId,
    pp_Description: payload.description,
    pp_TxnExpiryDateTime: expireDateTime,
    pp_ReturnURL: payload.returnUrl,
    pp_MobileNumber: payload.customerMobile,
    ppmpf_1: '',
    ppmpf_2: '',
    ppmpf_3: '',
    ppmpf_4: '',
    ppmpf_5: '',
  }

  params.pp_SecureHash = generateHash(params)

  return { url: JAZZCASH_URL, params }
}

export function verifyJazzCashCallback(params: Record<string, string>): boolean {
  const receivedHash = params.pp_SecureHash
  const { pp_SecureHash: _, ...rest } = params
  const expectedHash = generateHash(rest)
  return receivedHash === expectedHash
}
