import crypto from 'crypto'

const EASYPAISA_STORE_ID = process.env.EASYPAISA_STORE_ID!
const EASYPAISA_HASH_KEY = process.env.EASYPAISA_HASH_KEY!

const EASYPAISA_URL = process.env.NODE_ENV === 'production'
  ? 'https://easypaisa.com.pk/easypay/Index.jsf'
  : 'https://easypaisa.com.pk/easypay-sandbox/Index.jsf'

interface EasypaisaPayload {
  orderId: string
  amount: number // PKR
  customerEmail: string
  description: string
  returnUrl: string
}

function md5Hash(str: string): string {
  return crypto.createHash('md5').update(str).digest('hex')
}

export function buildEasypaisaForm(payload: EasypaisaPayload) {
  const params: Record<string, string> = {
    storeId: EASYPAISA_STORE_ID,
    orderId: payload.orderId,
    transactionAmount: payload.amount.toFixed(2),
    mobileAccountNo: '',
    emailAddress: payload.customerEmail,
    transactionType: 'InitialRequest',
    tokenExpiry: '',
    bankIdentificationNumber: '',
    encryptedHashRequest: '',
    merchantPaymentMethod: '',
    postBackURL: payload.returnUrl,
    signature: '',
    autoRedirect: '1',
  }

  // Easypaisa signature: MD5 of specific fields in order
  const sigString = [
    payload.amount.toFixed(2),
    payload.customerEmail,
    EASYPAISA_HASH_KEY,
    payload.orderId,
    payload.returnUrl,
    EASYPAISA_STORE_ID,
    'InitialRequest',
  ].join('&')

  params.signature = md5Hash(sigString)

  return { url: EASYPAISA_URL, params }
}

export function verifyEasypaisaCallback(params: Record<string, string>): boolean {
  const receivedSig = params.signature
  const sigString = [
    params.transactionAmount,
    params.emailAddress,
    EASYPAISA_HASH_KEY,
    params.orderId,
    params.postBackURL,
    EASYPAISA_STORE_ID,
    'InitialRequest',
  ].join('&')
  return receivedSig === md5Hash(sigString)
}
