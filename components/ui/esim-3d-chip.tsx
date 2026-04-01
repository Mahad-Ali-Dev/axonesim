"use client"

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'

/* Shared clock functionality is now derived from useFrame state natively */

/* ─── Helpers ─── */
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v))
const smoothstep = (edge0: number, edge1: number, x: number) => {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1)
  return t * t * (3 - 2 * t)
}

/* ─── Types ─── */
type ProgressRef = React.RefObject<number>

/* ─── QR Pattern (back face) ─── */
const QR_PATTERN = [
  1,1,1,0,1,0,1,1, 1,0,1,1,0,1,0,1,
  1,1,1,0,1,0,1,1, 0,1,0,1,1,0,0,0,
  1,0,1,1,0,1,1,1, 1,1,0,0,1,1,0,1,
  1,0,1,0,1,0,1,1, 1,1,1,1,0,1,1,1,
]

function QrCodeGrid() {
  const blocks = useMemo(() => {
    const result: [number, number, number][] = []
    const size = 8, bs = 0.07, gap = 0.015
    const start = -((size - 1) * (bs + gap)) / 2
    for (let y = 0; y < size; y++)
      for (let x = 0; x < size; x++)
        if (QR_PATTERN[y * size + x])
          result.push([start + x * (bs + gap), start + y * (bs + gap), -0.032])
    return result
  }, [])

  const geo = useMemo(() => new THREE.BoxGeometry(0.07, 0.07, 0.003), [])
  const mat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#00C6FF', emissive: '#00C6FF', emissiveIntensity: 0.5,
  }), [])

  return (
    <group>
      {blocks.map((pos, i) => <mesh key={i} position={pos} geometry={geo} material={mat} />)}
    </group>
  )
}

/* ─── Contact Pads (front face) ─── */
const PADS: [number, number, number][] = [
  [-0.22, 0.12, 0.032], [0, 0.12, 0.032], [0.22, 0.12, 0.032],
  [-0.22, -0.12, 0.032], [0, -0.12, 0.032], [0.22, -0.12, 0.032],
  [-0.22, 0, 0.032], [0.22, 0, 0.032],
]

function ContactPads() {
  const geo = useMemo(() => new THREE.BoxGeometry(0.18, 0.1, 0.003), [])
  const mat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#c8a84e', metalness: 0.95, roughness: 0.15,
    emissive: '#d4a843', emissiveIntensity: 0.08,
  }), [])
  return (
    <group>
      {PADS.map((p, i) => <mesh key={i} position={p} geometry={geo} material={mat} />)}
    </group>
  )
}

/* ─── Main eSIM Chip ─── */
function EsimChip({ progressRef }: { progressRef: ProgressRef }) {
  const groupRef = useRef<THREE.Group>(null!)
  const chipMatRef = useRef<THREE.MeshPhysicalMaterial>(null!)
  const edgeMatRef = useRef<THREE.MeshStandardMaterial>(null!)

  const anim = useRef({
    rotX: 0, rotY: Math.PI / 2, rotZ: 0,
    posZ: -3, scale: 0, emissive: 0.12,
  })

  useFrame((state, delta) => {
    const p = progressRef.current ?? 0
    const t = state.clock.getElapsedTime()
    const a = anim.current
    const g = groupRef.current
    if (!g) return

    const reveal   = smoothstep(0, 0.18, p)
    const global   = smoothstep(0.18, 0.38, p)
    const speed    = smoothstep(0.38, 0.58, p)
    const delivery = smoothstep(0.58, 0.78, p)
    const payment  = smoothstep(0.78, 1.0, p)

    /* ── Targets ── */
    let tRotY = lerp(Math.PI / 2, 0, reveal)
    let tRotX = Math.sin(t * 0.5) * 0.04
    const tRotZ = Math.sin(t * 0.4) * 0.03
    let tPosZ = lerp(-3, 0, reveal)
    const tScale = lerp(0, 1, reveal)
    let tEmissive = 0.12

    // Phase 2 – global
    tRotX += lerp(0, -0.18, global) * (1 - speed * 0.6)
    tRotY += lerp(0, 0.3, global) * (1 - delivery)

    // Phase 3 – speed
    tPosZ += lerp(0, 0.7, speed) * (1 - delivery)
    tRotX += lerp(0, 0.12, speed) * (1 - delivery)
    tEmissive = lerp(tEmissive, 0.55, speed * (1 - delivery))

    // Phase 4 – delivery (flip to QR)
    tRotY += lerp(0, Math.PI, delivery)
    tEmissive = lerp(tEmissive, 0.75, delivery)

    // Phase 5 – payment (settle)
    tRotY += Math.sin(t * 0.3) * 0.04 * payment

    const bob = Math.sin(t * 0.8 + p * 2) * 0.07
    const d = Math.min(1, delta * 3.5)

    a.rotX = lerp(a.rotX, tRotX, d)
    a.rotY = lerp(a.rotY, tRotY, d)
    a.rotZ = lerp(a.rotZ, tRotZ, d)
    a.posZ = lerp(a.posZ, tPosZ, d)
    a.scale = lerp(a.scale, tScale, d)
    a.emissive = lerp(a.emissive, tEmissive, d)

    g.rotation.set(a.rotX, a.rotY, a.rotZ)
    g.position.set(0, bob, a.posZ)
    g.scale.setScalar(a.scale)

    if (chipMatRef.current) chipMatRef.current.emissiveIntensity = a.emissive
    if (edgeMatRef.current) edgeMatRef.current.emissiveIntensity = lerp(0.3, 1.8, a.emissive)
  })

  return (
    <group ref={groupRef} scale={0}>
      {/* Body */}
      <RoundedBox args={[2.4, 1.5, 0.06]} radius={0.08} smoothness={4}>
        <meshPhysicalMaterial
          ref={chipMatRef}
          color="#080e1f"
          metalness={0.7}
          roughness={0.25}
          clearcoat={1}
          clearcoatRoughness={0.08}
          emissive="#0D6EFD"
          emissiveIntensity={0.12}
        />
      </RoundedBox>

      {/* Edge glow */}
      <RoundedBox args={[2.44, 1.54, 0.065]} radius={0.09} smoothness={4}>
        <meshStandardMaterial
          ref={edgeMatRef}
          color="#000000"
          transparent opacity={0.15}
          emissive="#0D6EFD"
          emissiveIntensity={0.5}
          side={THREE.BackSide}
        />
      </RoundedBox>

      <ContactPads />
      <QrCodeGrid />

      {/* Axon label strip */}
      <mesh position={[0.65, -0.48, 0.031]}>
        <planeGeometry args={[0.55, 0.12]} />
        <meshStandardMaterial color="#0D6EFD" emissive="#0D6EFD" emissiveIntensity={0.35} transparent opacity={0.55} />
      </mesh>

      {/* Circuit traces */}
      {[
        { p: [0.5, 0.3, 0.031] as const, s: [0.7, 0.004, 0.001] as const },
        { p: [-0.6, -0.2, 0.031] as const, s: [0.45, 0.004, 0.001] as const },
        { p: [0.3, -0.32, 0.031] as const, s: [0.35, 0.004, 0.001] as const },
      ].map((tr, i) => (
        <mesh key={i} position={tr.p}>
          <boxGeometry args={tr.s} />
          <meshStandardMaterial color="#0D6EFD" emissive="#0D6EFD" emissiveIntensity={0.2} transparent opacity={0.25} />
        </mesh>
      ))}
    </group>
  )
}

/* ─── Floating Particles ─── */
function FloatingParticles({ progressRef, count = 70 }: { progressRef: ProgressRef; count?: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null!)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const colorArr = useMemo(() => {
    const c = new Float32Array(count * 3)
    const blue = new THREE.Color('#0D6EFD')
    const cyan = new THREE.Color('#00C6FF')
    for (let i = 0; i < count; i++) {
      const mix = new THREE.Color().lerpColors(blue, cyan, Math.random())
      mix.toArray(c, i * 3)
    }
    return c
  }, [count])

  const data = useMemo(() => Array.from({ length: count }, () => ({
    pos: new THREE.Vector3((Math.random() - 0.5) * 8, (Math.random() - 0.5) * 5, (Math.random() - 0.5) * 6),
    speed: 0.15 + Math.random() * 0.4,
    scale: 0.015 + Math.random() * 0.025,
    offset: Math.random() * Math.PI * 2,
  })), [count])

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    const p = progressRef.current ?? 0
    const reveal = smoothstep(0, 0.15, p)
    const mesh = meshRef.current
    if (!mesh) return

    data.forEach((d, i) => {
      dummy.position.set(
        d.pos.x + Math.sin(t * d.speed + d.offset) * 0.4,
        d.pos.y + Math.cos(t * d.speed * 0.7 + d.offset) * 0.25,
        d.pos.z + Math.sin(t * d.speed * 0.5 + d.offset * 2) * 0.3,
      )
      dummy.scale.setScalar(d.scale * reveal)
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)
    })
    mesh.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[null as any, null as any, count]}>
      <sphereGeometry args={[1, 6, 6]}>
        <instancedBufferAttribute attach="attributes-color" args={[colorArr, 3]} />
      </sphereGeometry>
      <meshStandardMaterial vertexColors emissive="#0D6EFD" emissiveIntensity={0.6} transparent opacity={0.55} />
    </instancedMesh>
  )
}

/* ─── Glow Rings (Phase 2 – Global Reach) ─── */
function GlowRings({ progressRef }: { progressRef: ProgressRef }) {
  const refs = useRef<(THREE.Mesh | null)[]>([])

  useFrame((_, delta) => {
    const p = progressRef.current ?? 0
    const phase = smoothstep(0.18, 0.36, p)
    const fadeOut = 1 - smoothstep(0.34, 0.42, p)

    refs.current.forEach((ring, i) => {
      if (!ring) return
      const target = phase * (1.2 + i * 0.6)
      ring.scale.setScalar(lerp(ring.scale.x, target, delta * 3))
      const mat = ring.material as THREE.MeshStandardMaterial
      mat.opacity = phase * fadeOut * (0.35 - i * 0.08)
    })
  })

  return (
    <group>
      {[0, 1, 2].map(i => (
        <mesh key={i} ref={(el: THREE.Mesh | null) => { refs.current[i] = el }} rotation={[Math.PI / 2, 0, 0]} scale={0}>
          <ringGeometry args={[1.5 + i * 0.25, 1.54 + i * 0.25, 64]} />
          <meshStandardMaterial color="#0D6EFD" emissive="#0D6EFD" emissiveIntensity={1.2} transparent opacity={0} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  )
}

/* ─── Speed Lines (Phase 3) ─── */
function SpeedLines({ progressRef }: { progressRef: ProgressRef }) {
  const groupRef = useRef<THREE.Group>(null!)
  const lines = useMemo(() => Array.from({ length: 24 }, () => ({
    pos: new THREE.Vector3((Math.random() - 0.5) * 5, (Math.random() - 0.5) * 3, -1.5 - Math.random() * 3),
    len: 0.4 + Math.random() * 1.2,
    spd: 1.5 + Math.random() * 2.5,
  })), [])

  useFrame((state, delta) => {
    const p = progressRef.current ?? 0
    const phase = smoothstep(0.38, 0.55, p)
    const fadeOut = 1 - smoothstep(0.53, 0.62, p)
    const g = groupRef.current
    if (!g) return

    g.children.forEach((child, i) => {
      const d = lines[i]
      if (!d) return
      const m = child as THREE.Mesh
      m.scale.x = lerp(m.scale.x, phase * d.len, delta * 4)
      m.position.z = d.pos.z + (state.clock.elapsedTime * d.spd) % 4
      const mat = m.material as THREE.MeshStandardMaterial
      mat.opacity = phase * fadeOut * 0.3
    })
  })

  return (
    <group ref={groupRef}>
      {lines.map((l, i) => (
        <mesh key={i} position={[l.pos.x, l.pos.y, l.pos.z]}>
          <boxGeometry args={[1, 0.008, 0.008]} />
          <meshStandardMaterial color="#00C6FF" emissive="#00C6FF" emissiveIntensity={1} transparent opacity={0} />
        </mesh>
      ))}
    </group>
  )
}

/* ─── Orbit Elements (Phase 5 – Payment) ─── */
function OrbitElements({ progressRef }: { progressRef: ProgressRef }) {
  const groupRef = useRef<THREE.Group>(null!)

  const items = useMemo(() => [
    { radius: 2.2, speed: 0.4, color: '#0D6EFD', size: 0.18 },
    { radius: 2.2, speed: -0.3, color: '#00C6FF', size: 0.15 },
    { radius: 2.5, speed: 0.25, color: '#3D8BFD', size: 0.14 },
    { radius: 2.5, speed: -0.35, color: '#0A58CA', size: 0.16 },
    { radius: 1.9, speed: 0.5, color: '#10b981', size: 0.13 },
    { radius: 1.9, speed: -0.45, color: '#f59e0b', size: 0.12 },
  ], [])

  useFrame((state, delta) => {
    const p = progressRef.current ?? 0
    const phase = smoothstep(0.78, 0.92, p)
    const g = groupRef.current
    if (!g) return

    g.children.forEach((child, i) => {
      const d = items[i]
      if (!d) return
      const angle = state.clock.elapsedTime * d.speed + (i * Math.PI * 2) / items.length
      const targetX = Math.cos(angle) * d.radius * phase
      const targetY = Math.sin(angle) * d.radius * 0.5 * phase
      child.position.x = lerp(child.position.x, targetX, delta * 4)
      child.position.y = lerp(child.position.y, targetY, delta * 4)
      child.scale.setScalar(lerp(child.scale.x, phase * d.size * 6, delta * 3))
    })
  })

  return (
    <group ref={groupRef}>
      {items.map((item, i) => (
        <mesh key={i} scale={0}>
          <octahedronGeometry args={[0.15, 0]} />
          <meshStandardMaterial
            color={item.color}
            emissive={item.color}
            emissiveIntensity={0.8}
            transparent opacity={0.7}
            metalness={0.6} roughness={0.3}
          />
        </mesh>
      ))}
    </group>
  )
}

/* ─── Exported Scene ─── */
export function EsimScene({ progressRef }: { progressRef: ProgressRef }) {
  return (
    <>
      <ambientLight intensity={0.25} />
      <directionalLight position={[5, 5, 5]} intensity={0.7} />
      <pointLight position={[-3, 2, 4]} intensity={1.8} color="#0D6EFD" distance={15} decay={2} />
      <pointLight position={[3, -2, 3]} intensity={1} color="#00C6FF" distance={12} decay={2} />

      <EsimChip progressRef={progressRef} />
      <FloatingParticles progressRef={progressRef} />
      <GlowRings progressRef={progressRef} />
      <SpeedLines progressRef={progressRef} />
      <OrbitElements progressRef={progressRef} />
    </>
  )
}
