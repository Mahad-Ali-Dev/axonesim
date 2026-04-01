import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Axon eSIM — Instant Global Connectivity',
  description: 'Buy eSIM data plans for travel. Works in 150+ countries. Instant delivery via WhatsApp and email.',
  keywords: 'eSIM, travel SIM, international data, roaming, Pakistan, JazzCash, Easypaisa',
  openGraph: {
    title: 'Axon eSIM — Instant Global Connectivity',
    description: 'Buy eSIM data plans for travel. Works in 150+ countries.',
    url: 'https://axonesim.com',
    siteName: 'Axon eSIM',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Axon eSIM — Instant Global Connectivity',
    description: 'Buy eSIM data plans for travel. Works in 150+ countries.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,200..800&family=Orbitron:wght@400..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  )
}
