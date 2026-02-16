import { useRef, useState, Suspense, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Environment, Html } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, ChromaticAberration, Noise } from '@react-three/postprocessing';
import * as THREE from 'three';
import type { Facility } from '../types';
import { getStatusColor, getBuildingHeight } from '../lib/utils';

interface CitySceneProps {
    facilities: Facility[];
    onFacilityClick?: (facility: Facility) => void;
    selectedFacilityId?: string | null;
}

// Background City using InstancedMesh for performance
function BackgroundCity() {
    const count = 4000;
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const dummy = useMemo(() => new THREE.Object3D(), []);

    const buildings = useMemo(() => {
        const temp = [];
        const colors = [
            '#0f172a', // Default dark
            '#1e293b', // Slate
            '#334155', // Light slate
            '#ef4444', // Red-ish (Clinic/Hero)
            '#3b82f6', // Blue-ish
            '#eab308', // Yellow-ish
            '#22c55e', // Green-ish
        ];

        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const radius = 30 + Math.random() * 200; // Expanded radius
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;

            // Avoid center where main buildings are
            if (Math.abs(x) < 25 && Math.abs(z) < 25) continue;

            const isHero = Math.random() > 0.95;
            const h = isHero ? 5 + Math.random() * 25 : 1 + Math.random() * 15;
            const w = 0.5 + Math.random() * (isHero ? 2 : 1.5);

            // Assign color based on probability
            let colorIdx = 0; // Default
            if (isHero) {
                colorIdx = Math.floor(Math.random() * (colors.length - 3)) + 3; // Pickup red, blue, yellow, green
            } else {
                colorIdx = Math.floor(Math.random() * 3); // Pickup dark slates
            }

            temp.push({ x, z, h, w, color: new THREE.Color(colors[colorIdx]) });
        }
        return temp;
    }, []);

    useFrame(() => {
        if (meshRef.current) {
            buildings.forEach((data, i) => {
                dummy.position.set(data.x, data.h / 2, data.z);
                dummy.scale.set(data.w, data.h, data.w);
                dummy.updateMatrix();
                meshRef.current?.setMatrixAt(i, dummy.matrix);
                meshRef.current?.setColorAt(i, data.color);
            });
            meshRef.current.instanceMatrix.needsUpdate = true;
            if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
        }
    });

    return (
        <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial
                metalness={0.8}
                roughness={0.2}
            />
        </instancedMesh>
    );
}

// Scanning line effect
function ScanningLine() {
    const ref = useRef<THREE.Mesh>(null);
    useFrame((state) => {
        if (ref.current) {
            ref.current.position.z = (Math.sin(state.clock.elapsedTime * 0.5) * 200);
        }
    });

    return (
        <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.1, 0]}>
            <planeGeometry args={[1000, 2]} />
            <meshBasicMaterial
                color="#00f3ff"
                transparent
                opacity={0.15}
                toneMapped={false}
            />
        </mesh>
    );
}

// Moving data lines to simulate traffic/activity
function DataFlows() {
    const count = 40;
    const lines = useMemo(() => {
        const temp = [];
        for (let i = 0; i < count; i++) {
            const isVertical = Math.random() > 0.5;
            const pos = (Math.random() - 0.5) * 500;
            const start = (Math.random() - 0.5) * 500;
            const length = 10 + Math.random() * 50;
            const speed = 0.5 + Math.random() * 2;
            const color = Math.random() > 0.5 ? '#00f3ff' : '#3b82f6';
            temp.push({ isVertical, pos, start, length, speed, color });
        }
        return temp;
    }, []);

    const Line = ({ data }: { data: any }) => {
        const ref = useRef<THREE.Mesh>(null);
        useFrame((state) => {
            if (ref.current) {
                if (data.isVertical) {
                    ref.current.position.z = ((data.start + state.clock.elapsedTime * 20 * data.speed + 250) % 500) - 250;
                } else {
                    ref.current.position.x = ((data.start + state.clock.elapsedTime * 20 * data.speed + 250) % 500) - 250;
                }
            }
        });

        return (
            <mesh
                ref={ref}
                position={[data.isVertical ? data.pos : data.start, 0.05, data.isVertical ? data.start : data.pos]}
            >
                <boxGeometry args={[data.isVertical ? 0.2 : data.length, 0.05, data.isVertical ? data.length : 0.2]} />
                <meshBasicMaterial color={data.color} transparent opacity={0.6} toneMapped={false} />
            </mesh>
        );
    };

    return (
        <group>
            {lines.map((line, i) => (
                <Line key={i} data={line} />
            ))}
        </group>
    );
}

function BuildingMesh({
    facility,
    onClick,
    isSelected,
}: {
    facility: Facility;
    onClick: () => void;
    isSelected: boolean;
}) {
    const meshRef = useRef<THREE.Mesh>(null);
    const [hovered, setHovered] = useState(false);

    const loadPercentage = facility.loadPercentage ||
        Math.round((facility.currentLoad / (facility.capacity || 1)) * 100);

    const color = getStatusColor(loadPercentage);
    const height = getBuildingHeight(facility.capacity);
    const coordinates = facility.location?.coordinates || [0, 0];
    const [lng, lat] = coordinates;

    // Animate scale on hover/select
    useFrame((state, delta) => {
        if (meshRef.current) {
            const targetScale = hovered || isSelected ? 1.1 : 1;
            meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 10);

            // Pulse effect if critical or selected
            if (loadPercentage > 90 || isSelected) {
                if (meshRef.current.material instanceof THREE.MeshPhysicalMaterial) {
                    meshRef.current.material.emissiveIntensity = 1.5 + Math.sin(state.clock.elapsedTime * 6) * 1;
                }
            }
        }
    });

    const buildingColor = new THREE.Color(color);

    return (
        <group position={[lng * 10, 0, lat * 10]}>
            {/* Selection/Hover Ring */}
            {(isSelected || hovered) && (
                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.1, 0]}>
                    <ringGeometry args={[0.7, 0.9, 32]} />
                    <meshBasicMaterial color={isSelected ? "#00f3ff" : color} transparent opacity={0.5} />
                </mesh>
            )}

            <mesh
                ref={meshRef}
                position={[0, height / 2, 0]}
                onClick={(e) => {
                    e.stopPropagation();
                    onClick();
                }}
                onPointerOver={(e) => {
                    e.stopPropagation();
                    setHovered(true);
                }}
                onPointerOut={(e) => {
                    e.stopPropagation();
                    setHovered(false);
                }}
                castShadow
            >
                <boxGeometry args={[1, height, 1]} />
                <meshPhysicalMaterial
                    color={isSelected ? '#ffffff' : color}
                    emissive={buildingColor}
                    emissiveIntensity={isSelected ? 2 : hovered ? 1.2 : 0.8}
                    roughness={0}
                    metalness={1}
                    transmission={0.5}
                    thickness={0.5}
                    ior={1.5}
                    reflectivity={1}
                    clearcoat={1}
                    clearcoatRoughness={0}
                />
            </mesh>

            {/* Internal Glow Core */}
            <mesh position={[0, height / 2, 0]}>
                <boxGeometry args={[0.4, height * 0.9, 0.4]} />
                <meshBasicMaterial color={color} toneMapped={false} />
            </mesh>

            {/* Label */}
            {(hovered || isSelected) && (
                <Html position={[0, height + 1, 0]} center distanceFactor={15}>
                    <div className="bg-slate-900/95 text-white text-[10px] px-3 py-1.5 rounded-full border border-white/20 whitespace-nowrap backdrop-blur-xl font-heading font-bold uppercase tracking-widest pointer-events-none shadow-[0_0_20px_rgba(0,0,0,0.5)] flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: `#${buildingColor.getHexString()}` }} />
                        {facility.name} | {loadPercentage}%
                    </div>
                </Html>
            )}
        </group>
    );
}

function GridFloor() {
    return (
        <group>
            {/* Ground Plane */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
                <planeGeometry args={[1000, 1000]} />
                <meshStandardMaterial
                    color="#020617"
                    roughness={0.2}
                    metalness={0.8}
                />
            </mesh>

            {/* Main Grid */}
            <gridHelper args={[500, 50, '#1e293b', '#0f172a']} position={[0, 0.01, 0]} />

            {/* Secondary Fine Grid */}
            <gridHelper args={[500, 200, '#0f172a', 'transparent']} position={[0, 0.02, 0]} />

            {/* Compass/Center Circle */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
                <ringGeometry args={[29, 30, 64]} />
                <meshBasicMaterial color="#1e293b" transparent opacity={0.5} />
            </mesh>
        </group>
    );
}

export function CityScene({ facilities, onFacilityClick, selectedFacilityId }: CitySceneProps) {
    return (
        <div className="w-full h-full bg-slate-950">
            <Canvas
                shadows
                dpr={[1, 2]}
                gl={{
                    antialias: true,
                    stencil: false,
                    depth: true,
                    alpha: false,
                    powerPreference: "high-performance"
                }}
                camera={{ position: [50, 50, 50], fov: 45 }}
            >
                <Suspense fallback={null}>
                    <OrbitControls
                        enablePan={true}
                        enableZoom={false}
                        minDistance={20}
                        maxDistance={250}
                        maxPolarAngle={Math.PI / 2.1}
                        autoRotate={!selectedFacilityId}
                        autoRotateSpeed={0.2}
                        enableDamping={true}
                        dampingFactor={0.05}
                        makeDefault
                    />

                    <ambientLight intensity={0.1} />
                    <directionalLight
                        position={[100, 100, 50]}
                        intensity={1.5}
                        castShadow
                        shadow-mapSize={[2048, 2048]}
                    />
                    <pointLight position={[0, 50, 0]} intensity={1} color="#3b82f6" />
                    <pointLight position={[50, 20, 50]} intensity={0.5} color="#00f3ff" />

                    <Stars radius={300} depth={100} count={10000} factor={6} saturation={0} fade speed={1} />
                    <Environment preset="night" />

                    <GridFloor />
                    <BackgroundCity />
                    <DataFlows />
                    <ScanningLine />

                    {facilities.map((facility) => (
                        <BuildingMesh
                            key={facility._id}
                            facility={facility}
                            onClick={() => onFacilityClick?.(facility)}
                            isSelected={selectedFacilityId === facility._id}
                        />
                    ))}

                    {/* Post Processing */}
                    <EffectComposer>
                        <Bloom
                            intensity={1.5}
                            luminanceThreshold={0.2}
                            luminanceSmoothing={0.9}
                            height={300}
                        />
                        <Noise opacity={0.02} />
                        <Vignette eskil={false} offset={0.1} darkness={1.1} />
                        <ChromaticAberration
                            offset={new THREE.Vector2(0.001, 0.001)}
                            radialModulation={false}
                            modulationOffset={0}
                        />
                    </EffectComposer>
                </Suspense>
            </Canvas>
        </div>
    );
}

