'use client'
import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { Loader2, Lock, Shield } from 'lucide-react'

const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
const stripePromise = publishableKey ? loadStripe(publishableKey) : null

function PaymentForm({ orderId }: { orderId: string }) {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!stripe || !elements) return

    setLoading(true)
    setError('')

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/order/${orderId}`,
      },
    })

    // If we reach here, confirmPayment failed (redirect didn't happen)
    if (error) {
      setError(error.message ?? 'Payment failed. Please try again.')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <PaymentElement options={{ layout: 'tabs' }} />

      {error && (
        <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
          <Shield className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || loading}
        className="btn-primary w-full py-4 rounded-xl flex items-center justify-center gap-2 text-base glow-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <><Loader2 className="w-5 h-5 animate-spin" /> Processing payment…</>
        ) : (
          <>
            <Lock className="w-4 h-4" /> Confirm Payment
          </>
        )}
      </button>

      <div className="flex items-center justify-center gap-2 text-xs text-slate-600">
        <Lock className="w-3.5 h-3.5" />
        Secured by Stripe · 256-bit SSL encryption
      </div>
    </form>
  )
}

export default function StripePaymentForm({
  clientSecret,
  orderId,
}: {
  clientSecret: string
  orderId: string
}) {
  if (!publishableKey) {
    return (
      <div className="card border-red-500/30 rounded-2xl p-6 mb-5 text-center">
        <p className="text-red-400 text-sm font-semibold">Stripe is not configured.</p>
        <p className="text-slate-500 text-xs mt-1">Set <code className="text-slate-300">NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY</code> in your environment variables.</p>
      </div>
    )
  }

  return (
    <div className="card border-violet-500/30 rounded-2xl p-6 mb-5">
      <h2 className="font-bold text-lg flex items-center gap-2.5 mb-6">
        <div className="w-7 h-7 rounded-full bg-violet-600/20 text-violet-400 border border-violet-500/30 flex items-center justify-center text-xs font-black">
          <Lock className="w-3.5 h-3.5" />
        </div>
        Enter Payment Details
      </h2>
      <Elements
        stripe={stripePromise}
        options={{
          clientSecret,
          appearance: {
            theme: 'night',
            variables: {
              colorPrimary: '#7c3aed',
              colorBackground: '#0f0f17',
              colorText: '#e2e8f0',
              colorDanger: '#f87171',
              borderRadius: '12px',
              fontFamily: 'inherit',
            },
          },
        }}
      >
        <PaymentForm orderId={orderId} />
      </Elements>
    </div>
  )
}
