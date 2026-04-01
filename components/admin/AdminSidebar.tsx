'use client'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, ShoppingCart, Package, Users,
  BarChart3, Settings, LogOut, Globe
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { signOut } from '@/app/actions/auth'

const NAV = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/orders',    label: 'Orders',    icon: ShoppingCart    },
  { href: '/admin/plans',     label: 'Plans',     icon: Package         },
  { href: '/admin/customers', label: 'Customers', icon: Users           },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart3       },
  { href: '/admin/settings',  label: 'Settings',  icon: Settings        },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-[#080810] border-r border-white/[0.05] flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-white/[0.05]">
        <Link href="/admin/dashboard" className="flex flex-col gap-1.5">
          <Image
            src="/navbar_logo.png"
            alt="Axon eSIM"
            width={200}
            height={60}
            className="h-16 w-auto object-contain opacity-90 hover:opacity-100 transition-opacity"
          />
          <div className="text-[10px] text-slate-600 tracking-widest uppercase pl-0.5 font-semibold">Admin Panel</div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-0.5">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                active
                  ? 'bg-gradient-to-r from-violet-600/20 to-indigo-600/10 text-violet-300 border border-violet-500/20'
                  : 'text-slate-500 hover:text-slate-200 hover:bg-white/[0.04]'
              )}
            >
              <Icon className={cn('w-4 h-4 flex-shrink-0', active ? 'text-violet-400' : '')} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className="p-4 border-t border-white/[0.05] space-y-0.5">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-500 hover:text-slate-200 hover:bg-white/[0.04] transition-all"
        >
          <Globe className="w-4 h-4" />
          View Website
        </Link>
        <form action={signOut}>
          <button
            type="submit"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-500 hover:text-red-400 hover:bg-red-500/[0.06] transition-all"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </form>
      </div>
    </aside>
  )
}
