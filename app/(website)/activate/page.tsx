import { Smartphone, QrCode, Wifi, CheckCircle2, MessageCircle } from 'lucide-react'
import Link from 'next/link'

const steps = [
  {
    step: 1,
    icon: QrCode,
    title: 'Receive Your QR Code',
    desc: 'After payment, your eSIM QR code will be sent to you via WhatsApp and email within 2 minutes.',
  },
  {
    step: 2,
    icon: Smartphone,
    title: 'Open Phone Settings',
    desc: 'Go to Settings → Cellular (iPhone) or Settings → Connections → SIM Manager (Android).',
  },
  {
    step: 3,
    icon: QrCode,
    title: 'Add eSIM',
    desc: 'Tap "Add eSIM" or "Add Mobile Plan" and select "Use QR Code". Scan the QR code from your WhatsApp.',
  },
  {
    step: 4,
    icon: Wifi,
    title: 'Configure & Connect',
    desc: 'Set the eSIM as your data line when traveling. Keep your regular SIM for calls if needed.',
  },
]

const iPhoneSteps = [
  'Settings → Cellular → Add Cellular Plan',
  'Tap "Use QR Code"',
  'Scan the QR code from WhatsApp/email',
  'Label it "Axon Travel" or your destination',
  'Set as "Primary" or "Travel" data line',
  "Turn on when you land — you're connected!",
]

const androidSteps = [
  'Settings → Connections → SIM Manager',
  'Tap "Add mobile plan" or "Add eSIM"',
  'Select "Scan QR code"',
  'Scan the Axon eSIM QR code',
  'Confirm and activate the plan',
  'Set it as your data SIM',
]

export default function ActivatePage() {
  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <h1 className="text-3xl sm:text-4xl font-black mb-3">How to Activate Your eSIM</h1>
          <p className="text-gray-500 max-w-xl mx-auto">Simple step-by-step guide to get connected in under 5 minutes</p>
        </div>

        {/* Overview Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
          {steps.map(({ step, icon: Icon, title, desc }) => (
            <div key={step} className="bg-[#111] border border-white/5 rounded-2xl p-5">
              <div className="text-4xl font-black text-white/5 mb-3 leading-none">{String(step).padStart(2, '0')}</div>
              <div className="w-9 h-9 rounded-xl bg-cyan-400/10 flex items-center justify-center mb-3">
                <Icon className="w-4 h-4 text-cyan-400" />
              </div>
              <h3 className="font-bold text-sm mb-2">{title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        {/* Detailed Guides */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* iPhone */}
          <div className="bg-[#111] border border-white/5 rounded-2xl p-6">
            <h2 className="text-lg font-bold mb-5 flex items-center gap-2">
              <span className="text-2xl">🍎</span> iPhone Guide
            </h2>
            <ol className="space-y-3">
              {iPhoneSteps.map((s, i) => (
                <li key={i} className="flex gap-3 text-sm">
                  <span className="w-5 h-5 rounded-full bg-cyan-400/20 text-cyan-400 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span className="text-gray-400">{s}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Android */}
          <div className="bg-[#111] border border-white/5 rounded-2xl p-6">
            <h2 className="text-lg font-bold mb-5 flex items-center gap-2">
              <span className="text-2xl">🤖</span> Android Guide
            </h2>
            <ol className="space-y-3">
              {androidSteps.map((s, i) => (
                <li key={i} className="flex gap-3 text-sm">
                  <span className="w-5 h-5 rounded-full bg-cyan-400/20 text-cyan-400 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span className="text-gray-400">{s}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Compatibility note */}
        <div className="bg-yellow-400/5 border border-yellow-400/20 rounded-2xl p-5 mb-10">
          <h3 className="font-semibold text-yellow-400 mb-2">⚠️ Device Compatibility</h3>
          <p className="text-sm text-gray-400 leading-relaxed">
            eSIM requires a compatible device. Most iPhones from XS (2018) onwards and many modern Android phones support eSIM.
            Your device must be <strong className="text-white">unlocked</strong> (not carrier locked). Check your phone&apos;s specs before purchasing.
          </p>
        </div>

        {/* CTA */}
        <div className="bg-[#111] border border-white/5 rounded-2xl p-8 text-center">
          <CheckCircle2 className="w-10 h-10 text-green-400 mx-auto mb-4" />
          <h2 className="text-xl font-black mb-2">Ready to get your eSIM?</h2>
          <p className="text-gray-500 text-sm mb-6">Pick a plan and get connected in minutes.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/plans" className="w-full sm:w-auto bg-cyan-400 hover:bg-cyan-300 text-black font-bold px-6 py-3 rounded-full text-sm transition-colors">
              Browse Plans
            </Link>
            <a
              href="https://wa.me/923349542871"
              className="w-full sm:w-auto bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold px-6 py-3 rounded-full text-sm transition-colors flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              Ask on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
