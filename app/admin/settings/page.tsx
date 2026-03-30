import { CheckCircle2 } from 'lucide-react'

const CONFIG_GROUPS = [
  {
    title: 'Payment Gateways',
    items: [
      { key: 'JAZZCASH_MERCHANT_ID', label: 'JazzCash Merchant ID', secret: false },
      { key: 'JAZZCASH_PASSWORD', label: 'JazzCash Password', secret: true },
      { key: 'JAZZCASH_INTEGRITY_SALT', label: 'JazzCash Integrity Salt', secret: true },
      { key: 'EASYPAISA_STORE_ID', label: 'Easypaisa Store ID', secret: false },
      { key: 'EASYPAISA_HASH_KEY', label: 'Easypaisa Hash Key', secret: true },
      { key: 'STRIPE_SECRET_KEY', label: 'Stripe Secret Key', secret: true },
      { key: 'STRIPE_WEBHOOK_SECRET', label: 'Stripe Webhook Secret', secret: true },
    ]
  },
  {
    title: 'Email & Notifications',
    items: [
      { key: 'RESEND_API_KEY', label: 'Resend API Key', secret: true },
      { key: 'RESEND_FROM_EMAIL', label: 'From Email', secret: false },
      { key: 'TWILIO_ACCOUNT_SID', label: 'Twilio Account SID', secret: false },
      { key: 'TWILIO_AUTH_TOKEN', label: 'Twilio Auth Token', secret: true },
      { key: 'TWILIO_WHATSAPP_FROM', label: 'WhatsApp From Number', secret: false },
    ]
  },
]

function isConfigured(key: string): boolean {
  // Server-side check — in client we can only show if set
  return false
}

export default function SettingsPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black mb-1">Settings</h1>
        <p className="text-gray-500 text-sm">Configuration reference</p>
      </div>

      <div className="bg-yellow-400/5 border border-yellow-400/20 rounded-2xl p-4 mb-6 text-sm text-yellow-300">
        ⚠️ All sensitive keys are configured via <code className="font-mono bg-yellow-400/10 px-1.5 py-0.5 rounded">.env.local</code> file (not stored in database for security).
        Deploy environment variables on Vercel under Project Settings → Environment Variables.
      </div>

      <div className="space-y-6">
        {CONFIG_GROUPS.map(group => (
          <div key={group.title} className="bg-[#111] border border-white/5 rounded-2xl p-5">
            <h2 className="font-semibold mb-4 text-sm text-gray-400 uppercase tracking-wider">{group.title}</h2>
            <div className="space-y-3">
              {group.items.map(item => (
                <div key={item.key} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                  <div>
                    <div className="text-sm font-medium">{item.label}</div>
                    <code className="text-xs text-gray-600 font-mono">{item.key}</code>
                  </div>
                  <div className="text-xs text-gray-600 flex items-center gap-1">
                    {item.secret ? '••••••••' : 'Set in .env.local'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-[#111] border border-white/5 rounded-2xl p-5 mt-6">
        <h2 className="font-semibold mb-4 text-sm text-gray-400 uppercase tracking-wider">Quick Setup Checklist</h2>
        <div className="space-y-2">
          {[
            'Create Supabase project and run supabase-schema.sql',
            'Set NEXT_PUBLIC_SUPABASE_URL and keys in .env.local',
            'Create JazzCash merchant account and add credentials',
            'Create Easypaisa merchant account and add credentials',
            'Create Stripe account and add keys',
            'Create Resend account and verify sending domain',
            'Set up Twilio WhatsApp sandbox or business account',
            'Deploy to Vercel and add all env vars',
            'Set Stripe webhook URL to: axonesim.com/api/payments/stripe',
            'Set JazzCash return URL to: axonesim.com/api/payments/jazzcash',
            'Set Easypaisa return URL to: axonesim.com/api/payments/easypaisa',
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-2 text-sm text-gray-400">
              <CheckCircle2 className="w-4 h-4 text-gray-600 flex-shrink-0 mt-0.5" />
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
