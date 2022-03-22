/* global JSX */
import * as THREE from 'three';
import React, {
  ReactElement,
  useEffect,
  useRef
} from 'react';
import { Canvas } from '@react-three/fiber';
import {
  OrbitControls,
  PerspectiveCamera,
  Edges
} from '@react-three/drei';

import styles from '../styles/Home.module.css';

function Labels(): ReactElement {
  const elem = document.createElement('canvas');
  const canvasRef = useRef<HTMLCanvasElement>(elem);
  const textureRef = useRef<THREE.CanvasTexture>(null);

  const write = (context: CanvasRenderingContext2D): void => {
    context.font = '8px sans-serif';
    context.fillStyle = '#ff5733';
    context.fillText('PIN', 50, 60);
    context.fillText('CG', 50, 90);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext('2d')!;
      write(context);
    }
  }, [write]);

  return (
    <canvasTexture
      wrapS={THREE.RepeatWrapping}
      wrapT={THREE.RepeatWrapping}
      repeat={new THREE.Vector2(1, 1)}
      attach="map"
      ref={textureRef}
      image={canvasRef.current}
    />
  );
}

type MarkerProps = {
  color: string;
  label: string;
}

function Marker(props: JSX.IntrinsicElements['mesh'] | MarkerProps): ReactElement {
  const meshRef = useRef<THREE.Mesh>(null!);

  const { color } = props as MarkerProps;

  return (
    <mesh
      {...props}
      ref={meshRef}
      scale={1}
    >
      <circleGeometry args={[0.0625, 16]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

function Ball(props: JSX.IntrinsicElements['mesh']): ReactElement {
  const meshRef = useRef<THREE.Mesh>(null!);
  const sphereRef = useRef<THREE.SphereGeometry>(null!);

  // useEffect(() => {
  //   const sphere = sphereRef.current;

  //   const coords = sphere.attributes.position.array;

  //   for (let i = 0; i < coords.length; i += 3) {
  //     console.log(`(${coords[i]}, ${coords[i + 1]}, ${coords[i + 2]})`);
  //   }
  // }, [sphereRef]);

  return (
    <mesh
      {...props}
      ref={meshRef}
      scale={1}
    >
      <sphereGeometry args={[4.25, 256, 128]} ref={sphereRef} />
      {/* <Edges scale={1} threshold={0} color="gray" /> */}
      <meshStandardMaterial />
    </mesh>
  );
}

export default function Home(): ReactElement {
  return (
    <div className={styles.container}>
      <Canvas>
        <PerspectiveCamera makeDefault args={[50, 1920 / 900, 1, 1000]} position={[0, 0, 10]} />
        <ambientLight />
        <Marker label="PIN" color="red" position={[0, 0, 4.25]} />
        <Marker label="CG" color="green" position={[0, 1, 4.25]} />
        <Ball position={[0, 0, 0]} />
        <OrbitControls target={[0, 0, 0]} enableZoom={false} />
      </Canvas>
    </div>
  );
}
