/* global JSX */
import * as THREE from 'three';
import React, {
  ReactElement,
  useEffect,
  useRef,
  useState
} from 'react';
import { Canvas } from '@react-three/fiber';
import {
  PerspectiveCamera,
  Edges,
  ArcballControls
} from '@react-three/drei';

import styles from '../styles/Home.module.css';
import { calcPoint } from '../src/calc/geod';

function Ball(props: JSX.IntrinsicElements['mesh']): ReactElement {
  const sphereRef = useRef<THREE.SphereGeometry>(null!);

  return (
    <mesh
      {...props}
      scale={1}
    >
      <sphereGeometry args={[4.25, 256, 128]} ref={sphereRef} />
      {/* <Edges scale={1} threshold={0} color="gray" /> */}
      <meshStandardMaterial transparent opacity={0.25} />
    </mesh>
  );
}

type LabelProps = {
  text: string;
}

function Label({ text }: LabelProps): ReactElement {
  const elem = document.createElement('canvas');
  const canvasRef = useRef<HTMLCanvasElement>(elem);
  const textureRef = useRef<THREE.CanvasTexture>(null);

  const write = (context: CanvasRenderingContext2D): void => {
    context.font = '32px sans-serif';
    context.fillStyle = '#ff5733';
    context.fillText(text, 0, 0);
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
}

function Marker(props: JSX.IntrinsicElements['mesh'] | MarkerProps): ReactElement {
  const meshRef = useRef<THREE.Mesh>(null!);

  const { color } = props as MarkerProps;

  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.lookAt(0, 0, 0);
    }
  }, [meshRef.current]);

  return (
    <mesh
      {...props}
      ref={meshRef}
      scale={1}
    >
      <circleGeometry args={[0.0625, 16]} />
      <meshStandardMaterial color={color} side={THREE.BackSide} />
    </mesh>
  );
}

function MarkingLabel(props: JSX.IntrinsicElements['mesh'] | LabelProps): ReactElement {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [coords, setCoords] = useState<THREE.Vector3>(new THREE.Vector3(0, 0, 0));

  const { text } = props as LabelProps;
  const { position } = props as { position: THREE.Vector3 };

  const getOffsetCoords = (): void => {
    const offsetCoords = calcPoint(...position.toArray(), 0.25, 270);
    setCoords(new THREE.Vector3(...offsetCoords));
  };

  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.lookAt(0, 0, 0);
    }
    getOffsetCoords();
  }, [position, meshRef.current]);

  return (
    <mesh position={coords} scale={1} ref={meshRef}>
      <planeGeometry args={[0.5, 0.25]} />
      <meshBasicMaterial side={THREE.BackSide}>
        <Label text={text} />
      </meshBasicMaterial>
    </mesh>
  );
}

type BallMarkingsProps = {
  pinDistance?: number;
}

const PIN_COORDS = [0, 0, 4.25];

function BallMarkings({ pinDistance }: BallMarkingsProps): ReactElement {
  const [cgCoords, setCgCoords] = useState<THREE.Vector3 | null>(null);
  const pinCoords = new THREE.Vector3(...PIN_COORDS);

  const getCgCoords = (): void => {
    const coords = calcPoint(...pinCoords.toArray(), pinDistance as number, 270);
    setCgCoords(new THREE.Vector3(...coords));
  };

  useEffect(() => {
    getCgCoords();
  }, []);

  return (
    <>
      <Marker key="PIN" color="red" position={pinCoords} />
      <MarkingLabel text="PIN" position={pinCoords} />
      {
        cgCoords && (
          <>
            <Marker key="CG" color="green" position={cgCoords} />
            <MarkingLabel text="CG" position={cgCoords} />
          </>
        )
      }
    </>
  );
}

BallMarkings.defaultProps = {
  pinDistance: 2.5
};

export default function Home(): ReactElement {
  const [aspectRatio, setAspectRatio] = useState(0);

  useEffect(() => {
    if (window) {
      setAspectRatio(window.innerWidth / (window.innerHeight * 0.8));
    }
  }, []);

  return (
    <div className={styles.container}>
      <Canvas>
        <PerspectiveCamera makeDefault args={[50, aspectRatio, 1, 1000]} position={[0, 0, 12]} />
        <ambientLight />
        <BallMarkings />
        <Ball position={[0, 0, 0]} />
        <ArcballControls target={[0, 0, 0]} enableZoom={false} enablePan={false} />
      </Canvas>
    </div>
  );
}
