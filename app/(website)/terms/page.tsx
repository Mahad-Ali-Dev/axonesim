import React from 'react'

export const metadata = {
  title: 'Terms & Conditions | Axon eSIM',
  description: 'Terms and conditions for using Axon eSIM services.',
}

const SECTIONS = [
  {
    title: '1. About Our Service',
    content: `Axon eSIM (operated by Tase LLC, FBR Registered) provides international data-only eSIM services for travelers. Our eSIMs are intended for use outside Pakistan and provide mobile internet access in 150+ countries via global roaming partners. These are data-only plans — no local Pakistani phone number is included or provided.`,
  },
  {
    title: '2. Eligibility',
    content: `Our service is available to anyone with a compatible unlocked smartphone that supports eSIM technology. By purchasing, you confirm that your device is eSIM-compatible and unlocked. A list of compatible devices is available on our setup guide page.`,
  },
  {
    title: '3. Payment',
    content: `All payments are processed manually via JazzCash. After placing your order, you are required to send payment to the provided JazzCash account and upload a screenshot of your payment on the order page. Orders are only processed after payment is verified by our team. We do not store any financial credentials on our servers.`,
  },
  {
    title: '4. eSIM Delivery',
    content: `Once your payment is verified, your eSIM QR code and activation instructions will be delivered to your email and/or WhatsApp number within a reasonable time, subject to team availability. Delivery times may vary. We are not responsible for delays caused by incorrect contact information provided at checkout.`,
  },
  {
    title: '5. Refund Policy',
    content: `Refunds are available if your eSIM fails to activate on a compatible device and our support team is unable to resolve the issue. Refunds are not available once an eSIM has been successfully activated and data has been used. To request a refund, contact us via WhatsApp or email within 7 days of purchase.`,
  },
  {
    title: '6. International Data-Only Disclaimer',
    content: `Axon eSIM provides international roaming data services only. Our eSIMs are not Pakistani SIMs, are not registered on any CNIC, and are not subject to PTA (Pakistan Telecommunication Authority) local SIM registration requirements. These eSIMs are intended for travel use — to access mobile data abroad — and are not a replacement for a local Pakistani SIM card.`,
  },
  {
    title: '7. Acceptable Use',
    content: `You agree not to use our eSIM service for any unlawful purpose, including but not limited to fraud, spam, or any activity that violates local laws in the country where the eSIM is being used. Axon eSIM and Tase LLC are not responsible for how users use the data connection provided.`,
  },
  {
    title: '8. Limitation of Liability',
    content: `Axon eSIM provides its service on an "as is" basis. We are not liable for any indirect, incidental, or consequential damages arising from use or inability to use our service. Our total liability in any case shall not exceed the amount paid for the plan in question.`,
  },
  {
    title: '9. Privacy',
    content: `We collect only the information necessary to process your order (name, email, phone number). We do not sell or share your personal data with third parties, except as required to deliver your eSIM or comply with law. See our Privacy Policy for full details.`,
  },
  {
    title: '10. Changes to Terms',
    content: `We reserve the right to update these terms at any time. Continued use of our service after changes constitutes acceptance of the new terms. The date of the latest update is shown below.`,
  },
  {
    title: '11. Contact',
    content: `For questions about these terms, contact us at supportaxonesim@gmail.com or via WhatsApp at +92 334 9542871.`,
  },
]

export default function TermsPage() {
  return (
    <div className="bg-[#F8F9FA] min-h-screen pt-[120px] pb-24">
      <div className="max-w-4xl mx-auto px-5 lg:px-8">

        {/* Header */}
        <div className="mb-14 text-center">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-[#212529] font-heading mb-4">
            Terms &amp; <span className="text-[#0D6EFD]">Conditions</span>
          </h1>
          <p className="text-lg text-[#6C757D] font-body max-w-2xl mx-auto">
            Last updated: April 2026. Please read these terms carefully before using Axon eSIM services.
          </p>
        </div>

        {/* Disclaimer banner */}
        <div className="mb-8 p-5 rounded-2xl bg-amber-50 border border-amber-200 flex gap-4">
          <span className="text-2xl flex-shrink-0">🌐</span>
          <div>
            <p className="text-sm font-bold text-amber-800 mb-1">International Data-Only Service</p>
            <p className="text-sm text-amber-700">
              Axon eSIM provides international roaming data eSIMs for travel purposes only.
              No Pakistani phone number is included. Not a local SIM replacement.
              Not subject to PTA local SIM registration.
            </p>
          </div>
        </div>

        {/* Sections */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[rgba(0,0,0,0.06)] shadow-sm space-y-10">
          {SECTIONS.map(({ title, content }) => (
            <div key={title}>
              <h2 className="text-xl font-bold text-[#212529] mb-3 font-heading">{title}</h2>
              <p className="text-[#6C757D] leading-relaxed font-body">{content}</p>
            </div>
          ))}

          <div className="pt-6 border-t border-[rgba(0,0,0,0.06)]">
            <p className="text-xs text-[#ADB5BD] font-body">
              Axon eSIM is operated by Tase LLC — FBR Registered Business, Pakistan.<br />
              Contact: supportaxonesim@gmail.com · WhatsApp: +92 334 9542871
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
