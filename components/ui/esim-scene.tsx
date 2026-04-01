'use client'
import { useRef, useMemo, type MutableRefObject } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'

/* ─────────────────────────────────────────────
   Helpers
───────────────────────────────────────────── */
function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

/* ─────────────────────────────────────────────
   Contact Pads  (SIM gold grid)
───────────────────────────────────────────── */
function ContactPads() {
  const grid: [number, number][] = [
    [-0.27, 0.22], [0, 0.22], [0.27, 0.22],
    [-0.27,-0.06], [0,-0.06], [0.27,-0.06],
  ]
  return (
    <group position={[-1.0, 0.1, 0.069]}>
      {grid.map(([x, y], i) => (
        <mesh key={i} position={[x, y, 0]}>
          <boxGeometry args={[0.21, 0.15, 0.005]} />
          <meshStandardMaterial color="#d4a843" metalness={0.98} roughness={0.04} />
        </mesh>
      ))}
    </group>
  )
}

/* ─────────────────────────────────────────────
   Circuit Traces
───────────────────────────────────────────── */
function CircuitTraces() {
  const traces = useMemo(() => {
    const seed = (n: number) => Math.abs(Math.sin(n * 127.1 + 311.7)) * 0.5 + 0.5
    const lines: { pos: [number, number, number]; rot: number; len: number }[] = []
    const hY = [0.72, 0.45, 0.18, -0.10, -0.38, -0.62]
    hY.forEach((y, i) => {
      lines.push({ pos: [0.25 + seed(i) * 0.6, y, 0.069], rot: 0, len: 0.25 + seed(i + 10) * 0.9 })
    })
    const vX = [0.35, 0.7, 1.05, 1.3]
    vX.forEach((x, i) => {
      lines.push({ pos: [x, seed(i + 20) * 0.6 - 0.2, 0.069], rot: Math.PI / 2, len: 0.12 + seed(i + 30) * 0.28 })
    })
    return lines
  }, [])

  return (
    <group>
      {traces.map((t, i) => (
        <mesh key={i} position={t.pos} rotation={[0, 0, t.rot]}>
          <boxGeometry args={[t.len, 0.011, 0.001]} />
          <meshStandardMaterial color="#00C6FF" emissive="#00C6FF" emissiveIntensity={0.38} />
        </mesh>
      ))}
    </group>
  )
}

/* ─────────────────────────────────────────────
   Ambient Particles  (replaces Sparkles)
───────────────────────────────────────────── */
function AmbientParticles({ timeRef }: { timeRef: MutableRefObject<number> }) {
  const ref = useRef<THREE.Points>(null)
  const count = 80

  const { geo, phases } = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const ph  = new Float32Array(count)
    const seed = (n: number) => Math.abs(Math.sin(n * 9301 + 49297))
    for (let i = 0; i < count; i++) {
      const theta = seed(i) * Math.PI * 2
      const phi   = Math.acos(2 * seed(i + 500) - 1)
      const r     = 1.8 + seed(i + 1000) * 2.8
      pos[i * 3]     = r * Math.sin(phi) * Math.cos(theta)
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.7
      pos[i * 3 + 2] = r * Math.cos(phi) * 0.35
      ph[i] = seed(i + 2000) * Math.PI * 2
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    return { geo: g, phases: ph }
  }, [])

  useFrame((_, delta) => {
    if (!ref.current) return
    const mat = ref.current.material as THREE.PointsMaterial
    mat.opacity = 0.3 + Math.sin(timeRef.current * 0.8) * 0.12
  })

  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial size={0.04} color="#3D8BFD" transparent opacity={0.35} sizeAttenuation depthWrite={false} />
    </points>
  )
}

/* ─────────────────────────────────────────────
   Country Dots  (global phase)
───────────────────────────────────────────── */
function CountryDots({ progressRef, timeRef }: { progressRef: MutableRefObject<number>; timeRef: MutableRefObject<number> }) {
  const groupRef = useRef<THREE.Group>(null)
  const matsRef  = useRef<THREE.MeshBasicMaterial[]>([])

  const positions = useMemo<[number, number, number][]>(() => {
    const pts: [number, number, number][] = []
    const seed = (n: number) => Math.abs(Math.sin(n * 43758.5453))
    for (let i = 0; i < 12; i++) {
      const theta = seed(i) * Math.PI * 2
      const phi   = Math.acos(2 * seed(i + 100) - 1)
      pts.push([
        2.8 * Math.sin(phi) * Math.cos(theta),
        2.8 * Math.sin(phi) * Math.sin(theta),
        2.8 * Math.cos(phi) * 0.4,
      ])
    }
    return pts
  }, [])

  useFrame((_, delta) => {
    if (!groupRef.current) return
    const p = progressRef.current
    const phase = Math.min(4, Math.floor(p * 5))
    const t = timeRef.current

    const targetScale = phase === 1 ? 1.0 : 0.01
    const cur = groupRef.current.scale.x
    const next = lerp(cur, targetScale, delta * 2.5)
    groupRef.current.scale.setScalar(next)
    groupRef.current.rotation.y += delta * 0.18

    matsRef.current.forEach((m, i) => {
      if (m) m.opacity = 0.5 + Math.sin(t * 2 + i * 0.8) * 0.3
    })
  })

  return (
    <group ref={groupRef} scale={0.01}>
      {positions.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshBasicMaterial
            ref={(el: THREE.MeshBasicMaterial | null) => { if (el) matsRef.current[i] = el }}
            color="#00C6FF"
            transparent
            opacity={0.7}
          />
        </mesh>
      ))}
    </group>
  )
}

/* ─────────────────────────────────────────────
   Speed Streaks  (phase 2)
───────────────────────────────────────────── */
function SpeedStreaks({ progressRef }: { progressRef: MutableRefObject<number> }) {
  const groupRef = useRef<THREE.Group>(null)
  const matsRef  = useRef<THREE.MeshBasicMaterial[]>([])

  const streaks = useMemo(() => {
    const seed = (n: number) => Math.abs(Math.sin(n * 127.1))
    return Array.from({ length: 18 }, (_, i) => ({
      angle:  seed(i) * Math.PI * 2,
      radius: 1.8 + seed(i + 20) * 1.5,
      length: 0.4 + seed(i + 40) * 0.8,
      y:      (seed(i + 60) - 0.5) * 2,
    }))
  }, [])

  useFrame((_, delta) => {
    if (!groupRef.current) return
    const phase = Math.min(4, Math.floor(progressRef.current * 5))
    const targetOpacity = phase === 2 ? 0.55 : 0.0

    matsRef.current.forEach(m => {
      if (m) m.opacity = lerp(m.opacity, targetOpacity, delta * 4)
    })
    groupRef.current.rotation.z += delta * 0.6
  })

  return (
    <group ref={groupRef}>
      {streaks.map((s, i) => {
        const x = Math.cos(s.angle) * s.radius
        const z = Math.sin(s.angle) * s.radius * 0.3
        return (
          <mesh key={i} position={[x, s.y, z]} rotation={[0, 0, s.angle + Math.PI / 2]}>
            <boxGeometry args={[s.length, 0.015, 0.01]} />
            <meshBasicMaterial
              ref={(el: THREE.MeshBasicMaterial | null) => { if (el) matsRef.current[i] = el }}
              color={i % 2 === 0 ? '#0D6EFD' : '#00C6FF'}
              transparent
              opacity={0}
            />
          </mesh>
        )
      })}
    </group>
  )
}

/* ─────────────────────────────────────────────
   Security Orbs  (phase 4)
───────────────────────────────────────────── */
function SecurityOrbs({ progressRef }: { progressRef: MutableRefObject<number> }) {
  const g1 = useRef<THREE.Group>(null)
  const g2 = useRef<THREE.Group>(null)

  useFrame((_, delta) => {
    const phase = Math.min(4, Math.floor(progressRef.current * 5))
    const vis = phase === 4 ? 1 : 0

    for (const g of [g1, g2]) {
      g.current?.children.forEach(c => {
        const mat = (c as THREE.Mesh).material as THREE.MeshStandardMaterial
        if (mat) mat.opacity = lerp(mat.opacity ?? 0, vis * 0.85, delta * 3)
      })
    }
    if (g1.current) { g1.current.rotation.y += delta * 0.8; g1.current.rotation.x += delta * 0.3 }
    if (g2.current) { g2.current.rotation.y -= delta * 0.5; g2.current.rotation.z += delta * 0.2 }
  })

  return (
    <>
      <group ref={g1}>
        {[0, 120, 240].map((deg, i) => {
          const rad = deg * Math.PI / 180
          return (
            <mesh key={i} position={[Math.cos(rad) * 2.2, Math.sin(rad) * 2.2, 0]}>
              <octahedronGeometry args={[0.15, 0]} />
              <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={0.6} transparent opacity={0} />
            </mesh>
          )
        })}
      </group>
      <group ref={g2}>
        {[60, 180, 300].map((deg, i) => {
          const rad = deg * Math.PI / 180
          return (
            <mesh key={i} position={[Math.cos(rad) * 3.0, Math.sin(rad) * 3.0, 0]}>
              <tetrahedronGeometry args={[0.1, 0]} />
              <meshStandardMaterial color="#3D8BFD" emissive="#3D8BFD" emissiveIntensity={0.5} transparent opacity={0} />
            </mesh>
          )
        })}
      </group>
    </>
  )
}

/* ─────────────────────────────────────────────
   Main eSIM Chip
───────────────────────────────────────────── */
function ESIMChip({ progressRef, timeRef }: { progressRef: MutableRefObject<number>; timeRef: MutableRefObject<number> }) {
  const groupRef        = useRef<THREE.Group>(null)
  const chipMatRef      = useRef<THREE.MeshStandardMaterial>(null)
  const glowMatRef      = useRef<THREE.MeshBasicMaterial>(null)
  const ring1Ref        = useRef<THREE.Mesh>(null)
  const ring2Ref        = useRef<THREE.Mesh>(null)
  const ring3Ref        = useRef<THREE.Mesh>(null)
  const deliveryGlowRef = useRef<THREE.Mesh>(null)

  useFrame((_, delta) => {
    const t = timeRef.current
    const p = progressRef.current

    const phaseIndex = Math.min(4, Math.floor(p * 5))
    const floatY = Math.sin(t * 0.75) * 0.09

    let tRotY    = 0
    let tRotX    = 0
    let tScale   = 1.0
    let tZ       = 0
    let tEmissive= 0.22
    let tEmColor = new THREE.Color('#0D6EFD')

    const scrollReveal = Math.min(1, p * 5)
    
    switch (phaseIndex) {
      case 0:
        tRotY     = -0.8 + (scrollReveal * 0.8)
        tRotX     = -0.6 + (scrollReveal * 0.45)
        tScale    = 0.75 + (scrollReveal * 0.4)
        tZ        = -5 + (scrollReveal * 5)
        tEmissive = 0.15 + (scrollReveal * 0.8)
        break
      case 1:
        tRotY     = 0.22
        tRotX     = -0.15
        tScale    = 1.15
        tEmissive = 0.95
        tEmColor  = new THREE.Color('#00C6FF')
        break
      case 2:
        tRotY     = Math.PI * 2 * (p - 0.4) * 2
        tRotX     = -0.25
        tScale    = 1.1
        tEmissive = 1.2
        tEmColor  = new THREE.Color('#f59e0b')
        break
      case 3:
        tRotY     = Math.sin(t * 0.4) * 0.1
        tRotX     = -0.05
        tScale    = 1.2
        tEmissive = 0.7 + Math.sin(t * 4.5) * 0.4
        tEmColor  = new THREE.Color('#10b981')
        break
      case 4:
        tRotY     = Math.sin(t * 0.35) * 0.28
        tRotX     = Math.sin(t * 0.28) * 0.1
        tScale    = 1.15
        tEmissive = 0.6
        tEmColor  = new THREE.Color('#FF6B6B')
        break
    }

    if (groupRef.current) {
      if (phaseIndex === 2) {
        groupRef.current.rotation.y = tRotY
      } else {
        groupRef.current.rotation.y = lerp(groupRef.current.rotation.y, tRotY, delta * 2.8)
      }
      groupRef.current.rotation.x = lerp(groupRef.current.rotation.x, tRotX, delta * 2.8)
      const cur = groupRef.current.scale.x
      groupRef.current.scale.setScalar(lerp(cur, tScale, delta * 2.8))
      groupRef.current.position.y = floatY + 0.5
      groupRef.current.position.z = lerp(groupRef.current.position.z, tZ, delta * 2.8)
    }

    if (chipMatRef.current) {
      chipMatRef.current.emissiveIntensity = lerp(chipMatRef.current.emissiveIntensity, tEmissive, delta * 5)
      chipMatRef.current.emissive.lerp(tEmColor, delta * 3)
    }

    if (glowMatRef.current) {
      glowMatRef.current.opacity = 0.12 + Math.sin(t * 1.1) * 0.03 + tEmissive * 0.12
      glowMatRef.current.color.lerp(tEmColor, delta * 2)
    }

    if (ring1Ref.current) {
      ring1Ref.current.rotation.z += delta * 0.42
      const rs = phaseIndex >= 1 ? 1.28 : 1.0
      ring1Ref.current.scale.setScalar(lerp(ring1Ref.current.scale.x, rs, delta * 1.6))
      const rm = ring1Ref.current.material as THREE.MeshBasicMaterial
      rm.opacity = lerp(rm.opacity, phaseIndex === 2 ? 0.95 : 0.65, delta * 3)
      rm.color.lerp(tEmColor, delta * 2)
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.z -= delta * 0.24
      ring2Ref.current.rotation.y += delta * 0.14
      const rs = phaseIndex >= 1 ? 1.45 : 1.0
      ring2Ref.current.scale.setScalar(lerp(ring2Ref.current.scale.x, rs, delta * 1.6))
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.x += delta * 0.19
      ring3Ref.current.rotation.z += delta * 0.09
    }

    if (deliveryGlowRef.current) {
      const mat = deliveryGlowRef.current.material as THREE.MeshBasicMaterial
      const tOp = phaseIndex === 3 ? 0.15 + Math.sin(t * 5) * 0.08 : 0
      mat.opacity = lerp(mat.opacity, tOp, delta * 4)
      deliveryGlowRef.current.scale.setScalar(1.2 + Math.sin(t * 3) * 0.08)
    }
  })

  return (
    <>
      {/* Atmospheric glow */}
      <mesh>
        <sphereGeometry args={[3.5, 32, 32]} />
        <meshBasicMaterial ref={glowMatRef} color="#0D6EFD" transparent opacity={0.05} side={THREE.BackSide} />
      </mesh>

      {/* Orbit rings */}
      <mesh ref={ring1Ref} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.4, 0.016, 16, 128]} />
        <meshBasicMaterial color="#0D6EFD" transparent opacity={0.65} />
      </mesh>
      <mesh ref={ring2Ref} rotation={[Math.PI / 3, 0.3, 0]}>
        <torusGeometry args={[3.1, 0.011, 16, 128]} />
        <meshBasicMaterial color="#00C6FF" transparent opacity={0.38} />
      </mesh>
      <mesh ref={ring3Ref} rotation={[0.2, 0.5, Math.PI / 6]}>
        <torusGeometry args={[3.9, 0.007, 16, 128]} />
        <meshBasicMaterial color="#3D8BFD" transparent opacity={0.20} />
      </mesh>

      {/* Delivery glow ring */}
      <mesh ref={deliveryGlowRef}>
        <ringGeometry args={[1.8, 2.5, 64]} />
        <meshBasicMaterial color="#10b981" transparent opacity={0} side={THREE.DoubleSide} />
      </mesh>

      {/* ──────── Chip body ──────── */}
      <group ref={groupRef}>
        <RoundedBox args={[3.2, 2.1, 0.13]} radius={0.13} smoothness={6}>
          <meshStandardMaterial
            ref={chipMatRef}
            color="#0A1128"
            metalness={1.0}
            roughness={0.05}
            emissive="#0D6EFD"
            emissiveIntensity={0.8}
          />
        </RoundedBox>

        {/* Neon rim light */}
        <RoundedBox args={[3.28, 2.18, 0.09]} radius={0.15} smoothness={6}>
          <meshBasicMaterial color="#00C6FF" transparent opacity={0.6} side={THREE.BackSide} />
        </RoundedBox>

        <ContactPads />
        <CircuitTraces />

        {/* Center chip die */}
        <mesh position={[0.52, -0.14, 0.069]}>
          <boxGeometry args={[0.56, 0.56, 0.01]} />
          <meshStandardMaterial color="#071630" metalness={0.9} roughness={0.1} emissive="#00C6FF" emissiveIntensity={0.5} />
        </mesh>
        <mesh position={[0.52, -0.14, 0.076]}>
          <boxGeometry args={[0.36, 0.36, 0.005]} />
          <meshStandardMaterial color="#091f45" metalness={0.95} roughness={0.05} emissive="#3D8BFD" emissiveIntensity={0.7} />
        </mesh>

        {/* Branding lines */}
        <mesh position={[0.5, 0.66, 0.069]}>
          <boxGeometry args={[1.15, 0.017, 0.001]} />
          <meshBasicMaterial color="#0A58CA" transparent opacity={0.72} />
        </mesh>
        <mesh position={[0.38, 0.50, 0.069]}>
          <boxGeometry args={[0.72, 0.011, 0.001]} />
          <meshBasicMaterial color="#00C6FF" transparent opacity={0.55} />
        </mesh>

        {/* Logo dots */}
        {[0, 1, 2].map(i => (
          <mesh key={i} position={[0.22 + i * 0.14, 0.38, 0.069]}>
            <circleGeometry args={[0.026, 12]} />
            <meshBasicMaterial color="#93C5FD" transparent opacity={0.6} />
          </mesh>
        ))}
      </group>
    </>
  )
}

/* ─────────────────────────────────────────────
   Lights — color shifts per phase
───────────────────────────────────────────── */
function Lights({ progressRef }: { progressRef: MutableRefObject<number> }) {
  const l1 = useRef<THREE.PointLight>(null)
  const l2 = useRef<THREE.PointLight>(null)

  const phaseColors = useMemo(() => [
    new THREE.Color('#0D6EFD'),
    new THREE.Color('#00C6FF'),
    new THREE.Color('#f59e0b'),
    new THREE.Color('#10b981'),
    new THREE.Color('#3D8BFD'),
  ], [])

  useFrame((_, delta) => {
    const phase = Math.min(4, Math.floor(progressRef.current * 5))
    if (l1.current) l1.current.color.lerp(phaseColors[phase], delta * 2)
    if (l2.current) l2.current.color.lerp(phaseColors[(phase + 2) % 5], delta * 1.5)
  })

  return (
    <>
      <ambientLight intensity={0.55} color="#3D8BFD" />
      <pointLight ref={l1} position={[4, 4, 5]}   intensity={5.0} color="#0D6EFD" />
      <pointLight ref={l2} position={[-4, -3, 4]}  intensity={3.2} color="#00C6FF" />
      <pointLight            position={[0, 6, -2]}  intensity={1.8} color="#3D8BFD" />
      <directionalLight      position={[2, 3, 4]}   intensity={1.2} color="#ffffff" />
    </>
  )
}

/* ─────────────────────────────────────────────
   Time accumulator — avoids state.clock entirely
───────────────────────────────────────────── */
function TimeAccumulator({ timeRef }: { timeRef: MutableRefObject<number> }) {
  useFrame((_, delta) => {
    timeRef.current += delta
  })
  return null
}

/* ─────────────────────────────────────────────
   Scene root — shares timeRef across all children
───────────────────────────────────────────── */
function Scene({ progressRef }: { progressRef: MutableRefObject<number> }) {
  const timeRef = useRef(0)
  return (
    <>
      <TimeAccumulator timeRef={timeRef} />
      <Lights progressRef={progressRef} />
      <AmbientParticles timeRef={timeRef} />
      <CountryDots progressRef={progressRef} timeRef={timeRef} />
      <SpeedStreaks progressRef={progressRef} />
      <SecurityOrbs progressRef={progressRef} />
      
      {/* Premium Floor */}
      <mesh position={[0, -2.8, -2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial
          color="#070D1E"
          metalness={0.8}
          roughness={0.15}
          transparent
          opacity={0.85}
        />
      </mesh>

      <ESIMChip progressRef={progressRef} timeRef={timeRef} />
    </>
  )
}

/* ─────────────────────────────────────────────
   Exported Canvas
───────────────────────────────────────────── */
export interface ESIMSceneProps {
  progressRef: MutableRefObject<number>
}

export function ESIMScene({ progressRef }: ESIMSceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 0.3, 7.2], fov: 38 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      className="absolute inset-0 w-full h-full"
    >
      <Scene progressRef={progressRef} />
    </Canvas>
  )
}
