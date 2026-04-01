'use client'

import { useActionState } from 'react'
import { signIn } from '@/app/actions/auth'
import { Loader2, Lock, Mail } from 'lucide-react'

export default function SignInPage() {
  const [state, action, pending] = useActionState(signIn, undefined)

  return (
    <div className="w-full max-w-sm">
      {/* Logo / heading */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 mb-4">
          <Lock className="w-5 h-5 text-cyan-400" />
        </div>
        <h1 className="text-2xl font-black">Admin Sign In</h1>
        <p className="text-sm text-slate-500 mt-1">Axon eSIM control panel</p>
      </div>

      <form action={action} className="space-y-4">
        <div>
          <label htmlFor="email" className="text-xs text-slate-500 font-medium mb-1.5 flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5" /> Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="admin@example.com"
            className="input w-full"
          />
        </div>

        <div>
          <label htmlFor="password" className="text-xs text-slate-500 font-medium mb-1.5 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5" /> Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            placeholder="••••••••"
            className="input w-full"
          />
        </div>

        {state && 'error' in state && (
          <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
            {state.error}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="btn-primary w-full py-3 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {pending ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Signing in…</>
          ) : (
            'Sign In'
          )}
        </button>
      </form>
    </div>
  )
}
