'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { Menu, X, Phone, Sparkles, Globe, User } from 'lucide-react'

const NAV_LINKS = [
  { label: 'Plans', href: '/plans' },
  { label: 'Setup Guide', href: '/setup-guide' },
  { label: 'Activate', href: '/activate' },
  { label: 'Track Order', href: '/order' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-white/85 backdrop-blur-2xl border-b border-[rgba(0,0,0,0.06)] shadow-lg shadow-black/[0.03]'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex items-center justify-between h-[88px]">

          {/* Logo */}
          <Link href="/" className="flex items-center shrink-0 group">
            <Image
              src="/navbar_logo.png"
              alt="Axon eSIM"
              width={280}
              height={72}
              className="h-16 w-auto object-contain group-hover:opacity-90 transition-opacity"
              priority
            />
          </Link>

          {/* Desktop: nav links in a pill container */}
          <div className={`hidden md:flex items-center gap-0.5 rounded-full px-1.5 py-1.5 transition-all duration-500 ${
            scrolled
              ? 'bg-[#F8F9FA] border border-[rgba(0,0,0,0.06)]'
              : 'bg-white/[0.04] border border-white/[0.07]'
          }`}>
            {NAV_LINKS.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className={`text-sm px-4 py-1.5 rounded-full transition-all duration-200 font-medium font-heading ${
                  scrolled
                    ? 'text-[#6C757D] hover:text-[#212529] hover:bg-[rgba(13,110,253,0.05)]'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.06]'
                }`}
              >
                {label}
              </Link>
            ))}
            <a
              href="https://wa.me/923349542871"
              target="_blank"
              rel="noopener noreferrer"
              className={`text-sm px-4 py-1.5 rounded-full transition-all duration-200 font-medium flex items-center gap-1.5 font-heading ${
                scrolled
                  ? 'text-[#6C757D] hover:text-[#212529] hover:bg-[rgba(13,110,253,0.05)]'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.06]'
              }`}
            >
              <Phone className="w-3 h-3" />
              Support
            </a>
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-2">
            <Link
              href="/account"
              className={`flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-full transition-all duration-200 font-heading ${
                scrolled ? 'text-[#6C757D] hover:text-[#212529] hover:bg-[rgba(13,110,253,0.05)]' : 'text-slate-400 hover:text-white hover:bg-white/[0.06]'
              }`}
            >
              <User className="w-3.5 h-3.5" /> Account
            </Link>
            <Link
              href="/plans"
              className="flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-full bg-gradient-to-r from-[#0D6EFD] to-[#0A58CA] text-white shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 hover:scale-[1.03] transition-all duration-300 font-heading"
            >
              <Globe className="w-3.5 h-3.5" />
              Get eSIM
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className={`md:hidden w-9 h-9 flex items-center justify-center rounded-xl transition-all border border-transparent ${
              scrolled
                ? 'text-[#6C757D] hover:text-[#212529] hover:bg-[#F8F9FA] hover:border-[rgba(0,0,0,0.06)]'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.05] hover:border-white/[0.08]'
            }`}
            onClick={() => setOpen(v => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X className="w-4.5 h-4.5" /> : <Menu className="w-4.5 h-4.5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className={`md:hidden backdrop-blur-2xl border-t px-4 py-4 space-y-1 ${
          scrolled
            ? 'bg-white/98 border-[rgba(0,0,0,0.06)]'
            : 'bg-[#020308]/98 border-white/[0.05]'
        }`}>
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={`flex items-center text-sm px-4 py-3 rounded-xl transition-all font-medium font-heading ${
                scrolled
                  ? 'text-[#212529] hover:bg-[rgba(13,110,253,0.05)]'
                  : 'text-slate-300 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              {label}
            </Link>
          ))}
          <a
            href="https://wa.me/923349542871"
            onClick={() => setOpen(false)}
            className={`flex items-center gap-2 text-sm px-4 py-3 rounded-xl transition-all font-medium font-heading ${
              scrolled
                ? 'text-[#212529] hover:bg-[rgba(13,110,253,0.05)]'
                : 'text-slate-300 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <Phone className="w-3.5 h-3.5" /> WhatsApp Support
          </a>
          <Link
            href="/account"
            onClick={() => setOpen(false)}
            className={`flex items-center gap-2 text-sm px-4 py-3 rounded-xl transition-all font-medium font-heading ${
              scrolled
                ? 'text-[#212529] hover:bg-[rgba(13,110,253,0.05)]'
                : 'text-slate-300 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <User className="w-3.5 h-3.5" /> Account / Login
          </Link>
          <div className="pt-2">
            <Link
              href="/plans"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-sm font-bold bg-gradient-to-r from-[#0D6EFD] to-[#0A58CA] text-white shadow-lg shadow-blue-600/20 font-heading"
            >
              <Sparkles className="w-4 h-4" />
              Get Your eSIM
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
