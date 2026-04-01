'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { forgotPassword } from '@/app/actions/user-auth'
import { Mail, Loader2, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [state, action, pending] = useActionState(forgotPassword, undefined)

  if (state && 'success' in state) {
    return (
      <div className="min-h-screen bg-[#010206] flex flex-col items-center justify-center px-4 py-16">
        <Link href="/" className="mb-8">
          <Image src="/navbar_logo.png" alt="Axon eSIM" width={240} height={72} className="h-20 w-auto object-contain opacity-90 hover:opacity-100 transition-opacity" />
        </Link>
        <div className="w-full max-w-sm bg-white/[0.03] border border-white/[0.07] rounded-3xl p-8 text-center">
          <div className="w-14 h-14 rounded-full bg-green-500/15 border border-green-500/25 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-7 h-7 text-green-400" />
          </div>
          <h2 className="text-lg font-black text-white mb-2">Check your email</h2>
          <p className="text-sm text-slate-500 mb-6 leading-relaxed">
            If an account exists for that email, we&apos;ve sent a password reset link. Check your inbox (and spam folder).
          </p>
          <Link
            href="/account/login"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-violet-600/20 border border-violet-500/30 text-violet-300 text-sm font-semibold hover:bg-violet-600/30 transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#010206] flex flex-col items-center justify-center px-4 py-16">
      {/* Logo */}
      <Link href="/" className="mb-8">
        <Image src="/navbar_logo.png" alt="Axon eSIM" width={240} height={72} className="h-20 w-auto object-contain opacity-90 hover:opacity-100 transition-opacity" />
      </Link>

      <div className="w-full max-w-sm">
        <div className="bg-white/[0.03] border border-white/[0.07] rounded-3xl p-8">

          {/* Back link */}
          <Link
            href="/account/login"
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors mb-6"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to login
          </Link>

          <h1 className="text-xl font-black text-white mb-1">Reset password</h1>
          <p className="text-sm text-slate-500 mb-7">
            Enter your email and we&apos;ll send you a reset link.
          </p>

          {state && 'error' in state && (
            <div className="flex items-start gap-2.5 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 mb-5">
              <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-400">{state.error}</p>
            </div>
          )}

          <form action={action} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wide">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                <input
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-violet-500/60 focus:bg-white/[0.06] transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={pending}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-500 text-white text-sm font-bold shadow-lg shadow-violet-600/25 hover:shadow-violet-600/40 hover:scale-[1.02] disabled:opacity-60 disabled:scale-100 transition-all duration-200"
            >
              {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Send Reset Link'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
