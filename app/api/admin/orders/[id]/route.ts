import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase' // eslint-disable-line
import { deliverESIM } from '@/lib/esim'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { action } = await req.json()
  const supabase = createAdminClient()

  try {
    switch (action) {
      case 'deliver':
        await deliverESIM(id)
        return NextResponse.json({ message: 'eSIM delivered successfully' })

      case 'resend':
        await deliverESIM(id)
        return NextResponse.json({ message: 'eSIM resent successfully' })

      case 'markActivated':
        await (supabase.from('orders') as any).update({
          status: 'activated',
          activated_at: new Date().toISOString(),
        }).eq('id', id)
        return NextResponse.json({ message: 'Order marked as activated' })

      case 'cancel':
        await (supabase.from('orders') as any).update({ status: 'cancelled' }).eq('id', id)
        return NextResponse.json({ message: 'Order cancelled' })

      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
    }
  } catch (e) {
    console.error('Admin order action error:', e)
    return NextResponse.json({ error: 'Action failed' }, { status: 500 })
  }
}
