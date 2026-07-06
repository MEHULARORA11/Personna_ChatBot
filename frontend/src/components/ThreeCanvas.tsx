import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ParticleSphereProps {
  color: string;
}

function ParticleSphere({ color }: ParticleSphereProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 500;

  const [positions, initialPositions] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const initialPos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 1.7 + Math.random() * 0.25;

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;

      initialPos[i * 3] = x;
      initialPos[i * 3 + 1] = y;
      initialPos[i * 3 + 2] = z;
    }
    return [pos, initialPos];
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (pointsRef.current) {
      pointsRef.current.rotation.y = time * 0.05;
      pointsRef.current.rotation.x = time * 0.02;

      const positionsAttr = pointsRef.current.geometry.attributes.position;
      const array = positionsAttr.array as Float32Array;

      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const ix = initialPositions[i3];
        const iy = initialPositions[i3 + 1];
        const iz = initialPositions[i3 + 2];

        const wave = Math.sin(time * 0.6 + ix * 2 + iy * 2) * 0.06;
        array[i3] = ix + (ix / 1.7) * wave;
        array[i3 + 1] = iy + (iy / 1.7) * wave;
        array[i3 + 2] = iz + (iz / 1.7) * wave;
      }
      positionsAttr.needsUpdate = true;
    }
  });

  const targetColor = useMemo(() => new THREE.Color(color), [color]);
  const materialRef = useRef<THREE.PointsMaterial>(null);

  useFrame(() => {
    if (materialRef.current) {
      materialRef.current.color.lerp(targetColor, 0.04);
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        ref={materialRef}
        size={0.028}
        sizeAttenuation
        transparent
        opacity={0.55}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

interface ThreeCanvasProps {
  activePersona: 'hitesh' | 'piyush';
}

export default function ThreeCanvas({ activePersona }: ThreeCanvasProps) {
  const sphereColor = activePersona === 'hitesh' ? '#c2703a' : '#1c8fa6';

  return (
    <div
      className="hidden md:block absolute inset-0 -z-10 pointer-events-none opacity-30 dark:opacity-25"
      aria-hidden="true"
    >
      <Canvas camera={{ position: [0, 0, 4.5], fov: 60 }} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[2, 2, 2]} intensity={1} />
        <ParticleSphere color={sphereColor} />
      </Canvas>
    </div>
  );
}
