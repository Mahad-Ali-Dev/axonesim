import React from 'react'
import { SetupGuide } from '@/components/website/setup-guide'

export const metadata = {
  title: 'Refund Policy & Setup Guide | Axon eSIM',
  description: 'Our refund policy and step-by-step setup guide for your Axon eSIM.',
}

export default function RefundPolicyPage() {
  return (
    <div className="bg-[#F8F9FA] min-h-screen pt-[120px] pb-24">
      <div className="max-w-4xl mx-auto px-5 lg:px-8">
        
        {/* Header */}
        <div className="mb-14 text-center">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-[#212529] font-heading mb-4">
            Refund Policy & <span className="text-[#0D6EFD]">Setup Guide</span>
          </h1>
          <p className="text-lg text-[#6C757D] font-body max-w-2xl mx-auto">
            Having trouble? Follow our setup instructions below. If your eSIM still doesn&apos;t activate, we&apos;ve got you covered with a full refund.
          </p>
        </div>

        {/* Setup Guide Section */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[rgba(0,0,0,0.06)] shadow-sm mb-12">
          <h2 className="text-2xl font-bold text-[#212529] mb-8 font-heading border-b border-[rgba(0,0,0,0.06)] pb-4">
            Step-by-Step Setup Guide
          </h2>
          <p className="text-[#6C757D] mb-8">
            Please follow these steps exactly. Most activation issues can be resolved by correctly configuring the Cellular / Mobile Data settings on your device.
          </p>
          <SetupGuide />
        </div>

        {/* Refund Policy Text */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[rgba(0,0,0,0.06)] shadow-sm prose prose-blue max-w-none">
          <h2 className="text-2xl font-bold text-[#212529] mb-6 font-heading border-b border-[rgba(0,0,0,0.06)] pb-4">
            Our Refund Policy
          </h2>
          
          <h3 className="font-bold text-[#212529]">1. Device Compatibility and Activation Guarantee</h3>
          <p className="text-[#6C757D]">
            At Axon eSIM, your connectivity is our priority. <strong>We provide a full refund if your eSIM does not activate on your device</strong>, provided that your device is carrier-unlocked and officially supports eSIM technology. Please follow the setup guide above thoroughly before requesting a refund.
          </p>

          <h3 className="font-bold text-[#212529]">2. Eligibility for Refunds</h3>
          <p className="text-[#6C757D]">
            You are eligible for a refund under the following conditions:
          </p>
          <ul className="text-[#6C757D] list-disc pl-5 mb-4 space-y-2">
            <li>The eSIM QR code has <strong>not been scanned/installed</strong> yet (e.g., you accidentally purchased the wrong plan and haven&apos;t used the QR code).</li>
            <li>The eSIM was installed but failed to connect to local networks within the destination country despite following all troubleshooting steps and contacting our support team.</li>
            <li>Significant network outages on our provider&apos;s end caused prolonged disconnection that we couldn&apos;t resolve.</li>
          </ul>

          <h3 className="font-bold text-[#212529]">3. When Refunds Are Not Provided</h3>
          <p className="text-[#6C757D]">
            We unfortunately cannot offer refunds in these scenarios:
          </p>
          <ul className="text-[#6C757D] list-disc pl-5 mb-4 space-y-2">
            <li>Your phone is carrier-locked or does not have eSIM hardware capabilities. (Please check compatibility before purchasing).</li>
            <li>You have already used a significant portion of the data plan.</li>
            <li>You deleted the eSIM from your device settings after installation. (Deleted eSIMs cannot be re-downloaded or recovered).</li>
            <li>You changed your mind after the data plan has already been partially consumed.</li>
          </ul>

          <h3 className="font-bold text-[#212529]">4. How to Request a Refund</h3>
          <p className="text-[#6C757D]">
            To initiate a request, please contact our 24/7 WhatsApp support team with your order number and screenshots of your Cellular/Mobile Data settings. If we determine that the eSIM cannot activate on your compatible device, we will process your refund immediately. Refunds made to JazzCash, Easypaisa, or Cards will reflect in your account according to your bank&apos;s standard processing times (usually 3-7 business days).
          </p>
        </div>
      </div>
    </div>
  )
}
