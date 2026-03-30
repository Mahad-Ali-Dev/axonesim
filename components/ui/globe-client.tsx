'use client'
import dynamic from 'next/dynamic'

export const World = dynamic(
  () => import('@/components/ui/globe').then(m => m.World),
  { ssr: false }
)
