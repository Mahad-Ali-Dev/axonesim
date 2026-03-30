export function BackgroundBeams() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none" aria-hidden>
      {/* Primary orb — top-left */}
      <div
        className="absolute -top-40 -left-40 w-[700px] h-[700px] rounded-full animate-aurora-1"
        style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 70%)' }}
      />
      {/* Secondary orb — bottom-right */}
      <div
        className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full animate-aurora-2"
        style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)' }}
      />
      {/* Center accent */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full animate-float-slow opacity-30"
        style={{ background: 'radial-gradient(ellipse, rgba(99,102,241,0.08) 0%, transparent 70%)' }}
      />
    </div>
  )
}

export function BackgroundBeamsSubtle() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none" aria-hidden>
      <div
        className="absolute -top-20 right-1/4 w-[400px] h-[400px] rounded-full animate-aurora-1"
        style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%)' }}
      />
      <div
        className="absolute -bottom-20 left-1/4 w-[400px] h-[400px] rounded-full animate-aurora-2"
        style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 70%)' }}
      />
    </div>
  )
}
