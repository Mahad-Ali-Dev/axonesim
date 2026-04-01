import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'

const GA_ID = process.env.NEXT_PUBLIC_GA_ID

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

const SCHEMA_ORG = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Axon eSIM',
  url: 'https://www.axonesim.com',
  logo: 'https://www.axonesim.com/logo.png',
  contactPoint: { '@type': 'ContactPoint', contactType: 'customer support', availableLanguage: ['English', 'Urdu'] },
  sameAs: ['https://www.instagram.com/axonesim'],
})

const SCHEMA_WEBSITE = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Axon eSIM',
  url: 'https://www.axonesim.com',
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: SCHEMA_ORG }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: SCHEMA_WEBSITE }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,200..800&family=Orbitron:wght@400..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col antialiased">
        {children}
        {GA_ID && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
            <Script id="ga-init" strategy="afterInteractive">{`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}');
            `}</Script>
          </>
        )}
      </body>
    </html>
  )
}
