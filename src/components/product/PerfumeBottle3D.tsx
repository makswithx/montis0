import { useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows, useGLTF, Center } from "@react-three/drei";
import * as THREE from "three";

interface PerfumeBottleProps {
  color?: string;
  capColor?: string;
}

const PerfumeBottle = ({ color = "#d4a574", capColor = "#1a1a1a" }: PerfumeBottleProps) => {
  const bottleRef = useRef<THREE.Group>(null);

  // Subtle auto-rotation when not interacting
  useFrame((state) => {
    if (bottleRef.current) {
      bottleRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  return (
    <group ref={bottleRef} position={[0, -0.5, 0]}>
      {/* Main bottle body */}
      <mesh position={[0, 0.8, 0]}>
        <cylinderGeometry args={[0.6, 0.7, 2.2, 32]} />
        <meshPhysicalMaterial
          color={color}
          metalness={0.1}
          roughness={0.1}
          transmission={0.6}
          thickness={0.5}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </mesh>

      {/* Bottle neck */}
      <mesh position={[0, 2.1, 0]}>
        <cylinderGeometry args={[0.25, 0.4, 0.5, 32]} />
        <meshPhysicalMaterial
          color={color}
          metalness={0.1}
          roughness={0.1}
          transmission={0.6}
          thickness={0.3}
          clearcoat={1}
        />
      </mesh>

      {/* Spray nozzle ring */}
      <mesh position={[0, 2.4, 0]}>
        <cylinderGeometry args={[0.28, 0.28, 0.1, 32]} />
        <meshStandardMaterial color="#c0c0c0" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Cap base */}
      <mesh position={[0, 2.6, 0]}>
        <cylinderGeometry args={[0.35, 0.35, 0.3, 32]} />
        <meshStandardMaterial color={capColor} metalness={0.3} roughness={0.4} />
      </mesh>

      {/* Cap top */}
      <mesh position={[0, 3.1, 0]}>
        <cylinderGeometry args={[0.32, 0.35, 0.8, 32]} />
        <meshStandardMaterial color={capColor} metalness={0.3} roughness={0.4} />
      </mesh>

      {/* Cap crown detail */}
      <mesh position={[0, 3.55, 0]}>
        <sphereGeometry args={[0.15, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={capColor} metalness={0.4} roughness={0.3} />
      </mesh>

      {/* Brand label */}
      <mesh position={[0, 0.8, 0.71]} rotation={[0, 0, 0]}>
        <planeGeometry args={[0.8, 0.4]} />
        <meshStandardMaterial color="#f5f5dc" metalness={0.1} roughness={0.8} />
      </mesh>

      {/* Liquid inside */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.55, 0.65, 1.6, 32]} />
        <meshPhysicalMaterial
          color={color}
          metalness={0}
          roughness={0}
          transmission={0.8}
          thickness={1}
          opacity={0.7}
          transparent
        />
      </mesh>
    </group>
  );
};

// GLB Model component
const GLBModel = ({ modelPath }: { modelPath: string }) => {
  const { scene } = useGLTF(modelPath);
  const modelRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (modelRef.current) {
      modelRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <Center>
      <primitive ref={modelRef} object={scene} scale={1} />
    </Center>
  );
};

interface Product3DViewerProps {
  productName: string;
  brandColor?: string;
  has3DModel?: boolean;
}

const Product3DViewer = ({ productName, brandColor, has3DModel }: Product3DViewerProps) => {
  // Map some brands to colors
  const getBottleColor = () => {
    const name = productName.toLowerCase();
    if (name.includes("oud") || name.includes("tobacco")) return "#8B4513";
    if (name.includes("noir") || name.includes("black")) return "#2d2d2d";
    if (name.includes("rose") || name.includes("cherry")) return "#c77986";
    if (name.includes("bleu") || name.includes("sauvage")) return "#4a6fa5";
    if (name.includes("gold") || name.includes("guilty")) return "#d4af37";
    if (name.includes("fresh") || name.includes("light")) return "#b8e0d2";
    return brandColor || "#d4a574";
  };

  return (
    <div className="aspect-[3/4] relative rounded-sm overflow-hidden">
      {/* Luxurious background layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-obsidian via-[#1a1a1f] to-[#0a0a0c]" />
      
      {/* Radial gold accent glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_hsl(37_52%_43%_/_0.15)_0%,_transparent_60%)]" />
      
      {/* Subtle diamond pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 10px,
            hsl(37 52% 43% / 0.3) 10px,
            hsl(37 52% 43% / 0.3) 11px
          ),
          repeating-linear-gradient(
            -45deg,
            transparent,
            transparent 10px,
            hsl(37 52% 43% / 0.3) 10px,
            hsl(37 52% 43% / 0.3) 11px
          )`
        }}
      />
      
      {/* Top spotlight effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200%] h-[50%] bg-[radial-gradient(ellipse_at_top,_hsl(40_14%_95%_/_0.08)_0%,_transparent_70%)]" />
      
      {/* Bottom reflection glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-[30%] bg-[radial-gradient(ellipse_at_bottom,_hsl(37_52%_43%_/_0.2)_0%,_transparent_70%)]" />
      
      {/* Animated corner accents */}
      <div className="absolute top-0 left-0 w-24 h-24 border-l border-t border-accent/20" />
      <div className="absolute top-0 right-0 w-24 h-24 border-r border-t border-accent/20" />
      <div className="absolute bottom-0 left-0 w-24 h-24 border-l border-b border-accent/20" />
      <div className="absolute bottom-0 right-0 w-24 h-24 border-r border-b border-accent/20" />
      
      {/* Floating particles effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] left-[15%] w-1 h-1 bg-accent/40 rounded-full animate-pulse" style={{ animationDelay: '0s' }} />
        <div className="absolute top-[40%] right-[20%] w-0.5 h-0.5 bg-accent/30 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-[30%] left-[25%] w-0.5 h-0.5 bg-bone/20 rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-[60%] right-[30%] w-1 h-1 bg-accent/20 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
        <div className="absolute bottom-[45%] left-[10%] w-0.5 h-0.5 bg-bone/15 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }} />
      </div>

      <Canvas
        camera={{ position: [0, 2, 12], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
        className="relative z-10"
      >
        {/* Enhanced lighting for dark background */}
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} castShadow color="#fff8f0" />
        <directionalLight position={[-5, 3, -5]} intensity={0.6} color="#a67a34" />
        <spotLight position={[0, 10, 0]} intensity={0.5} angle={0.3} color="#ffffff" />
        <spotLight position={[-3, 5, 3]} intensity={0.3} angle={0.5} color="#a67a34" />
        <pointLight position={[0, -2, 3]} intensity={0.2} color="#d4af37" />

        {/* Environment for reflections */}
        <Environment preset="studio" />

        {/* The bottle - GLB model or procedural */}
        <Suspense fallback={null}>
          {has3DModel ? (
            <GLBModel modelPath="/models/tom-ford-bottle.glb" />
          ) : (
            <PerfumeBottle color={getBottleColor()} />
          )}
        </Suspense>

        {/* Shadow */}
        <ContactShadows
          position={[0, -1, 0]}
          opacity={0.6}
          scale={5}
          blur={2}
          far={4}
          color="#000000"
        />

        {/* Controls */}
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minDistance={5}
          maxDistance={25}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 1.5}
          autoRotate={!has3DModel}
          autoRotateSpeed={0.5}
        />
      </Canvas>

      {/* Instruction overlay - refined for dark bg */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-obsidian/60 backdrop-blur-md border border-accent/20 px-4 py-2 rounded-full text-sm font-body text-bone/70 pointer-events-none">
        <svg
          className="w-4 h-4 text-accent/70"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
          />
        </svg>
        <span>Povucite za rotaciju • Scroll za zoom</span>
      </div>
    </div>
  );
};

export default Product3DViewer;
