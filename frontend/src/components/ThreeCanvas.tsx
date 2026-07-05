import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ParticleSphereProps {
  color: string;
}

function ParticleSphere({ color }: ParticleSphereProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 800; // Number of particles

  // Generate random positions on a sphere surface
  const [positions, initialPositions] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const initialPos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Uniform distribution on sphere
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 1.6 + Math.random() * 0.3; // radius with a bit of noise

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

  // Update particles movement and rotation
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (pointsRef.current) {
      // Rotate the sphere
      pointsRef.current.rotation.y = time * 0.08;
      pointsRef.current.rotation.x = time * 0.04;

      // Morph particles slightly (pulsing effect)
      const positionsAttr = pointsRef.current.geometry.attributes.position;
      const array = positionsAttr.array as Float32Array;

      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const ix = initialPositions[i3];
        const iy = initialPositions[i3 + 1];
        const iz = initialPositions[i3 + 2];

        // Add wave offset based on position and time
        const wave = Math.sin(time + ix * 2 + iy * 2) * 0.08;
        array[i3] = ix + (ix / 1.6) * wave;
        array[i3 + 1] = iy + (iy / 1.6) * wave;
        array[i3 + 2] = iz + (iz / 1.6) * wave;
      }
      positionsAttr.needsUpdate = true;
    }
  });

  // Smoothly interpolate material color using Three's Color class
  const targetColor = useMemo(() => new THREE.Color(color), [color]);
  const materialRef = useRef<THREE.PointsMaterial>(null);

  useFrame(() => {
    if (materialRef.current) {
      materialRef.current.color.lerp(targetColor, 0.05);
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        ref={materialRef}
        size={0.035}
        sizeAttenuation={true}
        transparent
        opacity={0.7}
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
  // Color configuration: Hitesh (Gold Amber) vs Piyush (Electric Teal)
  const sphereColor = activePersona === 'hitesh' ? '#F59E0B' : '#06B6D4';

  return (
    <div className="absolute inset-0 -z-10 pointer-events-none opacity-50 dark:opacity-40">
      <Canvas
        camera={{ position: [0, 0, 4.5], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[2, 2, 2]} intensity={1} />
        <ParticleSphere color={sphereColor} />
      </Canvas>
    </div>
  );
}
