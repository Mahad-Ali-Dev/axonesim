'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { Lock, Loader2, AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react'

export default function ResetPasswordPage() {
  const router  = useRouter()
  const [ready,   setReady]   = useState(false)   // session established from the email link
  const [invalid, setInvalid] = useState(false)   // link expired / already used

  const [password, setPassword] = useState('')
  const [confirm,  setConfirm]  = useState('')
  const [showPw,   setShowPw]   = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')
  const [done,     setDone]     = useState(false)

  // Supabase embeds the recovery token in the URL hash.
  // onAuthStateChange picks it up and fires PASSWORD_RECOVERY.
  useEffect(() => {
    const supabase = createSupabaseBrowserClient()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') setReady(true)
      // If SIGNED_IN fires without PASSWORD_RECOVERY it means the link was already used
    })

    // Fallback: if there's already a recovery session in the URL
    const hash = window.location.hash
    if (hash.includes('type=recovery')) setReady(true)
    else if (!hash.includes('access_token')) {
      // No token at all — link is missing or expired
      setTimeout(() => { if (!ready) setInvalid(true) }, 1500)
    }

    return () => subscription.unsubscribe()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleReset(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (password.length < 8)      { setError('Password must be at least 8 characters.'); return }
    if (password !== confirm)      { setError('Passwords do not match.'); return }

    setLoading(true)
    const supabase = createSupabaseBrowserClient()
    const { error: err } = await supabase.auth.updateUser({ password })

    if (err) {
      setError(err.message)
      setLoading(false)
      return
    }

    setDone(true)
    setTimeout(() => router.push('/account'), 2500)
  }

  /* ── Success state ── */
  if (done) {
    return (
      <div className="min-h-screen bg-[#010206] flex flex-col items-center justify-center px-4 py-16">
        <Link href="/" className="mb-8">
          <Image src="/navbar_logo.png" alt="Axon eSIM" width={240} height={72} className="h-20 w-auto object-contain opacity-90" />
        </Link>
        <div className="w-full max-w-sm bg-white/[0.03] border border-white/[0.07] rounded-3xl p-8 text-center">
          <div className="w-14 h-14 rounded-full bg-green-500/15 border border-green-500/25 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-7 h-7 text-green-400" />
          </div>
          <h2 className="text-lg font-black text-white mb-2">Password updated!</h2>
          <p className="text-sm text-slate-500">Redirecting you to your account…</p>
        </div>
      </div>
    )
  }

  /* ── Invalid / expired link ── */
  if (invalid) {
    return (
      <div className="min-h-screen bg-[#010206] flex flex-col items-center justify-center px-4 py-16">
        <Link href="/" className="mb-8">
          <Image src="/navbar_logo.png" alt="Axon eSIM" width={240} height={72} className="h-20 w-auto object-contain opacity-90" />
        </Link>
        <div className="w-full max-w-sm bg-white/[0.03] border border-white/[0.07] rounded-3xl p-8 text-center">
          <div className="w-14 h-14 rounded-full bg-red-500/15 border border-red-500/25 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-7 h-7 text-red-400" />
          </div>
          <h2 className="text-lg font-black text-white mb-2">Link expired</h2>
          <p className="text-sm text-slate-500 mb-6">
            This reset link has expired or already been used. Request a new one.
          </p>
          <Link
            href="/account/forgot-password"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-violet-600/20 border border-violet-500/30 text-violet-300 text-sm font-semibold hover:bg-violet-600/30 transition-all"
          >
            Request new link
          </Link>
        </div>
      </div>
    )
  }

  /* ── Loading while waiting for Supabase to parse the hash ── */
  if (!ready) {
    return (
      <div className="min-h-screen bg-[#010206] flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-violet-400 animate-spin" />
      </div>
    )
  }

  /* ── Main form ── */
  return (
    <div className="min-h-screen bg-[#010206] flex flex-col items-center justify-center px-4 py-16">
      <Link href="/" className="mb-8">
        <Image src="/navbar_logo.png" alt="Axon eSIM" width={240} height={72} className="h-20 w-auto object-contain opacity-90 hover:opacity-100 transition-opacity" />
      </Link>

      <div className="w-full max-w-sm">
        <div className="bg-white/[0.03] border border-white/[0.07] rounded-3xl p-8">
          <h1 className="text-xl font-black text-white mb-1">Choose new password</h1>
          <p className="text-sm text-slate-500 mb-7">Enter a strong password — at least 8 characters.</p>

          {error && (
            <div className="flex items-start gap-2.5 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 mb-5">
              <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <form onSubmit={handleReset} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wide">
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                <input
                  type={showPw ? 'text' : 'password'}
                  required
                  autoComplete="new-password"
                  placeholder="Min 8 characters"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-10 pr-11 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-violet-500/60 focus:bg-white/[0.06] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-300 transition-colors"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Strength bar */}
              {password.length > 0 && (
                <div className="mt-2 flex gap-1">
                  {[1, 2, 3, 4].map(level => {
                    const strength = password.length >= 12 && /[A-Z]/.test(password) && /[0-9]/.test(password) ? 4
                      : password.length >= 10 ? 3
                      : password.length >= 8  ? 2
                      : 1
                    return (
                      <div
                        key={level}
                        className={`h-1 flex-1 rounded-full transition-all ${
                          level <= strength
                            ? strength === 4 ? 'bg-green-400'
                              : strength === 3 ? 'bg-yellow-400'
                              : strength === 2 ? 'bg-orange-400'
                              : 'bg-red-400'
                            : 'bg-white/10'
                        }`}
                      />
                    )
                  })}
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wide">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                <input
                  type="password"
                  required
                  autoComplete="new-password"
                  placeholder="••••••••"
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  className={`w-full bg-white/[0.04] border rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:bg-white/[0.06] transition-all ${
                    confirm && confirm !== password
                      ? 'border-red-500/50 focus:border-red-500/60'
                      : confirm && confirm === password
                      ? 'border-green-500/40 focus:border-green-500/60'
                      : 'border-white/[0.08] focus:border-violet-500/60'
                  }`}
                />
                {confirm && confirm === password && (
                  <CheckCircle className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-green-400" />
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-500 text-white text-sm font-bold shadow-lg shadow-violet-600/25 hover:shadow-violet-600/40 hover:scale-[1.02] disabled:opacity-60 disabled:scale-100 transition-all duration-200"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
