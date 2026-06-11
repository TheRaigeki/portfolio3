import { Suspense, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Center, OrbitControls, Preload, useGLTF } from "@react-three/drei";

import CanvasLoader from "../Loader";

const MODEL_PATH = "./macbook/scene.glb";

// Model footprint in world units (from its bounding box), as seen
// from the default camera angle.
const PROJECTED_WIDTH = 0.45;
const PROJECTED_HEIGHT = 0.22;

// Entrance animation: a relative offset that eases back to identity,
// so the final pose is exactly the resting pose.
const ENTRANCE_DURATION = 1.3;
const START_Y = -0.55;
const START_ROTATION_Y = -0.55;
const START_SCALE = 0.88;

const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

const Macbook = () => {
  const { scene } = useGLTF(MODEL_PATH);
  const { viewport, invalidate } = useThree();
  const group = useRef();
  const elapsed = useRef(
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? ENTRANCE_DURATION
      : 0
  );

  // Fit the model to the visible area regardless of canvas size.
  const scale = Math.min(
    (viewport.width * 0.95) / PROJECTED_WIDTH,
    (viewport.height * 0.8) / PROJECTED_HEIGHT
  );

  useFrame((_, delta) => {
    if (!group.current || elapsed.current >= ENTRANCE_DURATION) return;
    elapsed.current += Math.min(delta, 1 / 30);
    const t = easeOutCubic(Math.min(elapsed.current / ENTRANCE_DURATION, 1));
    group.current.position.y = (1 - t) * START_Y;
    group.current.rotation.y = (1 - t) * START_ROTATION_Y;
    group.current.scale.setScalar(START_SCALE + (1 - START_SCALE) * t);
    invalidate();
  });

  return (
    <group>
      <hemisphereLight intensity={1.4} groundColor='black' />
      <directionalLight position={[5, 8, 5]} intensity={1.8} />
      <pointLight position={[-4, 2, -4]} intensity={0.5} />
      <group ref={group}>
        <Center scale={scale}>
          <primitive object={scene} />
        </Center>
      </group>
    </group>
  );
};

const MacbookCanvas = () => {
  return (
    <Canvas
      frameloop='demand'
      dpr={[1, 2]}
      camera={{ position: [-3.5, 1.2, 5], fov: 30 }}
    >
      <Suspense fallback={<CanvasLoader />}>
        <OrbitControls
          target={[0, 0, 0]}
          enableZoom={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
        <Macbook />
      </Suspense>

      <Preload all />
    </Canvas>
  );
};

useGLTF.preload(MODEL_PATH);

export default MacbookCanvas;
