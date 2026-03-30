import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase' // eslint-disable-line

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json()
  const supabase = createAdminClient()
  const { data, error } = await (supabase.from('plans') as any).update(body).eq('id', id).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ plan: data })
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = createAdminClient()
  await supabase.from('plans').delete().eq('id', id)
  return NextResponse.json({ ok: true })
}
