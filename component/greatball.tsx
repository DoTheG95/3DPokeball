'use client';

import { useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import * as THREE from 'three';

function Greatball({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (v: boolean) => void }) {
  const hingeRef = useRef<THREE.Group>(null!);
  const pokeball_open = new Audio("/pokeball_open.mp3");

  useFrame(() => {
    if (hingeRef.current) {
      const targetRotation = isOpen ? -Math.PI * 0.55 : 0;
      hingeRef.current.rotation.x = THREE.MathUtils.lerp(
        hingeRef.current.rotation.x,
        targetRotation,
        0.1
      );
    }
  });

  const handleClick = (e: any) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  return (
    <group>
      <group ref={hingeRef} position={[0, 0, -1.2]}>
        <group position={[0, 0, 1.2]}>
          <mesh castShadow receiveShadow>
            <sphereGeometry args={[1.2, 64, 64, 0, Math.PI * 2, 0, Math.PI * 0.48]} />
            <meshStandardMaterial color="#e6002e" metalness={0.2} roughness={0.15} side={THREE.DoubleSide}/>
            
          </mesh>
        </group>
      </group>

      {/* BOTTOM HALF (Static) */}
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[1.2, 64, 64, 0, Math.PI * 2, Math.PI * 0.52, Math.PI * 0.48]} />
        <meshStandardMaterial color="#f3f3f3" metalness={0.1} roughness={0.2} />
      </mesh>

      {/* INNER BLACK BAND / CORE */}
      <mesh visible={false}>
        <sphereGeometry args={[1.18, 64, 64]} />
        <meshStandardMaterial color="#151515" />
      </mesh>
      <mesh>
        <cylinderGeometry args={[1.18, 1.18, 0.1, 64]} />
        <meshStandardMaterial 
          color="#151515"
          metalness={0.5}
          roughness={0.4}
        />
      </mesh>


      {/* BUTTON ASSEMBLY (Facing forward along Z axis) */}
      <group position={[0, 0, 1.1]} rotation={[Math.PI * 0.5, 0, 0]}>
        {/* Black Outer Ring Rim */}
        <mesh position={[0, 0.05, 0]}>
          <cylinderGeometry args={[0.35, 0.35, 0.08, 32]} />
          <meshStandardMaterial color="#151515" metalness={0.5} roughness={0.4} />
        </mesh>

        {/* White Middle Button */}
        <mesh position={[0, 0.08, 0]}>
          <cylinderGeometry args={[0.22, 0.22, 0.06, 32]} />
          <meshStandardMaterial color="#ffffff" metalness={0.1} roughness={0.1} />
        </mesh>

        {/* Inner Glowing Center Core */}
        <mesh position={[0, 0.12, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 0.02, 32]} />
          <meshStandardMaterial 
            color={isOpen ? "#55ccff" : "#ffffff"} 
            emissive={isOpen ? "#0088ff" : "#222222"}
            emissiveIntensity={isOpen ? 2 : 0}
            roughness={0.1}
          />
        </mesh>

        {/* Invisible Click Target Box covering the button area */}
        <mesh position={[0, 0, 0]} onClick={handleClick}>
          <boxGeometry args={[0.8, 0.3, 0.8]} />
          <meshBasicMaterial visible={false} />
        </mesh>
      </group>
    </group>
  );
}

export default function Greatball3D() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full h-full rounded-2xl overflow-hidden relative">
      <Canvas 
        camera={{ position: [0, 0.5, 4.8], fov: 40 }}
        shadows>
        <ambientLight intensity={0.3} />
        <directionalLight 
          position={[5, 8, 5]} 
          intensity={0.3} 
          castShadow 
          shadow-mapSize={[1024, 1024]}
        />
        <pointLight position={[-4, -2, -4]} intensity={1} color="#0044ff" />

        <Greatball isOpen={isOpen} setIsOpen={setIsOpen} />

        <Environment preset="studio" />
        <OrbitControls 
          enablePan={false} 
          enableZoom={true} 
          minDistance={3}
          target={[0, 0.2, 0]} 
          maxPolarAngle={Math.PI / 2 + 0.3} // Prevents looking directly underneath completely
        />
      </Canvas>
    </div>
  );
}