import Link from 'next/link'
import {
  Smartphone, Wifi, Signal, CheckCircle2, AlertTriangle,
  MessageCircle, ArrowRight, ChevronDown, Shield, Globe,
  QrCode, ToggleRight, Radio,
} from 'lucide-react'

export const metadata = {
  title: 'eSIM Setup Guide — Step by Step | Axon eSIM',
  description:
    'Complete step-by-step guide to install and activate your Axon eSIM. Scan QR, enable Data Roaming, configure LTE settings — get online in under 60 seconds.',
}

/* ── FAQ data ── */
const TROUBLESHOOT = [
  {
    q: 'eSIM installed but no signal?',
    a: 'Make sure Data Roaming is turned ON for the eSIM line. Go to Settings → Cellular → select your eSIM → toggle Data Roaming. This is the #1 cause of connection issues.',
  },
  {
    q: 'Getting "No Service" after landing?',
    a: 'It can take 2–3 minutes for the eSIM to register on the local network after landing. If it takes longer, toggle Airplane Mode on and off, or restart your phone.',
  },
  {
    q: 'Data not working despite signal bars?',
    a: 'Go to Cellular → Cellular Data and make sure your eSIM line is selected as the data line. Also check that "Allow Cellular Data Switching" is turned OFF to prevent data going through your Pakistani SIM.',
  },
  {
    q: 'What APN should I use?',
    a: 'Set the APN to "plus" (lowercase). Leave Username and Password fields empty. Go to Cellular → eSIM line → Mobile Data Network to configure this.',
  },
  {
    q: 'Should I remove my Pakistani SIM?',
    a: 'No! Keep your Pakistani SIM active for calls and SMS. Just set the eSIM as your primary data line. Your phone supports dual SIM — both work simultaneously.',
  },
  {
    q: 'Can I use hotspot/tethering?',
    a: 'Yes, all Axon eSIM plans include unlimited hotspot. Make sure to also set the APN to "plus" under Personal Hotspot settings if prompted.',
  },
]

export default function SetupGuidePage() {
  return (
    <div className="overflow-x-clip" style={{ background: '#FFFFFF' }}>

      {/* ═══════════ HERO ═══════════ */}
      <section className="relative pt-32 pb-20 px-5 overflow-hidden" style={{ background: '#020308' }}>
        {/* Background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full blur-[160px] pointer-events-none" style={{ background: 'rgba(13,110,253,0.12)' }} />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[300px] rounded-full blur-[130px] pointer-events-none" style={{ background: 'rgba(0,198,255,0.06)' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#020308]/80 pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/[0.04] border border-white/[0.08] rounded-full px-4 py-2 mb-8 backdrop-blur-sm">
            <Smartphone className="w-3.5 h-3.5 text-[#3D8BFD]" />
            <span className="text-sm text-slate-400 font-medium font-body">iPhone & Android</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-6 font-heading">
            <span className="text-white">Setup Your eSIM in</span>
            <br />
            <span className="gradient-text-hero">Under 60 Seconds</span>
          </h1>

          <p className="text-lg text-slate-400 max-w-xl mx-auto mb-10 leading-relaxed font-body">
            Follow these steps exactly to get connected. Most activation issues are resolved by correctly configuring your Cellular / Mobile Data settings.
          </p>

          {/* Quick jump pills */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {[
              { label: 'Step 1: Scan QR', icon: QrCode, color: '#0D6EFD' },
              { label: 'Step 2: Data Roaming', icon: ToggleRight, color: '#00C6FF' },
              { label: 'Step 3: Select LTE', icon: Radio, color: '#10B981' },
            ].map(({ label, icon: Icon, color }) => (
              <a
                key={label}
                href={`#step-${label.charAt(5)}`}
                className="flex items-center gap-2 text-sm px-4 py-2 rounded-full bg-white/[0.04] border border-white/[0.07] text-slate-300 hover:bg-white/[0.08] hover:border-white/[0.14] transition-all font-heading"
              >
                <Icon className="w-3.5 h-3.5" style={{ color }} />
                {label}
              </a>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="flex justify-center mt-16">
          <ChevronDown className="w-5 h-5 text-slate-700 animate-bounce" />
        </div>
      </section>

      {/* ═══════════ STEPS ═══════════ */}
      <section className="section" style={{ background: '#F8F9FA' }}>
        <div className="max-w-5xl mx-auto">
          <div className="space-y-10">

            {/* ── Step 1 ── */}
            <div id="step-1" className="relative rounded-3xl border border-[rgba(0,0,0,0.06)] bg-white overflow-hidden shadow-sm hover:shadow-xl hover:shadow-blue-600/5 transition-all duration-300 scroll-mt-24">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                <div className="p-8 sm:p-10 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-base font-display text-white shadow-lg" style={{ background: '#0D6EFD' }}>
                      01
                    </div>
                    <div>
                      <h2 className="font-black text-2xl text-[#212529] font-heading">Scan the QR Code</h2>
                      <p className="text-xs text-[#ADB5BD] font-semibold uppercase tracking-wider font-display mt-0.5">Install eSIM on your device</p>
                    </div>
                  </div>

                  <div className="space-y-4 mb-8">
                    <p className="text-[#6C757D] text-sm leading-relaxed font-body">
                      Open your phone&apos;s <strong className="text-[#212529]">Settings</strong> app and navigate to:
                    </p>
                    <div className="bg-[#F8F9FA] rounded-2xl p-4 border border-[rgba(0,0,0,0.04)]">
                      <div className="flex items-center gap-2 text-sm font-semibold text-[#212529] font-heading">
                        <span>Settings</span>
                        <ArrowRight className="w-3 h-3 text-[#ADB5BD]" />
                        <span>Cellular</span>
                        <ArrowRight className="w-3 h-3 text-[#ADB5BD]" />
                        <span className="text-[#0D6EFD]">Add eSIM</span>
                      </div>
                    </div>
                    <p className="text-[#6C757D] text-sm leading-relaxed font-body">
                      Select <strong className="text-[#212529]">&quot;Use QR Code&quot;</strong> and center our QR code in the camera frame to install.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-[rgba(13,110,253,0.06)] border border-[rgba(13,110,253,0.12)] text-[#0D6EFD]">
                      <CheckCircle2 className="w-3 h-3" /> QR sent via WhatsApp
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-[rgba(16,185,129,0.06)] border border-[rgba(16,185,129,0.12)] text-[#10B981]">
                      <CheckCircle2 className="w-3 h-3" /> Takes 30 seconds
                    </span>
                  </div>
                </div>
                <div className="relative bg-[#0a0a0a] flex items-center justify-center p-8 min-h-[380px]">
                  <img
                    src="/settings/914ddd23-f261-406e-8d17-477724299be4.jpg"
                    alt="iPhone cellular settings showing Turn On This Line toggle and Data Roaming"
                    className="rounded-2xl shadow-2xl max-h-[440px] w-auto object-contain"
                  />
                </div>
              </div>
              <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, #0D6EFD, transparent)' }} />
            </div>

            {/* ── Step 2 ── */}
            <div id="step-2" className="relative rounded-3xl border border-[rgba(0,0,0,0.06)] bg-white overflow-hidden shadow-sm hover:shadow-xl hover:shadow-cyan-600/5 transition-all duration-300 scroll-mt-24">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                <div className="relative bg-[#0a0a0a] flex items-center justify-center p-8 min-h-[380px] order-2 md:order-1">
                  <img
                    src="/settings/4ec00120-03bc-44b0-b974-8ab860a7661e.jpg"
                    alt="iPhone Mobile Data Network APN settings showing APN set to plus"
                    className="rounded-2xl shadow-2xl max-h-[440px] w-auto object-contain"
                  />
                </div>
                <div className="p-8 sm:p-10 flex flex-col justify-center order-1 md:order-2">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-base font-display text-white shadow-lg" style={{ background: '#00C6FF' }}>
                      02
                    </div>
                    <div>
                      <h2 className="font-black text-2xl text-[#212529] font-heading">Turn On eSIM & Data Roaming</h2>
                      <p className="text-xs text-[#ADB5BD] font-semibold uppercase tracking-wider font-display mt-0.5">Critical for international use</p>
                    </div>
                  </div>

                  <div className="space-y-4 mb-8">
                    <p className="text-[#6C757D] text-sm leading-relaxed font-body">
                      After installation, select the new eSIM line. Make sure the <strong className="text-[#212529]">&apos;Turn On This Line&apos;</strong> switch is enabled. Then scroll down and enable <strong className="text-[#212529]">&apos;Data Roaming&apos;</strong>.
                    </p>

                    <div className="bg-[rgba(245,158,11,0.05)] border border-[rgba(245,158,11,0.15)] rounded-2xl p-4">
                      <div className="flex items-start gap-2.5">
                        <AlertTriangle className="w-4 h-4 text-[#D97706] flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-[#92400E] font-medium leading-relaxed">
                          <strong>Data Roaming must be ON</strong> — this is the #1 reason eSIMs don&apos;t connect abroad. Without it, you won&apos;t get signal in the destination country.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <h4 className="text-xs font-bold text-[#212529] uppercase tracking-wider font-display">APN Configuration</h4>
                    {[
                      { label: 'Set APN to', value: '"plus"', color: '#00A3D9' },
                      { label: 'Username', value: 'Leave empty', color: '#00A3D9' },
                      { label: 'Password', value: 'Leave empty', color: '#00A3D9' },
                      { label: 'Data Roaming', value: 'Toggle ON ✓', color: '#10B981' },
                    ].map(({ label, value, color }) => (
                      <div key={label} className="flex items-center justify-between px-4 py-2.5 bg-[#F8F9FA] rounded-xl border border-[rgba(0,0,0,0.04)]">
                        <span className="text-sm text-[#6C757D] font-body">{label}</span>
                        <span className="text-sm font-bold font-heading" style={{ color }}>{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, #00C6FF, transparent)' }} />
            </div>

            {/* ── Step 3 ── */}
            <div id="step-3" className="relative rounded-3xl border border-[rgba(0,0,0,0.06)] bg-white overflow-hidden shadow-sm hover:shadow-xl hover:shadow-emerald-600/5 transition-all duration-300 scroll-mt-24">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                <div className="p-8 sm:p-10 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-base font-display text-white shadow-lg" style={{ background: '#10B981' }}>
                      03
                    </div>
                    <div>
                      <h2 className="font-black text-2xl text-[#212529] font-heading">Select LTE & Go Online</h2>
                      <p className="text-xs text-[#ADB5BD] font-semibold uppercase tracking-wider font-display mt-0.5">Final step — you&apos;re almost there!</p>
                    </div>
                  </div>

                  <div className="space-y-4 mb-8">
                    <p className="text-[#6C757D] text-sm leading-relaxed font-body">
                      Navigate to <strong className="text-[#212529]">Voice & Data</strong> and select <strong className="text-[#212529]">LTE</strong>. Enable <strong className="text-[#212529]">VoLTE</strong> for best voice call quality over LTE networks.
                    </p>

                    <div className="bg-[#F8F9FA] rounded-2xl p-4 border border-[rgba(0,0,0,0.04)]">
                      <div className="flex items-center gap-2 text-sm font-semibold text-[#212529] font-heading">
                        <span>eSIM Line</span>
                        <ArrowRight className="w-3 h-3 text-[#ADB5BD]" />
                        <span>Voice & Data</span>
                        <ArrowRight className="w-3 h-3 text-[#ADB5BD]" />
                        <span className="text-[#10B981]">LTE ✓</span>
                      </div>
                    </div>

                    <p className="text-[#6C757D] text-sm leading-relaxed font-body">
                      When you land at your destination, the eSIM will automatically connect to the strongest local 4G/5G network. It may take 2–3 minutes on first connection.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-[rgba(16,185,129,0.06)] border border-[rgba(16,185,129,0.12)] text-[#10B981]">
                      <Wifi className="w-3 h-3" /> Auto-connects on landing
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-[rgba(245,158,11,0.06)] border border-[rgba(245,158,11,0.12)] text-[#D97706]">
                      <Signal className="w-3 h-3" /> Full 4G/5G speeds
                    </span>
                  </div>
                </div>
                <div className="relative bg-[#0a0a0a] flex items-center justify-center p-8 min-h-[380px]">
                  <img
                    src="/settings/ab617d1f-4991-4607-838e-f2d1d6d2001f.jpg"
                    alt="iPhone Voice & Data settings showing LTE selected and VoLTE enabled"
                    className="rounded-2xl shadow-2xl max-h-[440px] w-auto object-contain"
                  />
                </div>
              </div>
              <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, #10B981, transparent)' }} />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ PRO TIPS ═══════════ */}
      <section className="py-16 px-5" style={{ background: '#FFFFFF' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-black text-[#212529] mb-3 font-heading tracking-tight">
              Pro Tips
            </h2>
            <p className="text-[#6C757D] text-sm font-body">Quick tips for the smoothest experience</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: '✈️', tip: 'Buy before you fly', desc: 'Purchase at home. Validity starts when you connect abroad, not when you buy.' },
              { icon: '📱', tip: 'Keep your Pakistani SIM', desc: 'Dual SIM means your local number stays active for calls & SMS.' },
              { icon: '⏱️', tip: 'First connection', desc: 'Allow 2-3 minutes for initial network registration after landing.' },
              { icon: '🔄', tip: 'No signal fix', desc: 'Toggle Airplane Mode on/off or restart your phone to force reconnection.' },
            ].map(({ icon, tip, desc }) => (
              <div key={tip} className="flex items-start gap-3.5 p-5 bg-[#F8F9FA] rounded-2xl border border-[rgba(0,0,0,0.06)] hover:border-[rgba(13,110,253,0.12)] hover:shadow-md transition-all duration-200">
                <span className="text-2xl flex-shrink-0">{icon}</span>
                <div>
                  <div className="font-bold text-sm text-[#212529] mb-1 font-heading">{tip}</div>
                  <div className="text-xs text-[#6C757D] leading-relaxed font-body">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ TROUBLESHOOTING FAQ ═══════════ */}
      <section className="section" style={{ background: '#F8F9FA' }}>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <div className="badge-pill inline-flex mb-5">
              <AlertTriangle className="w-3.5 h-3.5" /> Troubleshooting
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#212529] mb-3 font-heading tracking-tight">
              Common Issues & <span className="gradient-text">Quick Fixes</span>
            </h2>
            <p className="text-[#6C757D] text-sm font-body">
              90% of issues are solved by enabling Data Roaming. Check the FAQ below for other fixes.
            </p>
          </div>

          <div className="space-y-2.5">
            {TROUBLESHOOT.map(({ q, a }) => (
              <details
                key={q}
                className="group border border-[rgba(0,0,0,0.06)] bg-white rounded-2xl p-5 cursor-pointer hover:border-[rgba(13,110,253,0.15)] hover:shadow-md hover:shadow-blue-500/5 transition-all duration-200"
              >
                <summary className="flex items-center justify-between gap-4 font-semibold text-sm list-none [&::-webkit-details-marker]:hidden font-heading">
                  <span className="text-[#212529]">{q}</span>
                  <ChevronDown className="w-4 h-4 text-[#ADB5BD] flex-shrink-0 transition-transform duration-300 group-open:rotate-180 group-open:text-[#0D6EFD]" />
                </summary>
                <p className="text-sm text-[#6C757D] leading-relaxed mt-4 pt-4 border-t border-[rgba(0,0,0,0.06)] font-body">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ SUPPORT CTA ═══════════ */}
      <section className="section" style={{ background: '#FFFFFF' }}>
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-[28px] overflow-hidden">
            <div className="absolute inset-0" style={{ background: 'linear-gradient(145deg, #051B3D 0%, #0B1120 45%, #040D1E 100%)' }} />
            <div className="absolute inset-0 dot-bg opacity-20" style={{ backgroundImage: 'radial-gradient(rgba(13,110,253,0.12) 1px, transparent 1px)' }} />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] blur-[130px] opacity-25 pointer-events-none" style={{ background: 'radial-gradient(circle, #10B981, transparent 70%)' }} />
            <div className="absolute inset-0 rounded-[28px] border border-[rgba(16,185,129,0.15)] pointer-events-none" />
            <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-[rgba(16,185,129,0.40)] to-transparent" />

            <div className="relative z-10 p-10 sm:p-14 lg:p-20 text-center">
              <div className="inline-flex items-center gap-2 bg-[rgba(16,185,129,0.10)] border border-[rgba(16,185,129,0.20)] rounded-full px-4 py-1.5 mb-8">
                <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-sm text-emerald-300 font-semibold font-heading">Still need help?</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black text-white mb-6 font-heading tracking-tight">
                Don&apos;t Delete Your eSIM!
              </h2>

              <p className="text-slate-400 mb-10 max-w-xl mx-auto text-base leading-relaxed font-body">
                If your eSIM isn&apos;t connecting, <strong className="text-white">do not delete it</strong> from your device. Contact our 24/7 WhatsApp support team — we&apos;ll diagnose the issue live or issue a full refund.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="https://wa.me/923349542871"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2.5 px-8 py-4 rounded-full text-base font-bold text-white bg-gradient-to-r from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-600/20 hover:shadow-emerald-600/40 hover:scale-[1.03] transition-all duration-300 font-heading"
                >
                  <MessageCircle className="w-4 h-4" />
                  Chat on WhatsApp
                </a>
                <Link
                  href="/refund-policy"
                  className="flex items-center justify-center gap-2.5 px-8 py-4 rounded-full text-base font-semibold text-slate-300 bg-white/[0.05] border border-white/[0.08] hover:bg-white/[0.09] hover:border-white/[0.14] transition-all duration-300 font-heading"
                >
                  <Shield className="w-4 h-4" />
                  View Refund Policy
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
