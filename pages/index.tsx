/* global JSX */
import * as THREE from 'three';
import React, {
  ReactElement,
  useEffect,
  useRef
} from 'react';
import { Canvas } from '@react-three/fiber';

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

function Ball(props: JSX.IntrinsicElements['mesh']): ReactElement {
  const meshRef = useRef<THREE.Mesh>(null!);
  return (
    <mesh
      {...props}
      ref={meshRef}
      scale={1}
    >
      <sphereGeometry args={[4.25, 128, 128]} />
      {/* <Edges scale={1} threshold={0} color="gray" /> */}
      <meshStandardMaterial>
        <Labels />
      </meshStandardMaterial>
    </mesh>
  );
}

export default function Home(): ReactElement {
  return (
    <div className={styles.container}>
      <Canvas>
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <Ball position={[0, 0, -3]} />
      </Canvas>
    </div>
  );
}
