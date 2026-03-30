import React from 'react'

export const metadata = {
  title: 'Privacy Policy | Axon eSIM',
  description: 'Learn how Axon eSIM handles and protects your data.',
}

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-[#F8F9FA] min-h-screen pt-[120px] pb-24">
      <div className="max-w-4xl mx-auto px-5 lg:px-8">
        
        {/* Header */}
        <div className="mb-14 text-center">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-[#212529] font-heading mb-4">
            Privacy <span className="text-[#0D6EFD]">Policy</span>
          </h1>
          <p className="text-lg text-[#6C757D] font-body max-w-2xl mx-auto">
            Last Updated: March 2026. We take your privacy seriously. Here is how we collect, use, and protect your information.
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[rgba(0,0,0,0.06)] shadow-sm prose prose-blue max-w-none">
          <h2 className="text-2xl font-bold text-[#212529] mb-6 font-heading border-b border-[rgba(0,0,0,0.06)] pb-4">
            1. Information We Collect
          </h2>
          <p className="text-[#6C757D] mb-8">
            When you purchase an eSIM from Axon, we collect necessary information to process your order and deliver your digital product. This includes your email address, WhatsApp number, and device model (to verify eSIM compatibility). We do not store your full credit card or direct bank details on our servers; payments are processed securely by our trusted partners (Safepay, Stripe, JazzCash, Easypaisa).
          </p>

          <h2 className="text-2xl font-bold text-[#212529] mb-6 font-heading border-b border-[rgba(0,0,0,0.06)] pb-4">
            2. How We Use Your Information
          </h2>
          <p className="text-[#6C757D] mb-4">
            We use your data solely for the following purposes:
          </p>
          <ul className="text-[#6C757D] list-disc pl-5 mb-8 space-y-2">
            <li>Delivering the eSIM QR code directly to your WhatsApp or Email.</li>
            <li>Providing customer support and technical assistance.</li>
            <li>Processing refunds according to our Refund Policy.</li>
            <li>Sending essential service updates or critical network alerts regarding your purchased plan.</li>
          </ul>

          <h2 className="text-2xl font-bold text-[#212529] mb-6 font-heading border-b border-[rgba(0,0,0,0.06)] pb-4">
            3. Data Sharing
          </h2>
          <p className="text-[#6C757D] mb-8">
            We never sell your personal data. We only share necessary information with our telecom carrier partners to provision your device on their network. These partners are strictly bound by global data protection standards (such as GDPR).
          </p>

          <h2 className="text-2xl font-bold text-[#212529] mb-6 font-heading border-b border-[rgba(0,0,0,0.06)] pb-4">
            4. Security
          </h2>
          <p className="text-[#6C757D] mb-8">
            We use industry-standard encryption protocols (SSL/TLS) to protect your data during transmission. Access to your personal information is strictly limited to authorized personnel who require it to perform their customer support duties.
          </p>
          
          <h2 className="text-2xl font-bold text-[#212529] mb-6 font-heading border-b border-[rgba(0,0,0,0.06)] pb-4">
            5. Contact Us
          </h2>
          <p className="text-[#6C757D] mb-8">
            If you have questions or concerns about this Privacy Policy or your data, please contact us at <strong>privacy@axonesim.com</strong> or reach out via our 24/7 WhatsApp support.
          </p>
        </div>
      </div>
    </div>
  )
}
