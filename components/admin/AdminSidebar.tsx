'use client'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, ShoppingCart, Package, Users,
  BarChart3, Settings, LogOut, Globe, X,
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

interface Props {
  mobileOpen?: boolean
  onClose?: () => void
}

export default function AdminSidebar({ mobileOpen, onClose }: Props) {
  const pathname = usePathname()

  return (
    <aside className={cn(
      'fixed left-0 top-0 h-screen w-64 bg-white border-r border-slate-200 flex flex-col z-30 transition-transform duration-200 ease-in-out',
      'lg:translate-x-0',
      mobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0',
    )}>
      {/* Logo */}
      <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
        <Link href="/admin/dashboard" className="flex flex-col gap-1">
          <Image
            src="/navbar_logo.png"
            alt="Axon eSIM"
            width={160}
            height={48}
            className="h-12 w-auto object-contain"
          />
          <span className="text-[9px] text-slate-400 tracking-widest uppercase font-semibold pl-0.5">
            Admin Panel
          </span>
        </Link>
        {/* Mobile close */}
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4 text-slate-500" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                active
                  ? 'bg-violet-50 text-violet-700 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100',
              )}
            >
              <Icon className={cn('w-4 h-4 flex-shrink-0', active ? 'text-violet-600' : 'text-slate-400')} />
              {label}
              {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-violet-500" />}
            </Link>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className="p-3 border-t border-slate-100 space-y-0.5">
        <Link
          href="/"
          target="_blank"
          onClick={onClose}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-all"
        >
          <Globe className="w-4 h-4 text-slate-400" />
          View Website
        </Link>
        <form action={signOut}>
          <button
            type="submit"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-500 hover:text-red-600 hover:bg-red-50 transition-all"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </form>
      </div>
    </aside>
  )
}
