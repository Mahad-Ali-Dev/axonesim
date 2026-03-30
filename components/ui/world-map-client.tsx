'use client'
import dynamic from 'next/dynamic'

const WorldMap = dynamic(() => import('@/components/ui/world-map'), { ssr: false })

export { WorldMap }
