import { useRef, useState, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'

// Advanced 3D Model or Geometry with vertex manipulation
const AdvancedGeometry = ({ position }) => {
  const meshRef = useRef()
  const [hovered, setHovered] = useState(false)
  const [clicked, setClicked] = useState(false)

  // Create geometry and manipulate vertices
  const geometry = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(3, 2)
    const colors = []
    
    for (let i = 0; i < geo.attributes.position.count; i++) {
      colors.push(0, 1, 0)  // Start with green color for all vertices
    }

    geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))

    return geo
  }, [])

  // Vertex position manipulation on hover
  useFrame(() => {
    const positions = geometry.attributes.position.array
    const colors = geometry.attributes.color.array

    for (let i = 0; i < positions.length; i += 3) {
      // Manipulate each vertex position (pulsating effect when hovered)
      const offset = hovered ? Math.sin(i / 10 + performance.now() / 500) * 0.1 : 0
      positions[i] += offset  // X
      positions[i + 1] += offset  // Y
      positions[i + 2] += offset  // Z

      // Change vertex colors on click
      if (clicked) {
        colors[i] = Math.random()  // Random red component
        colors[i + 1] = Math.random()  // Random green component
        colors[i + 2] = Math.random()  // Random blue component
      }
    }

    geometry.attributes.position.needsUpdate = true
    geometry.attributes.color.needsUpdate = true
  })

  return (
    <mesh
      ref={meshRef}
      position={position}
      geometry={geometry}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={() => setClicked(!clicked)}
    >
      <meshStandardMaterial vertexColors={true} wireframe={false} />
    </mesh>
  )
}
const Scene = () => {
    return (
      <Canvas>  {/* Wrap everything inside Canvas */}
        <OrbitControls enableZoom={true} enablePan={true} />
        <ambientLight intensity={0.9} />
        <pointLight position={[100, 10, 10]} />
        <AdvancedGeometry position={[0, 0, 0]} />  {/* Geometry */}
      </Canvas>
    )
  }
  
  export default Scene
