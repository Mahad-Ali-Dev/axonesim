import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'

const BUCKET = 'esim-qr'

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData()
    const file = form.get('file') as File | null
    const orderId = form.get('orderId') as string | null

    if (!file || !orderId) {
      return NextResponse.json({ error: 'file and orderId are required' }, { status: 400 })
    }

    const supabase = createAdminClient()

    // Ensure bucket exists (no-op if it already does)
    await supabase.storage.createBucket(BUCKET, { public: true }).catch(() => null)

    const ext = file.name.split('.').pop() ?? 'png'
    const path = `${orderId}/${Date.now()}.${ext}`
    const buffer = Buffer.from(await file.arrayBuffer())

    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(path, buffer, { contentType: file.type, upsert: true })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(path)
    return NextResponse.json({ url: urlData.publicUrl })
  } catch (e) {
    console.error('Upload error:', e)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
