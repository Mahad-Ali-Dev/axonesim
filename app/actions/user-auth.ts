'use server'

import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export type UserAuthState = { error: string } | { success: true } | undefined

export async function userSignIn(
  _prev: UserAuthState,
  formData: FormData
): Promise<UserAuthState> {
  const email    = (formData.get('email') as string)?.trim()
  const password = formData.get('password') as string

  if (!email || !password) return { error: 'Email and password are required.' }

  const supabase = await createSupabaseServerClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) return { error: error.message }

  redirect('/account')
}

export async function userSignUp(
  _prev: UserAuthState,
  formData: FormData
): Promise<UserAuthState> {
  const name     = (formData.get('name') as string)?.trim()
  const email    = (formData.get('email') as string)?.trim()
  const password = formData.get('password') as string
  const confirm  = formData.get('confirm') as string

  if (!name || !email || !password)  return { error: 'All fields are required.' }
  if (password !== confirm)          return { error: 'Passwords do not match.' }
  if (password.length < 8)           return { error: 'Password must be at least 8 characters.' }

  const supabase = await createSupabaseServerClient()
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: name } },
  })

  if (error) return { error: error.message }

  return { success: true }
}

export async function userSignOut() {
  const supabase = await createSupabaseServerClient()
  await supabase.auth.signOut()
  redirect('/account/login')
}

export async function forgotPassword(
  _prev: UserAuthState,
  formData: FormData
): Promise<UserAuthState> {
  const email = (formData.get('email') as string)?.trim()
  if (!email || !email.includes('@')) return { error: 'Please enter a valid email address.' }

  const supabase = await createSupabaseServerClient()
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'}/account/reset-password`,
  })

  // Don't reveal whether the email exists — always show success
  if (error) console.error('Reset password error:', error.message)

  return { success: true }
}
