'use client'

import React from 'react'

const STEPS = [
  {
    title: "1. Scan the QR Code",
    text: "Go to Settings > Cellular (or Mobile Data) > Add eSIM (or Add Data Plan). Center the QR code in the frame to install the eSIM.",
    img: "/settings/ab617d1f-4991-4607-838e-f2d1d6d2001f.jpg"
  },
  {
    title: "2. Turn On eSIM & Data Roaming",
    text: "After installation, select the new eSIM. Ensure its switch is 'On'. Now, turn on 'Data Roaming' for this specific line. This step is critical for international connectivity.",
    img: "/settings/914ddd23-f261-406e-8d17-477724299be4.jpg" 
  },
  {
    title: "3. Set eSIM as Primary Data",
    text: "Return to the main Cellular settings and select 'Cellular Data'. Choose your newly installed eSIM as the primary data line. Turn off 'Allow Cellular Data Switching' to avoid roaming charges on your Pakistani SIM.",
    img: "/settings/4ec00120-03bc-44b0-b974-8ab860a7661e.jpg"
  }
]

export function SetupGuide() {
  return (
    <div className="space-y-12">
      {STEPS.map((step, i) => (
        <div key={i} className="flex flex-col md:flex-row items-start gap-8 bg-[#F8F9FA] rounded-2xl p-6 border border-[rgba(0,0,0,0.04)]">
          {/* Text content */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-[#0D6EFD] text-white font-bold flex items-center justify-center shadow-lg">
                {i + 1}
              </div>
              <h3 className="text-xl font-bold text-[#212529] font-heading">{step.title}</h3>
            </div>
            <p className="text-[#6C757D] leading-relaxed mb-6 font-body pl-11">
              {step.text}
            </p>
          </div>
          
          {/* Image visual */}
          <div className="w-full md:w-[280px] shrink-0">
            <img 
              src={step.img} 
              alt={step.title}
              className="w-full h-auto rounded-xl shadow-md border border-[rgba(0,0,0,0.08)] object-cover"
            />
          </div>
        </div>
      ))}
      
      {/* Support CTA */}
      <div className="bg-[#0D6EFD]/10 rounded-2xl p-6 text-center border border-[#0D6EFD]/20 mt-8">
        <h4 className="text-xl font-bold text-[#0D6EFD] mb-2 font-heading">Still not working?</h4>
        <p className="text-[#6C757D]">
          Don't delete your eSIM! Contact our 24/7 WhatsApp support immediately and we will diagnose the issue or issue a full refund.
        </p>
      </div>
    </div>
  )
}
