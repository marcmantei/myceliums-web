"use client";

import { useRef, useMemo, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

// Vibrant community cluster colors (matching RepoGraph3D)
const COMMUNITY_COLORS = [
  "#10B981", "#6366F1", "#F59E0B", "#EC4899", "#06B6D4",
  "#8B5CF6", "#14B8A6", "#EF4444", "#84CC16", "#F97316",
];

const COMMUNITIES = [
  { color: new THREE.Color(COMMUNITY_COLORS[0]), center: [-3, 1, 0] },
  { color: new THREE.Color(COMMUNITY_COLORS[1]), center: [3, 0, 0] },
  { color: new THREE.Color(COMMUNITY_COLORS[2]), center: [0, -2, 0] },
  { color: new THREE.Color(COMMUNITY_COLORS[3]), center: [-1, 3, -1] },
  { color: new THREE.Color(COMMUNITY_COLORS[4]), center: [2, 2, 1] },
];

interface NodeData {
  position: THREE.Vector3;
  color: THREE.Color;
  communityIdx: number;
  scale: number;
}

interface EdgeData {
  from: number;
  to: number;
}

const CURVE_SEGMENTS = 12;

function generateGraphData(nodeCount: number): { nodes: NodeData[]; edges: EdgeData[] } {
  const nodes: NodeData[] = [];
  const edges: EdgeData[] = [];

  for (let i = 0; i < nodeCount; i++) {
    const commIdx = i % COMMUNITIES.length;
    const comm = COMMUNITIES[commIdx];
    const spread = 1.8;
    const position = new THREE.Vector3(
      comm.center[0] + (Math.random() - 0.5) * spread,
      comm.center[1] + (Math.random() - 0.5) * spread,
      (Math.random() - 0.5) * 2
    );
    nodes.push({
      position,
      color: comm.color.clone(),
      communityIdx: commIdx,
      scale: 0.04 + Math.random() * 0.03,
    });
  }

  // Intra-community edges
  for (let i = 0; i < nodeCount; i++) {
    const sameComm = nodes
      .map((n, idx) => ({ idx, dist: n.position.distanceTo(nodes[i].position), comm: n.communityIdx }))
      .filter((n) => n.comm === nodes[i].communityIdx && n.idx !== i)
      .sort((a, b) => a.dist - b.dist)
      .slice(0, 2);
    for (const neighbor of sameComm) {
      if (i < neighbor.idx) {
        edges.push({ from: i, to: neighbor.idx });
      }
    }
  }

  // Cross-community edges (sparse)
  for (let i = 0; i < Math.floor(nodeCount * 0.15); i++) {
    const a = Math.floor(Math.random() * nodeCount);
    let b = Math.floor(Math.random() * nodeCount);
    while (nodes[b].communityIdx === nodes[a].communityIdx) {
      b = Math.floor(Math.random() * nodeCount);
    }
    edges.push({ from: a, to: b });
  }

  return { nodes, edges };
}

function Nodes({ nodes }: { nodes: NodeData[] }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const time = useRef(0);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    time.current += delta;

    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      dummy.position.copy(node.position);
      dummy.position.y += Math.sin(time.current * 0.5 + i * 0.3) * 0.03;
      dummy.scale.setScalar(node.scale);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
      meshRef.current.setColorAt(i, node.color);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, nodes.length]}>
      <sphereGeometry args={[1, 16, 16]} />
      <meshBasicMaterial toneMapped={false} />
    </instancedMesh>
  );
}

function CurvedEdges({ nodes, edges }: { nodes: NodeData[]; edges: EdgeData[] }) {
  const linesRef = useRef<THREE.LineSegments>(null);

  const geometry = useMemo(() => {
    const pointsPerCurve = CURVE_SEGMENTS + 1;
    const positions = new Float32Array(edges.length * pointsPerCurve * 3);
    const colors = new Float32Array(edges.length * pointsPerCurve * 3);
    const tmpA = new THREE.Vector3();
    const tmpB = new THREE.Vector3();
    const tmpMid = new THREE.Vector3();
    const tmpControl = new THREE.Vector3();
    const tmpColor = new THREE.Color();

    for (let i = 0; i < edges.length; i++) {
      const edge = edges[i];
      const a = nodes[edge.from];
      const b = nodes[edge.to];
      tmpA.copy(a.position);
      tmpB.copy(b.position);
      tmpMid.lerpVectors(tmpA, tmpB, 0.5);

      const dist = tmpA.distanceTo(tmpB);
      const bowAmount = dist * 0.25;
      const edgeDir = tmpB.clone().sub(tmpA).normalize();
      const up = new THREE.Vector3(0, 1, 0);
      const perp = new THREE.Vector3().crossVectors(edgeDir, up).normalize();
      if (perp.length() < 0.1) {
        up.set(1, 0, 0);
        perp.crossVectors(edgeDir, up).normalize();
      }
      const outward = tmpMid.clone().normalize();
      tmpControl.copy(tmpMid)
        .addScaledVector(perp, bowAmount * 0.5)
        .addScaledVector(outward, bowAmount * 0.5);

      const offset = i * pointsPerCurve * 3;
      for (let s = 0; s <= CURVE_SEGMENTS; s++) {
        const t = s / CURVE_SEGMENTS;
        const omt = 1 - t;
        // Quadratic bezier
        positions[offset + s * 3] = omt * omt * tmpA.x + 2 * omt * t * tmpControl.x + t * t * tmpB.x;
        positions[offset + s * 3 + 1] = omt * omt * tmpA.y + 2 * omt * t * tmpControl.y + t * t * tmpB.y;
        positions[offset + s * 3 + 2] = omt * omt * tmpA.z + 2 * omt * t * tmpControl.z + t * t * tmpB.z;

        // Gradient from source color to target color
        tmpColor.copy(a.color).lerp(b.color, t);
        colors[offset + s * 3] = tmpColor.r;
        colors[offset + s * 3 + 1] = tmpColor.g;
        colors[offset + s * 3 + 2] = tmpColor.b;
      }
    }

    // Build line segment indices
    const indices: number[] = [];
    for (let i = 0; i < edges.length; i++) {
      const base = i * pointsPerCurve;
      for (let s = 0; s < CURVE_SEGMENTS; s++) {
        indices.push(base + s, base + s + 1);
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geo.setIndex(indices);
    return geo;
  }, [nodes, edges]);

  return (
    <lineSegments ref={linesRef} geometry={geometry}>
      <lineBasicMaterial vertexColors opacity={0.2} transparent toneMapped={false} />
    </lineSegments>
  );
}

function TravelingParticle({ nodes, edges }: { nodes: NodeData[]; edges: EdgeData[] }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const edgeIndex = useRef(0);
  const progress = useRef(0);

  useFrame((_, delta) => {
    if (!meshRef.current || edges.length === 0) return;

    progress.current += delta * 0.8;
    if (progress.current > 1) {
      progress.current = 0;
      edgeIndex.current = (edgeIndex.current + 1) % edges.length;
    }

    const edge = edges[edgeIndex.current];
    const from = nodes[edge.from].position;
    const to = nodes[edge.to].position;
    meshRef.current.position.lerpVectors(from, to, progress.current);
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.035, 12, 12]} />
      <meshBasicMaterial color="#818CF8" toneMapped={false} />
    </mesh>
  );
}

function Scene() {
  const { camera } = useThree();
  const groupRef = useRef<THREE.Group>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  const { nodes, edges } = useMemo(() => generateGraphData(120), []);

  const handlePointerMove = useCallback((e: THREE.Event & { clientX?: number; clientY?: number }) => {
    if (typeof window !== "undefined" && e.clientX !== undefined && e.clientY !== undefined) {
      mouseRef.current.x = (e.clientX / window.innerWidth - 0.5) * 0.3;
      mouseRef.current.y = (e.clientY / window.innerHeight - 0.5) * 0.3;
    }
  }, []);

  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += 0.001;
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      mouseRef.current.y * 0.2,
      0.02
    );
    groupRef.current.rotation.z = THREE.MathUtils.lerp(
      groupRef.current.rotation.z,
      mouseRef.current.x * 0.1,
      0.02
    );
    camera.position.z = 8;
  });

  return (
    <group ref={groupRef} rotation={[0, Math.PI, 0]} onPointerMove={handlePointerMove}>
      <Nodes nodes={nodes} />
      <CurvedEdges nodes={nodes} edges={edges} />
      <TravelingParticle nodes={nodes} edges={edges} />
    </group>
  );
}

export default function KnowledgeGraph3D({ className = "" }: { className?: string }) {
  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        dpr={[1, 1.5]}
        frameloop="always"
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Scene />
        <EffectComposer>
          <Bloom
            intensity={0.8}
            luminanceThreshold={0.2}
            luminanceSmoothing={0.9}
            mipmapBlur
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
