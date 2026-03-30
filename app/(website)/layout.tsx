import Navbar from '@/components/website/Navbar'
import Footer from '@/components/website/Footer'
import { SmoothCursor } from '@/components/ui/smooth-cursor'
import { FloatingWhatsApp } from '@/components/website/floating-whatsapp'

export default function WebsiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SmoothCursor />
      <Navbar />
      <main className="flex-1 pt-16">
        {children}
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  )
}
