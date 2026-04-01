import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) return NextResponse.json({ url: null })

    const ext  = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const path = `screenshots/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

    const supabase  = createAdminClient()
    const arrayBuf  = await file.arrayBuffer()
    const { error } = await supabase.storage
      .from('payments')
      .upload(path, arrayBuf, { contentType: file.type, upsert: false })

    if (error) {
      // Storage bucket may not be configured yet — non-fatal
      console.warn('Screenshot upload skipped:', error.message)
      return NextResponse.json({ url: null })
    }

    const { data: { publicUrl } } = supabase.storage.from('payments').getPublicUrl(path)
    return NextResponse.json({ url: publicUrl })
  } catch (e) {
    console.error('Upload error:', e)
    return NextResponse.json({ url: null })
  }
}
