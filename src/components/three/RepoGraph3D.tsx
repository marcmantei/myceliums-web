"use client";

import { useRef, useMemo, useState, useEffect, useCallback } from "react";
import { Canvas, useFrame, useThree, ThreeEvent } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { OrbitControls, Html } from "@react-three/drei";
import { X } from "lucide-react";
import * as THREE from "three";

const KIND_COLORS: Record<string, string> = {
  Function: "#6366F1",
  Variable: "#10B981",
  Constant: "#F59E0B",
  Class: "#EC4899",
  Method: "#8B5CF6",
  Interface: "#06B6D4",
  Module: "#14B8A6",
  Import: "#64748B",
};

// Vibrant community cluster colors (Gemini-embedding style)
const COMMUNITY_COLORS = [
  "#10B981", "#6366F1", "#F59E0B", "#EC4899", "#06B6D4",
  "#8B5CF6", "#14B8A6", "#EF4444", "#84CC16", "#F97316",
  "#A855F7", "#0EA5E9", "#D946EF", "#22D3EE", "#FB923C",
  "#34D399", "#818CF8", "#FBBF24", "#F472B6", "#2DD4BF",
  "#C084FC", "#4ADE80", "#FB7185", "#38BDF8", "#E879F9",
];

const KIND_LABELS: Record<string, string> = {
  Function: "Functions",
  Variable: "Variables",
  Constant: "Constants",
  Class: "Classes",
  Method: "Methods",
  Interface: "Interfaces",
  Module: "Modules",
  Import: "Imports",
};

const CURVE_SEGMENTS = 12;
const DIM_COLOR = new THREE.Color(0.08, 0.08, 0.1);
const BRIGHT_MIX = new THREE.Color();

interface GraphNode {
  id: string;
  name: string;
  kind: string;
  file_path: string;
  qualified_name: string;
  community?: string;
}

interface GraphEdge {
  source: string;
  target: string;
  kind: string;
}

interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

interface LayoutNode {
  x: number;
  y: number;
  z: number;
  color: THREE.Color;
  scale: number;
}

interface HoveredNode {
  index: number;
  name: string;
  kind: string;
  file_path: string;
  qualified_name: string;
  connections: number;
  x: number;
  y: number;
}

interface SpotlightData {
  index: number;
  node: GraphNode;
  connections: { index: number; node: GraphNode; edgeKind: string; direction: "incoming" | "outgoing" }[];
}

interface ClusterLabel {
  dirKey: string;
  label: string;
  count: number;
  position: [number, number, number];
  center: [number, number, number];
  radius: number;
}

function layoutGraph(data: GraphData): {
  nodes: LayoutNode[];
  edgeIndices: [number, number][];
  clusters: ClusterLabel[];
  neighbors: Set<number>[];
  nodeDir: string[];
} {
  const idToIndex = new Map<string, number>();
  data.nodes.forEach((n, i) => idToIndex.set(n.id, i));

  const dirMap = new Map<string, number[]>();
  data.nodes.forEach((n, i) => {
    const dir = n.file_path.split("/").slice(0, -1).join("/") || "/";
    if (!dirMap.has(dir)) dirMap.set(dir, []);
    dirMap.get(dir)!.push(i);
  });

  const dirs = Array.from(dirMap.keys());
  const dirPositions = new Map<string, [number, number, number]>();
  const spread = Math.cbrt(dirs.length) * 2.5;

  dirs.forEach((dir, i) => {
    const phi = Math.acos(1 - (2 * (i + 0.5)) / dirs.length);
    const theta = Math.PI * (1 + Math.sqrt(5)) * i;
    dirPositions.set(dir, [
      spread * Math.sin(phi) * Math.cos(theta),
      spread * Math.sin(phi) * Math.sin(theta),
      spread * Math.cos(phi),
    ]);
  });

  const nodeDir: string[] = data.nodes.map((n) => n.file_path.split("/").slice(0, -1).join("/") || "/");

  const edgeIndices: [number, number][] = [];
  const neighbors: Set<number>[] = Array.from({ length: data.nodes.length }, () => new Set());

  for (const edge of data.edges) {
    const from = idToIndex.get(edge.source);
    const to = idToIndex.get(edge.target);
    if (from !== undefined && to !== undefined) {
      edgeIndices.push([from, to]);
      neighbors[from].add(to);
      neighbors[to].add(from);
    }
  }

  const DOT_SIZE = 0.01;

  // Build community → color map for vibrant cluster coloring
  const communityColorMap = new Map<string, string>();
  let communityIdx = 0;
  data.nodes.forEach((n) => {
    if (n.community && !communityColorMap.has(n.community)) {
      communityColorMap.set(n.community, COMMUNITY_COLORS[communityIdx % COMMUNITY_COLORS.length]);
      communityIdx++;
    }
  });
  const hasCommunities = communityColorMap.size > 1;

  const nodes: LayoutNode[] = data.nodes.map((n, i) => {
    const dir = nodeDir[i];
    const base = dirPositions.get(dir) || [0, 0, 0];
    const jitter = 0.8;
    // Use community colors for vibrant cluster separation, fall back to kind colors
    const nodeColor = hasCommunities && n.community
      ? communityColorMap.get(n.community) || KIND_COLORS[n.kind] || "#6366F1"
      : KIND_COLORS[n.kind] || "#6366F1";
    return {
      x: base[0] + (Math.random() - 0.5) * jitter,
      y: base[1] + (Math.random() - 0.5) * jitter,
      z: base[2] + (Math.random() - 0.5) * jitter,
      color: new THREE.Color(nodeColor),
      scale: DOT_SIZE,
    };
  });

  const clusters: ClusterLabel[] = [];
  for (const [dir, indices] of dirMap) {
    if (indices.length < 5) continue;
    const pos = dirPositions.get(dir) || [0, 0, 0];
    const label = dir === "/" ? "(root)" : dir.split("/").pop() || dir;
    let maxDist = 0;
    for (const idx of indices) {
      const n = nodes[idx];
      const dx = n.x - pos[0];
      const dy = n.y - pos[1];
      const dz = n.z - pos[2];
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
      if (dist > maxDist) maxDist = dist;
    }
    clusters.push({
      dirKey: dir,
      label,
      count: indices.length,
      position: [pos[0], pos[1] + maxDist + 0.3, pos[2]],
      center: [pos[0], pos[1], pos[2]],
      radius: maxDist + 0.1,
    });
  }

  return { nodes, edgeIndices, clusters, neighbors, nodeDir };
}

// Compute spotlight positions: center node at origin, neighbors in a ring
function spotlightPositions(
  centerIdx: number,
  neighborSet: Set<number>,
  nodeCount: number
): { positions: Map<number, [number, number, number]>; radius: number } {
  const positions = new Map<number, [number, number, number]>();
  positions.set(centerIdx, [0, 0, 0]);

  const neighborArr = Array.from(neighborSet);
  // Scale ring to fill viewport — more neighbors = larger ring
  const ringRadius = Math.max(2, Math.min(4, 1.5 + neighborArr.length * 0.08));
  neighborArr.forEach((idx, i) => {
    const angle = (i / neighborArr.length) * Math.PI * 2;
    positions.set(idx, [
      ringRadius * Math.cos(angle),
      ringRadius * Math.sin(angle),
      (Math.random() - 0.5) * 0.3,
    ]);
  });

  return { positions, radius: ringRadius };
}

function Nodes({
  nodes,
  onHover,
  onUnhover,
  onClick,
  hoveredIndex,
  connectedSet,
  hiddenNodes,
  spotlightIdx,
  spotlightPositionsMap,
  spotlightNeighbors,
  expandedDir,
  expandedCluster,
  nodeDir,
}: {
  nodes: LayoutNode[];
  onHover: (index: number, event: ThreeEvent<PointerEvent>) => void;
  onUnhover: () => void;
  onClick: (index: number) => void;
  hoveredIndex: number | null;
  connectedSet: Set<number> | null;
  hiddenNodes: Set<number>;
  spotlightIdx: number | null;
  spotlightPositionsMap: Map<number, [number, number, number]> | null;
  spotlightNeighbors: Set<number> | null;
  expandedDir: string | null;
  expandedCluster: ClusterLabel | null;
  nodeDir: string[];
}) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const time = useRef(0);
  const tmpColor = useMemo(() => new THREE.Color(), []);
  const { camera } = useThree();
  const tmpPos = useMemo(() => new THREE.Vector3(), []);
  // Smooth interpolation for position and scale
  const currentPos = useRef<Float32Array | null>(null);
  const currentScale = useRef<Float32Array | null>(null);

  useEffect(() => {
    currentPos.current = new Float32Array(nodes.length * 3);
    currentScale.current = new Float32Array(nodes.length);
    for (let i = 0; i < nodes.length; i++) {
      currentPos.current[i * 3] = nodes[i].x;
      currentPos.current[i * 3 + 1] = nodes[i].y;
      currentPos.current[i * 3 + 2] = nodes[i].z;
      currentScale.current[i] = nodes[i].scale;
    }
    if (meshRef.current) {
      meshRef.current.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 0, 0), 50);
      meshRef.current.frustumCulled = false;
    }
  }, [nodes]);

  useFrame((_, delta) => {
    if (!meshRef.current || !currentPos.current || !currentScale.current) return;
    time.current += delta;
    const lerpSpeed = Math.min(delta * 5, 1);

    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      const isSpotlight = spotlightIdx !== null;
      const isCenter = i === spotlightIdx;
      const isNeighbor = spotlightNeighbors?.has(i);
      const isHidden = hiddenNodes.has(i);
      const isInExpanded = expandedDir !== null && nodeDir[i] === expandedDir;

      // Target position — expanded clusters spread nodes from center
      let tx = node.x, ty = node.y, tz = node.z;
      if (isSpotlight && spotlightPositionsMap) {
        const sp = spotlightPositionsMap.get(i);
        if (sp) { tx = sp[0]; ty = sp[1]; tz = sp[2]; }
      } else if (isInExpanded && expandedCluster) {
        // Spread positions: scale offset from cluster center by 2.5x
        const cx = expandedCluster.center[0];
        const cy = expandedCluster.center[1];
        const cz = expandedCluster.center[2];
        tx = cx + (node.x - cx) * 2.5;
        ty = cy + (node.y - cy) * 2.5;
        tz = cz + (node.z - cz) * 2.5;
      }

      // Lerp position
      const ci = i * 3;
      currentPos.current[ci] += (tx - currentPos.current[ci]) * lerpSpeed;
      currentPos.current[ci + 1] += (ty - currentPos.current[ci + 1]) * lerpSpeed;
      currentPos.current[ci + 2] += (tz - currentPos.current[ci + 2]) * lerpSpeed;

      // Determine target scale and color — uniform dot size
      let targetScale = node.scale;
      if (isHidden || (isSpotlight && !isCenter && !isNeighbor)) {
        targetScale = 0;
        tmpColor.set(0, 0, 0);
      } else if (isSpotlight) {
        if (isCenter) {
          targetScale = node.scale * 2;
          BRIGHT_MIX.copy(node.color).lerp(new THREE.Color(1, 1, 1), 0.4);
          tmpColor.copy(BRIGHT_MIX);
        } else {
          targetScale = node.scale;
          tmpColor.copy(node.color);
        }
      } else if (hoveredIndex !== null) {
        if (i === hoveredIndex) {
          targetScale = node.scale * 1.5;
          BRIGHT_MIX.copy(node.color).lerp(new THREE.Color(1, 1, 1), 0.4);
          tmpColor.copy(BRIGHT_MIX);
        } else if (connectedSet?.has(i)) {
          tmpColor.copy(node.color);
        } else {
          tmpColor.copy(DIM_COLOR);
        }
      } else if (expandedDir !== null && !isInExpanded) {
        tmpColor.copy(DIM_COLOR);
      } else {
        tmpColor.copy(node.color);
      }

      // Depth-based brightness: near = boosted, far = dimmed
      if (targetScale > 0 && tmpColor.r + tmpColor.g + tmpColor.b > 0.1) {
        tmpPos.set(currentPos.current[ci], currentPos.current[ci + 1], currentPos.current[ci + 2]);
        const dist = camera.position.distanceTo(tmpPos);
        // Map distance to a 0..1 range (near=0, far=1), clamped
        const depthFactor = THREE.MathUtils.clamp((dist - 4) / 18, 0, 1);
        // Near: boost brightness +30%, Far: dim to 50%
        const brightnessMul = 1.3 - depthFactor * 0.8;
        tmpColor.multiplyScalar(brightnessMul);
      }

      // Lerp scale for smooth transitions
      currentScale.current[i] += (targetScale - currentScale.current[i]) * lerpSpeed;

      dummy.position.set(currentPos.current[ci], currentPos.current[ci + 1], currentPos.current[ci + 2]);
      if (!isSpotlight && i < 200 && targetScale > 0) {
        dummy.position.y += Math.sin(time.current * 0.3 + i * 0.1) * 0.015;
      }
      dummy.scale.setScalar(currentScale.current[i]);

      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
      meshRef.current.setColorAt(i, tmpColor);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
  });

  const handlePointerOver = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      if (e.instanceId !== undefined) onHover(e.instanceId, e);
    },
    [onHover]
  );

  const handleClick = useCallback(
    (e: ThreeEvent<MouseEvent>) => {
      e.stopPropagation();
      if (e.instanceId !== undefined) onClick(e.instanceId);
    },
    [onClick]
  );

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, nodes.length]}
      onPointerOver={handlePointerOver}
      onPointerMove={handlePointerOver}
      onPointerLeave={onUnhover}
      onClick={handleClick}
      frustumCulled={false}
    >
      <sphereGeometry args={[2, 8, 8]} />
      <meshBasicMaterial toneMapped={false} />
    </instancedMesh>
  );
}

function buildCurveGeo(
  edges: [number, number][],
  nodes: LayoutNode[],
  colored: boolean,
  posOverrides?: Map<number, [number, number, number]> | null,
) {
  const pointsPerCurve = CURVE_SEGMENTS + 1;
  const positions = new Float32Array(edges.length * pointsPerCurve * 3);
  const colors = colored ? new Float32Array(edges.length * pointsPerCurve * 3) : null;
  const tmpA = new THREE.Vector3();
  const tmpB = new THREE.Vector3();
  const tmpMid = new THREE.Vector3();
  const tmpControl = new THREE.Vector3();
  const tmpUp = new THREE.Vector3();
  const tmpColor = new THREE.Color();

  for (let i = 0; i < edges.length; i++) {
    const [from, to] = edges[i];
    const a = nodes[from];
    const b = nodes[to];
    const aPos = posOverrides?.get(from);
    const bPos = posOverrides?.get(to);
    tmpA.set(aPos ? aPos[0] : a.x, aPos ? aPos[1] : a.y, aPos ? aPos[2] : a.z);
    tmpB.set(bPos ? bPos[0] : b.x, bPos ? bPos[1] : b.y, bPos ? bPos[2] : b.z);
    tmpMid.lerpVectors(tmpA, tmpB, 0.5);
    const dist = tmpA.distanceTo(tmpB);
    const bowAmount = dist * 0.25;
    tmpUp.set(0, 1, 0);
    const edgeDir = tmpB.clone().sub(tmpA).normalize();
    const perp = new THREE.Vector3().crossVectors(edgeDir, tmpUp).normalize();
    if (perp.length() < 0.1) {
      tmpUp.set(1, 0, 0);
      perp.crossVectors(edgeDir, tmpUp).normalize();
    }
    const outward = tmpMid.clone().normalize();
    tmpControl.copy(tmpMid).addScaledVector(perp, bowAmount * 0.5).addScaledVector(outward, bowAmount * 0.5);

    const offset = i * pointsPerCurve * 3;
    for (let s = 0; s <= CURVE_SEGMENTS; s++) {
      const t = s / CURVE_SEGMENTS;
      const omt = 1 - t;
      positions[offset + s * 3] = omt * omt * tmpA.x + 2 * omt * t * tmpControl.x + t * t * tmpB.x;
      positions[offset + s * 3 + 1] = omt * omt * tmpA.y + 2 * omt * t * tmpControl.y + t * t * tmpB.y;
      positions[offset + s * 3 + 2] = omt * omt * tmpA.z + 2 * omt * t * tmpControl.z + t * t * tmpB.z;

      // Gradient from source color to target color along the curve
      if (colors) {
        tmpColor.copy(a.color).lerp(b.color, t);
        colors[offset + s * 3] = tmpColor.r;
        colors[offset + s * 3 + 1] = tmpColor.g;
        colors[offset + s * 3 + 2] = tmpColor.b;
      }
    }
  }

  const indices: number[] = [];
  for (let i = 0; i < edges.length; i++) {
    const base = i * pointsPerCurve;
    for (let s = 0; s < CURVE_SEGMENTS; s++) {
      indices.push(base + s, base + s + 1);
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  if (colors) {
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  }
  geo.setIndex(indices);
  return geo;
}

function CurvedEdges({
  nodes,
  edgeIndices,
  hoveredIndex,
  spotlightIdx,
  spotlightPositionsMap,
}: {
  nodes: LayoutNode[];
  edgeIndices: [number, number][];
  hoveredIndex: number | null;
  spotlightIdx: number | null;
  spotlightPositionsMap: Map<number, [number, number, number]> | null;
}) {
  const { dimGeo, brightGeo } = useMemo(() => {
    let relevantEdges = edgeIndices;
    if (spotlightIdx !== null) {
      relevantEdges = edgeIndices.filter(
        ([from, to]) => from === spotlightIdx || to === spotlightIdx
      );
    }

    const sampled =
      relevantEdges.length > 2000
        ? relevantEdges.filter((_, i) => i % Math.ceil(relevantEdges.length / 2000) === 0)
        : relevantEdges;

    const dimEdges: [number, number][] = [];
    const brightEdges: [number, number][] = [];

    for (const [from, to] of sampled) {
      if (spotlightIdx !== null) {
        brightEdges.push([from, to]);
      } else if (hoveredIndex !== null && (from === hoveredIndex || to === hoveredIndex)) {
        brightEdges.push([from, to]);
      } else {
        dimEdges.push([from, to]);
      }
    }

    const overrides = spotlightIdx !== null ? spotlightPositionsMap : null;
    return {
      dimGeo: dimEdges.length > 0 ? buildCurveGeo(dimEdges, nodes, true, overrides) : null,
      brightGeo: brightEdges.length > 0 ? buildCurveGeo(brightEdges, nodes, true, overrides) : null,
    };
  }, [nodes, edgeIndices, hoveredIndex, spotlightIdx, spotlightPositionsMap]);

  const dimOpacity = hoveredIndex !== null || spotlightIdx !== null ? 0.03 : 0.1;

  return (
    <>
      {dimGeo && (
        <lineSegments geometry={dimGeo}>
          <lineBasicMaterial vertexColors opacity={dimOpacity} transparent />
        </lineSegments>
      )}
      {brightGeo && (
        <lineSegments geometry={brightGeo}>
          <lineBasicMaterial vertexColors opacity={spotlightIdx !== null ? 0.5 : 0.7} transparent />
        </lineSegments>
      )}
    </>
  );
}

const PARTICLE_COUNT = 30;

function TravelingParticles({ nodes, edgeIndices }: { nodes: LayoutNode[]; edgeIndices: [number, number][] }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() => {
    if (edgeIndices.length === 0) return [];
    return Array.from({ length: PARTICLE_COUNT }, () => ({
      edgeIdx: Math.floor(Math.random() * edgeIndices.length),
      progress: Math.random(),
      speed: 0.3 + Math.random() * 0.4,
    }));
  }, [edgeIndices]);

  const controlPoints = useMemo(() => {
    const tmpA = new THREE.Vector3();
    const tmpB = new THREE.Vector3();
    const tmpMid = new THREE.Vector3();
    const tmpUp = new THREE.Vector3();

    return edgeIndices.map(([from, to]) => {
      const a = nodes[from];
      const b = nodes[to];
      tmpA.set(a.x, a.y, a.z);
      tmpB.set(b.x, b.y, b.z);
      tmpMid.lerpVectors(tmpA, tmpB, 0.5);
      const dist = tmpA.distanceTo(tmpB);
      const bowAmount = dist * 0.25;
      tmpUp.set(0, 1, 0);
      const edgeDir = tmpB.clone().sub(tmpA).normalize();
      const perp = new THREE.Vector3().crossVectors(edgeDir, tmpUp).normalize();
      if (perp.length() < 0.1) {
        tmpUp.set(1, 0, 0);
        perp.crossVectors(edgeDir, tmpUp).normalize();
      }
      const outward = tmpMid.clone().normalize();
      const ctrl = tmpMid.clone().addScaledVector(perp, bowAmount * 0.5).addScaledVector(outward, bowAmount * 0.5);
      return { start: tmpA.clone(), end: tmpB.clone(), ctrl };
    });
  }, [nodes, edgeIndices]);

  useFrame((_, delta) => {
    if (!meshRef.current || particles.length === 0 || controlPoints.length === 0) return;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.progress += delta * p.speed;
      if (p.progress > 1) {
        p.progress = 0;
        p.edgeIdx = Math.floor(Math.random() * edgeIndices.length);
      }

      const cp = controlPoints[p.edgeIdx];
      if (!cp) continue;
      const t = p.progress;
      const omt = 1 - t;

      dummy.position.set(
        omt * omt * cp.start.x + 2 * omt * t * cp.ctrl.x + t * t * cp.end.x,
        omt * omt * cp.start.y + 2 * omt * t * cp.ctrl.y + t * t * cp.end.y,
        omt * omt * cp.start.z + 2 * omt * t * cp.ctrl.z + t * t * cp.end.z
      );
      dummy.scale.setScalar(0.025);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  if (particles.length === 0) return null;

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, PARTICLE_COUNT]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial color="#818CF8" toneMapped={false} />
    </instancedMesh>
  );
}

const noRaycast = () => {};

const clusterGlowFrag = `
  uniform vec3 uColor;
  uniform float uOpacity;
  varying vec2 vUv;
  void main() {
    float dist = distance(vUv, vec2(0.5));
    // Ring shape: transparent center -> visible band -> transparent edge
    float inner = smoothstep(0.15, 0.35, dist);
    float outer = 1.0 - smoothstep(0.4, 0.5, dist);
    float alpha = inner * outer * uOpacity * 0.5;
    gl_FragColor = vec4(uColor, alpha);
  }
`;
const clusterGlowVert = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const _parentWorldQuat = new THREE.Quaternion();
const _localQuat = new THREE.Quaternion();

function ClusterGlow({ center, radius, color, opacity }: {
  center: [number, number, number];
  radius: number;
  color: THREE.Color;
  opacity: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const { camera } = useThree();

  // Billboard: always face camera, compensating for parent group rotation
  useFrame(() => {
    if (!ref.current || !ref.current.parent) return;
    ref.current.parent.getWorldQuaternion(_parentWorldQuat);
    _localQuat.copy(_parentWorldQuat).invert().multiply(camera.quaternion);
    ref.current.quaternion.copy(_localQuat);
  });

  const uniforms = useMemo(() => ({
    uColor: { value: color },
    uOpacity: { value: opacity },
  }), [color, opacity]);

  return (
    <mesh ref={ref} position={center} raycast={noRaycast}>
      <planeGeometry args={[radius * 2.4, radius * 2.4]} />
      <shaderMaterial
        vertexShader={clusterGlowVert}
        fragmentShader={clusterGlowFrag}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}

function ClusterBoundaries({
  clusters,
  hiddenDirs,
  expandedDir,
}: {
  clusters: ClusterLabel[];
  hiddenDirs: Set<string>;
  expandedDir: string | null;
}) {
  return (
    <>
      {clusters.map((c) => {
        const hidden = hiddenDirs.has(c.dirKey);
        if (hidden) return null;
        const expanded = expandedDir === c.dirKey;
        const radius = expanded ? c.radius * 1.8 : c.radius;
        const color = expanded ? new THREE.Color("#818CF8") : new THREE.Color("#6366F1");
        const opacity = expanded ? 0.15 : 0.07;
        return (
          <ClusterGlow
            key={c.dirKey + "boundary"}
            center={c.center}
            radius={radius}
            color={color}
            opacity={opacity}
          />
        );
      })}
    </>
  );
}

function ClusterLabels({
  clusters,
  hiddenDirs,
  onToggle,
  onExpand,
  expandedDir,
}: {
  clusters: ClusterLabel[];
  hiddenDirs: Set<string>;
  onToggle: (dirKey: string) => void;
  onExpand: (dirKey: string) => void;
  expandedDir: string | null;
}) {
  return (
    <>
      {clusters.map((c) => {
        const hidden = hiddenDirs.has(c.dirKey);
        const expanded = expandedDir === c.dirKey;
        return (
          <Html key={c.dirKey} position={c.position} center distanceFactor={8} style={{ userSelect: "none" }}>
            <div className="flex items-center gap-1 whitespace-nowrap">
              <button
                onClick={() => onToggle(c.dirKey)}
                className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded transition-all duration-200 cursor-pointer"
                style={{
                  backgroundColor: hidden ? "rgba(75,85,99,0.5)" : expanded ? "rgba(99,102,241,0.3)" : "rgba(9,9,11,0.75)",
                  color: hidden ? "rgba(255,255,255,0.35)" : expanded ? "#818CF8" : "rgba(255,255,255,0.7)",
                  backdropFilter: "blur(4px)",
                  border: hidden ? "1px solid rgba(255,255,255,0.15)" : expanded ? "1px solid rgba(99,102,241,0.3)" : "1px solid rgba(255,255,255,0.08)",
                  textDecoration: hidden ? "line-through" : "none",
                }}
              >
                {c.label}
                <span style={{ marginLeft: 6, opacity: 0.5 }}>{c.count}</span>
              </button>
              {!hidden && (
                <button
                  onClick={() => onExpand(c.dirKey)}
                  className="text-[9px] font-mono px-1 py-0.5 rounded cursor-pointer transition-all duration-200"
                  style={{
                    backgroundColor: expanded ? "rgba(99,102,241,0.3)" : "rgba(255,255,255,0.06)",
                    color: expanded ? "#818CF8" : "rgba(255,255,255,0.4)",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                  title={expanded ? "Collapse cluster" : "Expand to show internal connections"}
                >
                  {expanded ? "−" : "+"}
                </button>
              )}
            </div>
          </Html>
        );
      })}
    </>
  );
}

// Spotlight labels for neighbors in the radial ring
function SpotlightLabels({
  spotlight,
  spotlightPositionsMap,
}: {
  spotlight: SpotlightData;
  spotlightPositionsMap: Map<number, [number, number, number]>;
}) {
  return (
    <>
      {spotlight.connections.slice(0, 40).map((conn) => {
        const pos = spotlightPositionsMap.get(conn.index);
        if (!pos) return null;
        return (
          <Html
            key={conn.index}
            position={[pos[0], pos[1] + 0.35, pos[2]]}
            center
            style={{ pointerEvents: "none", userSelect: "none", minWidth: "60px" }}
          >
            <div className="whitespace-nowrap text-center">
              <span
                className="text-xs font-mono px-1.5 py-1 rounded font-medium"
                style={{
                  backgroundColor: "rgba(9,9,11,0.9)",
                  color: KIND_COLORS[conn.node.kind] || "#6366F1",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                {conn.node.name}
              </span>
              <div className="text-[9px] text-text-tertiary mt-0.5">{conn.edgeKind}</div>
            </div>
          </Html>
        );
      })}
    </>
  );
}

// Internal cluster edges shown when a cluster is expanded
function ClusterInternalEdges({
  nodes,
  edgeIndices,
  nodeDir,
  expandedDir,
}: {
  nodes: LayoutNode[];
  edgeIndices: [number, number][];
  nodeDir: string[];
  expandedDir: string;
}) {
  const geo = useMemo(() => {
    const internalEdges = edgeIndices.filter(
      ([from, to]) => nodeDir[from] === expandedDir && nodeDir[to] === expandedDir
    );
    if (internalEdges.length === 0) return null;
    return buildCurveGeo(internalEdges, nodes, true);
  }, [nodes, edgeIndices, nodeDir, expandedDir]);

  if (!geo) return null;
  return (
    <lineSegments geometry={geo}>
      <lineBasicMaterial vertexColors opacity={0.35} transparent />
    </lineSegments>
  );
}

function Scene({
  data,
  onHover,
  onUnhover,
  onClick,
  paused,
  hoveredIndex,
  hiddenDirs,
  onToggleDir,
  spotlight,
  expandedDir,
  onExpandDir,
}: {
  data: GraphData;
  onHover: (index: number, event: ThreeEvent<PointerEvent>) => void;
  onUnhover: () => void;
  onClick: (index: number) => void;
  paused: boolean;
  hoveredIndex: number | null;
  hiddenDirs: Set<string>;
  onToggleDir: (dirKey: string) => void;
  spotlight: SpotlightData | null;
  expandedDir: string | null;
  onExpandDir: (dirKey: string) => void;
}) {
  const { nodes, edgeIndices, clusters, neighbors, nodeDir } = useMemo(() => layoutGraph(data), [data]);
  const groupRef = useRef<THREE.Group>(null);
  const speedRef = useRef(0.0008);
  const controlsRef = useRef<any>(null);
  const { camera } = useThree();

  // Camera target for smooth transitions
  const expandedCluster = useMemo(() => {
    if (!expandedDir) return null;
    return clusters.find((c) => c.dirKey === expandedDir) || null;
  }, [expandedDir, clusters]);

  const cameraAnimating = useRef(false);
  const prevExpandedDir = useRef<string | null>(null);
  const prevSpotlight = useRef<number | null>(null);

  const connectedSet = useMemo(() => {
    if (hoveredIndex === null) return null;
    return neighbors[hoveredIndex] || new Set();
  }, [hoveredIndex, neighbors]);

  const hiddenNodes = useMemo(() => {
    const set = new Set<number>();
    if (hiddenDirs.size === 0) return set;
    for (let i = 0; i < nodeDir.length; i++) {
      if (hiddenDirs.has(nodeDir[i])) set.add(i);
    }
    return set;
  }, [hiddenDirs, nodeDir]);

  const visibleEdgeIndices = useMemo(() => {
    if (hiddenDirs.size === 0) return edgeIndices;
    return edgeIndices.filter(([from, to]) => !hiddenNodes.has(from) && !hiddenNodes.has(to));
  }, [edgeIndices, hiddenNodes, hiddenDirs]);

  const spotlightNeighbors = useMemo(() => {
    if (!spotlight) return null;
    return new Set(spotlight.connections.map((c) => c.index));
  }, [spotlight]);

  const spotlightLayout = useMemo(() => {
    if (!spotlight) return null;
    return spotlightPositions(spotlight.index, spotlightNeighbors!, nodes.length);
  }, [spotlight, spotlightNeighbors, nodes.length]);

  const spotlightPosMap = spotlightLayout?.positions ?? null;
  const spotlightRadius = spotlightLayout?.radius ?? 3;

  useFrame((_, delta) => {
    const rotTarget = paused || spotlight || expandedDir ? 0 : 0.0008;
    speedRef.current += (rotTarget - speedRef.current) * Math.min(delta * 4, 1);
    if (groupRef.current) {
      groupRef.current.rotation.y += speedRef.current;
    }

    // Smooth camera transition — on cluster expand/collapse or spotlight enter/exit
    if (controlsRef.current) {
      const dirChanged = expandedDir !== prevExpandedDir.current;
      const spotlightIdx = spotlight?.index ?? null;
      const spotlightChanged = spotlightIdx !== prevSpotlight.current;

      if (dirChanged || spotlightChanged) {
        cameraAnimating.current = true;
        prevExpandedDir.current = expandedDir;
        prevSpotlight.current = spotlightIdx;
      }

      if (cameraAnimating.current) {
        let targetPos: THREE.Vector3;
        let targetLookAt: THREE.Vector3;

        if (spotlight) {
          // Zoom to fit the radial ring
          targetLookAt = new THREE.Vector3(0, 0, 0);
          targetPos = new THREE.Vector3(0, 0, spotlightRadius * 2.2);
        } else if (expandedCluster) {
          const ct = new THREE.Vector3(...expandedCluster.center);
          if (groupRef.current) ct.applyMatrix4(groupRef.current.matrixWorld);
          targetLookAt = ct;
          targetPos = ct.clone().add(new THREE.Vector3(0, 0, expandedCluster.radius * 4 + 2));
        } else {
          targetLookAt = new THREE.Vector3(0, 0, 0);
          targetPos = new THREE.Vector3(0, 0, 12);
        }

        const lerpSpeed = Math.min(delta * 3, 1);
        controlsRef.current.target.lerp(targetLookAt, lerpSpeed);
        camera.position.lerp(targetPos, lerpSpeed);
        controlsRef.current.update();

        // Stop animating once close enough — reset OrbitControls state
        if (camera.position.distanceTo(targetPos) < 0.05) {
          cameraAnimating.current = false;
          // Snap to exact target so OrbitControls has clean state
          controlsRef.current.target.copy(targetLookAt);
          camera.position.copy(targetPos);
          camera.lookAt(targetLookAt);
          controlsRef.current.update();
          // Force OrbitControls to recalculate its internal angles
          controlsRef.current.saveState();
        }
      }
    }
  });

  return (
    <>
      <group ref={groupRef}>
        <Nodes
          nodes={nodes}
          onHover={onHover}
          onUnhover={onUnhover}
          onClick={onClick}
          hoveredIndex={spotlight ? null : hoveredIndex}
          connectedSet={spotlight ? null : connectedSet}
          hiddenNodes={hiddenNodes}
          spotlightIdx={spotlight?.index ?? null}
          spotlightPositionsMap={spotlightPosMap}
          spotlightNeighbors={spotlightNeighbors}
          expandedDir={expandedDir}
          expandedCluster={expandedCluster}
          nodeDir={nodeDir}
        />
        <CurvedEdges
          nodes={nodes}
          edgeIndices={visibleEdgeIndices}
          hoveredIndex={spotlight ? null : hoveredIndex}
          spotlightIdx={spotlight?.index ?? null}
          spotlightPositionsMap={spotlightPosMap}
        />
        {expandedDir && (
          <ClusterInternalEdges
            nodes={nodes}
            edgeIndices={edgeIndices}
            nodeDir={nodeDir}
            expandedDir={expandedDir}
          />
        )}
        {!spotlight && <TravelingParticles nodes={nodes} edgeIndices={visibleEdgeIndices} />}
        {!spotlight && <ClusterBoundaries clusters={clusters} hiddenDirs={hiddenDirs} expandedDir={expandedDir} />}
        {!spotlight && (
          <ClusterLabels
            clusters={clusters}
            hiddenDirs={hiddenDirs}
            onToggle={onToggleDir}
            onExpand={onExpandDir}
            expandedDir={expandedDir}
          />
        )}
        {spotlight && spotlightPosMap && (
          <SpotlightLabels spotlight={spotlight} spotlightPositionsMap={spotlightPosMap} />
        )}
      </group>
      <OrbitControls ref={controlsRef} enableZoom={true} enablePan={false} autoRotate={false} minDistance={2} maxDistance={25} />
    </>
  );
}

// Detail panel for spotlight mode
function SpotlightPanel({
  spotlight,
  onClose,
}: {
  spotlight: SpotlightData;
  onClose: () => void;
}) {
  const calls = spotlight.connections.filter((c) => c.edgeKind === "CALLS");
  const containedBy = spotlight.connections.filter((c) => c.edgeKind === "CONTAINED_BY");

  return (
    <div
      className="absolute top-0 left-0 bottom-0 w-[280px] z-30 overflow-y-auto"
      style={{
        backgroundColor: "rgba(9,9,11,0.95)",
        borderRight: "1px solid rgba(255,255,255,0.08)",
        backdropFilter: "blur(12px)",
      }}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-3 right-3 w-6 h-6 flex items-center justify-center rounded hover:bg-white/10 transition-colors z-10"
      >
        <X className="w-3.5 h-3.5 text-text-secondary" />
      </button>

      <div className="p-4 pt-3">
        {/* Header */}
        <div className="pr-6">
          <h4 className="font-semibold text-sm text-foreground">{spotlight.node.name}</h4>
          <div className="flex items-center gap-1.5 mt-1">
            <span
              className="w-2 h-2 rounded-full inline-block shrink-0"
              style={{ backgroundColor: KIND_COLORS[spotlight.node.kind] || "#6366F1" }}
            />
            <span className="text-xs text-text-secondary">{spotlight.node.kind}</span>
            <span className="text-xs text-text-tertiary">·</span>
            <span className="text-xs text-text-tertiary">{spotlight.connections.length} connections</span>
          </div>
        </div>

        {/* File path */}
        <div className="mt-3 px-2 py-1.5 rounded text-[10px] font-mono text-text-tertiary" style={{ backgroundColor: "rgba(255,255,255,0.03)" }}>
          {spotlight.node.file_path}
        </div>

        {/* Qualified name */}
        {spotlight.node.qualified_name !== spotlight.node.name && (
          <div className="mt-2 text-[10px] font-mono text-text-tertiary truncate">
            {spotlight.node.qualified_name}
          </div>
        )}

        {/* Calls section */}
        {calls.length > 0 && (
          <div className="mt-4">
            <h5 className="text-[10px] font-mono text-accent uppercase tracking-wider mb-2">
              Calls ({calls.length})
            </h5>
            <div className="space-y-1">
              {calls.slice(0, 20).map((c) => (
                <div key={c.index} className="flex items-center gap-1.5 text-xs">
                  <span
                    className="w-1.5 h-1.5 rounded-full inline-block shrink-0"
                    style={{ backgroundColor: KIND_COLORS[c.node.kind] || "#6366F1" }}
                  />
                  <span className="text-text-secondary truncate">{c.node.name}</span>
                  <span className="text-text-tertiary text-[9px] ml-auto shrink-0">
                    {c.direction === "outgoing" ? "→" : "←"}
                  </span>
                </div>
              ))}
              {calls.length > 20 && (
                <div className="text-[10px] text-text-tertiary">+{calls.length - 20} more</div>
              )}
            </div>
          </div>
        )}

        {/* Contained by section */}
        {containedBy.length > 0 && (
          <div className="mt-4">
            <h5 className="text-[10px] font-mono text-text-tertiary uppercase tracking-wider mb-2">
              Contained by ({containedBy.length})
            </h5>
            <div className="space-y-1">
              {containedBy.slice(0, 15).map((c) => (
                <div key={c.index} className="flex items-center gap-1.5 text-xs">
                  <span
                    className="w-1.5 h-1.5 rounded-full inline-block shrink-0"
                    style={{ backgroundColor: KIND_COLORS[c.node.kind] || "#6366F1" }}
                  />
                  <span className="text-text-secondary truncate">{c.node.name}</span>
                  <span className="text-text-tertiary text-[9px] ml-auto shrink-0">
                    {c.direction === "outgoing" ? "↑" : "↓"}
                  </span>
                </div>
              ))}
              {containedBy.length > 15 && (
                <div className="text-[10px] text-text-tertiary">+{containedBy.length - 15} more</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface RepoGraph3DProps {
  src: string;
  className?: string;
}

export default function RepoGraph3D({ src, className = "" }: RepoGraph3DProps) {
  const [data, setData] = useState<GraphData | null>(null);
  const [hovered, setHovered] = useState<HoveredNode | null>(null);
  const [hiddenDirs, setHiddenDirs] = useState<Set<string>>(new Set());
  const [spotlight, setSpotlight] = useState<SpotlightData | null>(null);
  const [expandedDir, setExpandedDir] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(src)
      .then((r) => r.json())
      .then((d) => setData({ nodes: d.nodes, edges: d.edges }))
      .catch(() => {});
  }, [src]);

  const kindCounts = useMemo(() => {
    if (!data) return {};
    const counts: Record<string, number> = {};
    for (const n of data.nodes) {
      counts[n.kind] = (counts[n.kind] || 0) + 1;
    }
    return counts;
  }, [data]);

  const connCounts = useMemo(() => {
    if (!data) return [];
    const counts = new Array(data.nodes.length).fill(0);
    const idToIdx = new Map<string, number>();
    data.nodes.forEach((n, i) => idToIdx.set(n.id, i));
    for (const e of data.edges) {
      const from = idToIdx.get(e.source);
      const to = idToIdx.get(e.target);
      if (from !== undefined) counts[from]++;
      if (to !== undefined) counts[to]++;
    }
    return counts;
  }, [data]);

  // Build edge lookup for spotlight
  const edgeLookup = useMemo(() => {
    if (!data) return new Map<number, { target: number; kind: string; direction: "incoming" | "outgoing" }[]>();
    const idToIdx = new Map<string, number>();
    data.nodes.forEach((n, i) => idToIdx.set(n.id, i));
    const lookup = new Map<number, { target: number; kind: string; direction: "incoming" | "outgoing" }[]>();
    for (const e of data.edges) {
      const from = idToIdx.get(e.source);
      const to = idToIdx.get(e.target);
      if (from === undefined || to === undefined) continue;
      if (!lookup.has(from)) lookup.set(from, []);
      if (!lookup.has(to)) lookup.set(to, []);
      lookup.get(from)!.push({ target: to, kind: e.kind, direction: "outgoing" });
      lookup.get(to)!.push({ target: from, kind: e.kind, direction: "incoming" });
    }
    return lookup;
  }, [data]);

  const handleHover = useCallback(
    (index: number, event: ThreeEvent<PointerEvent>) => {
      if (!data || !containerRef.current || spotlight) return;
      const node = data.nodes[index];
      if (!node) return;
      const rect = containerRef.current.getBoundingClientRect();
      setHovered({
        index,
        name: node.name,
        kind: node.kind,
        file_path: node.file_path,
        qualified_name: node.qualified_name,
        connections: connCounts[index] || 0,
        x: (event.nativeEvent?.clientX ?? 0) - rect.left,
        y: (event.nativeEvent?.clientY ?? 0) - rect.top,
      });
    },
    [data, connCounts, spotlight]
  );

  const handleUnhover = useCallback(() => {
    if (!spotlight) setHovered(null);
  }, [spotlight]);

  // Disabled: spotlight and cluster expand views
  const handleClick = useCallback((_index: number) => {}, []);
  const handleCloseSpotlight = useCallback(() => {}, []);
  const handleExpandDir = useCallback((_dirKey: string) => {}, []);

  const handleToggleDir = useCallback((dirKey: string) => {
    setHiddenDirs((prev) => {
      const next = new Set(prev);
      if (next.has(dirKey)) next.delete(dirKey);
      else next.add(dirKey);
      return next;
    });
  }, []);

  // Click on empty canvas closes spotlight
  const handleCanvasClick = useCallback(() => {
    if (spotlight) setSpotlight(null);
  }, [spotlight]);

  if (!data) {
    return (
      <div className={`w-full h-full flex items-center justify-center ${className}`}>
        <span className="text-xs text-text-tertiary font-mono">Loading graph...</span>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`w-full h-full relative ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 12], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent", cursor: hovered ? "pointer" : "grab" }}
        onPointerMissed={handleCanvasClick}
      >
        <fog attach="fog" args={["#09090B", 8, 28]} />
        <Scene
          data={data}
          onHover={handleHover}
          onUnhover={handleUnhover}
          onClick={handleClick}
          paused={!!hovered || !!spotlight}
          hoveredIndex={hovered?.index ?? null}
          hiddenDirs={hiddenDirs}
          onToggleDir={handleToggleDir}
          spotlight={spotlight}
          expandedDir={expandedDir}
          onExpandDir={handleExpandDir}
        />
        <EffectComposer>
          <Bloom intensity={0.6} luminanceThreshold={0.3} luminanceSmoothing={0.9} mipmapBlur />
        </EffectComposer>
      </Canvas>

      {/* Spotlight panel */}
      {spotlight && <SpotlightPanel spotlight={spotlight} onClose={handleCloseSpotlight} />}

      {/* Tooltip (only in normal mode) */}
      {hovered && !spotlight && (
        <div
          className="absolute pointer-events-none z-20 px-3 py-2 rounded-lg text-xs max-w-[260px]"
          style={{
            left: Math.min(hovered.x + 12, (containerRef.current?.clientWidth ?? 300) - 270),
            top: hovered.y - 10,
            backgroundColor: "rgba(9,9,11,0.95)",
            border: "1px solid rgba(255,255,255,0.12)",
            backdropFilter: "blur(8px)",
          }}
        >
          <div className="font-semibold text-foreground">{hovered.name}</div>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="w-2 h-2 rounded-full inline-block shrink-0" style={{ backgroundColor: KIND_COLORS[hovered.kind] || "#6366F1" }} />
            <span className="text-text-secondary">{hovered.kind}</span>
            <span className="text-text-tertiary">·</span>
            <span className="text-text-tertiary">{hovered.connections} connections</span>
          </div>
          <div className="text-text-tertiary mt-0.5 font-mono text-[10px] truncate">{hovered.file_path}</div>
        </div>
      )}

      {/* Legend (only in normal mode) */}
      {!spotlight && (
        <div
          className="absolute bottom-3 left-3 flex flex-wrap gap-x-3 gap-y-1 z-10 px-3 py-2 rounded-lg"
          style={{ backgroundColor: "rgba(9,9,11,0.7)", backdropFilter: "blur(4px)" }}
        >
          {Object.entries(kindCounts)
            .sort((a, b) => b[1] - a[1])
            .map(([kind, count]) => (
              <div key={kind} className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full inline-block shrink-0" style={{ backgroundColor: KIND_COLORS[kind] || "#6366F1" }} />
                <span className="text-[10px] text-text-secondary">
                  {KIND_LABELS[kind] || kind} ({count.toLocaleString()})
                </span>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
