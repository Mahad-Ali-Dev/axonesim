import Link from 'next/link'
import { Shield, CreditCard, ChevronLeft, Globe, Zap, Smartphone } from 'lucide-react'

export const metadata = {
  title: 'Secure Checkout | Axon eSIM',
  description: 'Complete your eSIM purchase securely.',
}

export default function OrderPage() {
  return (
    <div className="min-h-screen bg-[#F8F9FA] pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-5">
        
        {/* Top Navigation / Return */}
        <div className="mb-8">
          <Link href="/plans" className="inline-flex items-center text-[#6C757D] hover:text-[#0D6EFD] font-semibold text-sm transition-colors decoration-2 hover:underline underline-offset-4">
            <ChevronLeft className="w-4 h-4 mr-1" /> Back to Plans
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Main Checkout Form */}
          <div className="lg:col-span-8 space-y-8">
            
            <div className="bg-white rounded-[24px] p-6 sm:p-10 border border-[rgba(0,0,0,0.06)] shadow-sm">
              <h1 className="text-3xl font-black font-heading tracking-tight text-[#212529] mb-8">
                Complete your Order
              </h1>

              {/* Contact Information */}
              <section className="mb-10">
                <h2 className="text-lg font-bold font-heading text-[#212529] mb-5 flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#0D6EFD] text-white text-xs">1</span>
                  Contact Information
                </h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-[#495057] mb-2">First Name</label>
                    <input type="text" placeholder="Ali" className="w-full bg-[#F8F9FA] border border-[rgba(0,0,0,0.08)] rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#0D6EFD]/30 focus:border-[#0D6EFD] transition-all text-[#212529] font-medium" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#495057] mb-2">Last Name</label>
                    <input type="text" placeholder="Khan" className="w-full bg-[#F8F9FA] border border-[rgba(0,0,0,0.08)] rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#0D6EFD]/30 focus:border-[#0D6EFD] transition-all text-[#212529] font-medium" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold text-[#495057] mb-2">Email Address <span className="text-[#6C757D] font-normal text-xs ml-1">(QR Code will be sent here)</span></label>
                    <input type="email" placeholder="ali.khan@example.com" className="w-full bg-[#F8F9FA] border border-[rgba(0,0,0,0.08)] rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#0D6EFD]/30 focus:border-[#0D6EFD] transition-all text-[#212529] font-medium" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold text-[#495057] mb-2">WhatsApp Number <span className="text-[#6C757D] font-normal text-xs ml-1">(For instant delivery)</span></label>
                    <div className="flex">
                      <span className="inline-flex items-center px-4 rounded-l-xl border border-r-0 border-[rgba(0,0,0,0.08)] bg-[#E9ECEF] text-[#495057] font-semibold text-sm">
                        +92
                      </span>
                      <input type="tel" placeholder="300 1234567" className="w-full bg-[#F8F9FA] border border-[rgba(0,0,0,0.08)] rounded-r-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#0D6EFD]/30 focus:border-[#0D6EFD] transition-all text-[#212529] font-medium" />
                    </div>
                  </div>
                </div>
              </section>

              {/* Payment Method */}
              <section>
                <h2 className="text-lg font-bold font-heading text-[#212529] mb-5 flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#0D6EFD] text-white text-xs">2</span>
                  Payment Method
                </h2>

                <div className="space-y-3">
                  {/* Option 1 */}
                  <label className="flex items-center justify-between p-5 border border-[#0D6EFD] bg-[rgba(13,110,253,0.04)] rounded-xl cursor-pointer transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-5 h-5 rounded-full border-[5px] border-[#0D6EFD] bg-white flex-shrink-0" />
                      <div>
                        <div className="font-bold text-[#212529]">JazzCash / Easypaisa</div>
                        <div className="text-xs text-[#6C757D] font-medium">Pay instantly via local wallets</div>
                      </div>
                    </div>
                    {/* Placeholder image for local wallets */}
                    <div className="w-12 h-8 bg-white border border-[rgba(0,0,0,0.08)] rounded flex items-center justify-center text-[10px] font-bold text-slate-400">
                      WALLET
                    </div>
                  </label>

                  {/* Option 2 */}
                  <label className="flex items-center justify-between p-5 border border-[rgba(0,0,0,0.08)] hover:border-[#0D6EFD]/50 bg-white rounded-xl cursor-pointer transition-all group">
                    <div className="flex items-center gap-4">
                      <div className="w-5 h-5 rounded-full border-2 border-[#ADB5BD] group-hover:border-[#0D6EFD]/50 flex-shrink-0" />
                      <div>
                        <div className="font-bold text-[#212529]">Credit / Debit Card</div>
                        <div className="text-xs text-[#6C757D] font-medium">Visa, Mastercard, Safepay</div>
                      </div>
                    </div>
                    <CreditCard className="w-6 h-6 text-slate-400" />
                  </label>
                </div>
              </section>

              {/* CTA Button */}
              <button className="w-full mt-10 btn-primary py-4 rounded-xl text-lg font-bold flex items-center justify-center gap-3">
                <Shield className="w-5 h-5" />
                Pay Securely & Get eSIM
              </button>
              
              <div className="text-center mt-5 text-xs text-[#6C757D] font-medium flex items-center justify-center gap-1.5">
                <LockIcon className="w-3.5 h-3.5" /> Payments are 256-bit encrypted and completely secure.
              </div>

            </div>
          </div>

          {/* Sidebar Order Summary */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-[24px] p-6 sm:p-8 border border-[rgba(0,0,0,0.06)] shadow-[0_20px_40px_rgba(0,0,0,0.04)] sticky top-32">
              
              <h3 className="text-lg font-bold font-heading text-[#212529] mb-6 border-b border-[rgba(0,0,0,0.06)] pb-4">
                Order Summary
              </h3>

              <div className="flex items-start gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0D6EFD] to-[#00C6FF] flex items-center justify-center p-0.5 flex-shrink-0">
                  <div className="w-full h-full bg-[#0A1128] rounded-[14px] flex items-center justify-center">
                    <Globe className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-[#212529] font-heading leading-tight">Global Explorer</h4>
                  <div className="text-xs text-[#6C757D] font-semibold uppercase tracking-wider mt-1">150+ Countries</div>
                </div>
              </div>

              <div className="space-y-3 mb-6 font-medium text-sm">
                <div className="flex justify-between items-center text-[#495057]">
                  <span className="flex items-center gap-2"><Zap className="w-4 h-4 text-[#0D6EFD]" /> Data</span>
                  <span className="font-bold text-[#212529]">10 GB</span>
                </div>
                <div className="flex justify-between items-center text-[#495057]">
                  <span className="flex items-center gap-2"><Smartphone className="w-4 h-4 text-[#0D6EFD]" /> Validity</span>
                  <span className="font-bold text-[#212529]">30 Days</span>
                </div>
                <div className="flex justify-between items-center text-[#495057]">
                  <span className="flex items-center gap-2"><Globe className="w-4 h-4 text-[#0D6EFD]" /> Network</span>
                  <span className="font-bold text-[#212529]">4G/5G Local</span>
                </div>
              </div>

              <div className="border-t border-[rgba(0,0,0,0.06)] pt-6 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[#6C757D] font-semibold">Subtotal</span>
                  <span className="font-bold text-[#212529]">Rs 4,200</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[#6C757D] font-semibold">Taxes</span>
                  <span className="font-bold text-[#212529]">Rs 0</span>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-lg font-bold text-[#212529]">Total</span>
                  <span className="text-2xl font-black font-display text-[#0D6EFD]">Rs 4,200</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

function LockIcon(props: any) {
  return (
    <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
      <path d="M12 2C9.243 2 7 4.243 7 7v3H6c-1.103 0-2 .897-2 2v8c0 1.103.897 2 2 2h12c1.103 0 2-.897 2-2v-8c0-1.103-.897-2-2-2h-1V7c0-2.757-2.243-5-5-5zm-3 5c0-1.654 1.346-3 3-3s3 1.346 3 3v3H9V7zm9 13H6v-8h12v8z" />
      <path d="M12 13c-1.103 0-2 .897-2 2s.897 2 2 2 2-.897 2-2-.897-2-2-2z" />
    </svg>
  )
}
