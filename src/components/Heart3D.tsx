import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

function AnimatedHeart() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
      meshRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.1;
      meshRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 0.8) * 0.2;
    }
  });

  return (
    <group>
      {/* Main heart shape using multiple spheres */}
      <Sphere ref={meshRef} args={[1, 64, 64]} position={[0, 0, 0]}>
        <MeshDistortMaterial
          color="#C27691"
          attach="material"
          distort={0.3}
          speed={2}
          roughness={0.2}
          metalness={0.8}
          emissive="#C27691"
          emissiveIntensity={0.3}
        />
      </Sphere>
      
      {/* Left lobe */}
      <Sphere args={[0.6, 32, 32]} position={[-0.6, 0.5, 0]}>
        <MeshDistortMaterial
          color="#C27691"
          attach="material"
          distort={0.2}
          speed={2}
          roughness={0.2}
          metalness={0.8}
          emissive="#C27691"
          emissiveIntensity={0.3}
        />
      </Sphere>
      
      {/* Right lobe */}
      <Sphere args={[0.6, 32, 32]} position={[0.6, 0.5, 0]}>
        <MeshDistortMaterial
          color="#C27691"
          attach="material"
          distort={0.2}
          speed={2}
          roughness={0.2}
          metalness={0.8}
          emissive="#C27691"
          emissiveIntensity={0.3}
        />
      </Sphere>

      {/* Ambient glow */}
      <pointLight position={[0, 0, 2]} intensity={1} color="#FFB6A3" />
      <pointLight position={[2, 2, 0]} intensity={0.5} color="#4B3F72" />
    </group>
  );
}

export function Heart3D() {
  return (
    <div className="absolute inset-0 pointer-events-none opacity-40">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
        <AnimatedHeart />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  );
}
