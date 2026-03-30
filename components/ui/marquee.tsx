import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

interface MarqueeProps {
  children: ReactNode
  reverse?: boolean
  speed?: 'slow' | 'normal' | 'fast'
  pauseOnHover?: boolean
  className?: string
}

export function Marquee({
  children,
  reverse = false,
  speed = 'normal',
  pauseOnHover = true,
  className,
}: MarqueeProps) {
  const animClass =
    speed === 'fast'  ? 'animate-marquee-fast' :
    speed === 'slow'  ? 'animate-marquee' :
    reverse           ? 'animate-marquee-rev' :
                        'animate-marquee'

  return (
    <div
      className={cn('overflow-hidden', className)}
      style={{ maskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)' }}
    >
      <div
        className={cn(
          'flex gap-4 w-max',
          animClass,
          pauseOnHover && 'hover:[animation-play-state:paused]'
        )}
      >
        {children}
        {children}
      </div>
    </div>
  )
}
