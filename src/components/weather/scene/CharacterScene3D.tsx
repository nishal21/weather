"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useAnimations, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import type { WeatherCondition } from "@/lib/weather/types";

type Props = {
  condition: WeatherCondition;
  isDay?: boolean;
};

function UmbrellaProp({ color = "#2563eb" }: { color?: string }) {
  return (
    <group position={[0.12, 0.15, 0.05]} rotation={[0.15, 0, 0.25]}>
      <mesh position={[0, 0.55, 0]} castShadow>
        <cylinderGeometry args={[0.012, 0.012, 1.05, 8]} />
        <meshStandardMaterial color="#1e293b" roughness={0.5} />
      </mesh>
      <mesh position={[0, 1.05, 0]} rotation={[Math.PI, 0, 0]} castShadow>
        <coneGeometry args={[0.55, 0.35, 24, 1, true]} />
        <meshStandardMaterial
          color={color}
          side={THREE.DoubleSide}
          roughness={0.35}
          metalness={0.1}
        />
      </mesh>
    </group>
  );
}

function SoldierWalker({
  condition,
  isDay = true,
}: {
  condition: WeatherCondition;
  isDay?: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF("/models/Soldier.glb");
  const { actions, mixer } = useAnimations(animations, group);
  const rainy =
    condition === "light_rain" ||
    condition === "heavy_rain" ||
    condition === "thunderstorm" ||
    condition === "snow";

  const cloned = useMemo(() => {
    const root = scene.clone(true);
    root.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        obj.castShadow = true;
        obj.receiveShadow = true;
      }
    });
    return root;
  }, [scene]);

  const hand = useMemo(() => {
    let bone: THREE.Object3D | undefined;
    cloned.traverse((obj) => {
      const n = obj.name.toLowerCase();
      if (
        !bone &&
        (n.includes("righthand") ||
          n.includes("right_hand") ||
          n.includes("hand_r") ||
          n === "mixamorigrighthand")
      ) {
        bone = obj;
      }
    });
    if (!bone) {
      cloned.traverse((obj) => {
        const n = obj.name.toLowerCase();
        if (!bone && (n.includes("head") || n.includes("spine2"))) bone = obj;
      });
    }
    return bone;
  }, [cloned]);

  useEffect(() => {
    if (!hand || !rainy) return;
    const holder = new THREE.Group();
    holder.name = "UmbrellaHolder";
    hand.add(holder);
    return () => {
      hand.remove(holder);
    };
  }, [hand, rainy]);

  useEffect(() => {
    const walk =
      actions.Walk ||
      actions.walk ||
      actions["Walk"] ||
      Object.values(actions).find((a) =>
        a?.getClip().name.toLowerCase().includes("walk"),
      );
    const idle =
      actions.Idle ||
      actions.idle ||
      actions["Idle"] ||
      Object.values(actions).find((a) =>
        a?.getClip().name.toLowerCase().includes("idle"),
      );

    if (!walk) return;

    walk.reset().fadeIn(0.2).play();
    walk.setEffectiveWeight(1);

    const t = window.setTimeout(() => {
      walk.fadeOut(0.45);
      idle?.reset().fadeIn(0.45).play();
    }, 2200);

    return () => {
      window.clearTimeout(t);
      mixer?.stopAllAction();
    };
  }, [actions, mixer]);

  // Walk in from left then settle
  const start = useRef(performance.now());
  useFrame(() => {
    if (!group.current) return;
    const elapsed = (performance.now() - start.current) / 1000;
    const from = -2.4;
    const to = 0;
    const t = Math.min(1, elapsed / 2.1);
    const eased = 1 - Math.pow(1 - t, 3);
    group.current.position.x = from + (to - from) * eased;
    // subtle idle bob after arrive
    if (t >= 1) {
      group.current.position.y = Math.sin(elapsed * 2) * 0.01;
    }
  });

  const coatTint =
    rainy && isDay
      ? "#4b7bec"
      : !isDay
        ? "#6c5ce7"
        : condition === "heatwave"
          ? "#00cec9"
          : undefined;

  useEffect(() => {
    if (!coatTint) return;
    cloned.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (!mesh.isMesh) return;
      const mats = Array.isArray(mesh.material)
        ? mesh.material
        : [mesh.material];
      mats.forEach((m) => {
        const std = m as THREE.MeshStandardMaterial;
        if (std?.color && mesh.name.toLowerCase().includes("vanguard")) {
          // leave base textures; soft multiply via emissive-ish not needed
        }
      });
    });
  }, [cloned, coatTint]);

  return (
    <group
      ref={group}
      position={[-2.4, -0.95, 0]}
      rotation={[0, Math.PI * 0.85, 0]}
      scale={0.85}
    >
      <primitive object={cloned} />
      {rainy ? (
        <group position={[0, 1.15, 0.15]}>
          <UmbrellaProp color={condition === "snow" ? "#94a3b8" : "#2563eb"} />
        </group>
      ) : null}
    </group>
  );
}

useGLTF.preload("/models/Soldier.glb");

export function CharacterScene3D({ condition, isDay = true }: Props) {
  return (
    <div className="pointer-events-none absolute inset-0 z-[5]">
      <Canvas
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 1.1, 3.2], fov: 35, near: 0.1, far: 40 }}
        dpr={[1, 1.75]}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={isDay ? 0.75 : 0.35} />
        <directionalLight
          castShadow
          position={isDay ? [3, 6, 2] : [1, 4, 3]}
          intensity={isDay ? 1.35 : 0.55}
          color={isDay ? "#fff7ed" : "#c7d2fe"}
        />
        <hemisphereLight
          intensity={0.45}
          color={isDay ? "#bfdbfe" : "#1e293b"}
          groundColor={isDay ? "#166534" : "#0f172a"}
        />
        <Suspense fallback={null}>
          <SoldierWalker condition={condition} isDay={isDay} />
        </Suspense>
      </Canvas>
    </div>
  );
}
