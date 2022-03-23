/* global JSX */
import * as THREE from 'three';
import React, {
  ReactElement,
  useEffect,
  useRef,
  useState
} from 'react';
import { Canvas, extend } from '@react-three/fiber';
import {
  PerspectiveCamera,
  Edges,
  ArcballControls
} from '@react-three/drei';

import styles from '../styles/Home.module.css';
import { calcPoint } from '../src/calc/geod';

const { Text } = require('troika-three-text');

extend({ Text });

const SHOW_EDGES = false;

function Ball(props: JSX.IntrinsicElements['mesh']): ReactElement {
  const sphereRef = useRef<THREE.SphereGeometry>(null!);

  return (
    <mesh
      {...props}
      scale={1}
    >
      <sphereGeometry args={[4.25, 128, 64]} ref={sphereRef} />
      {
        SHOW_EDGES && <Edges scale={1} threshold={0} color="gray" />
      }
      <meshStandardMaterial color="lightgray" />
    </mesh>
  );
}

type LabelProps = {
  text: string;
  color: string;
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

function MarkingLabel(props: JSX.IntrinsicElements['mesh'] | LabelProps): ReactElement | null {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [coords, setCoords] = useState<THREE.Vector3>(new THREE.Vector3(0, 0, 0));

  const { text, color } = props as LabelProps;
  const { position } = props as { position: THREE.Vector3 };

  const getOffsetCoords = (): void => {
    const offsetCoords = calcPoint(...position.toArray(), 0.25, 180);
    setCoords(new THREE.Vector3(...offsetCoords));
  };

  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.lookAt(0, 0, 0);
    }
    getOffsetCoords();
  }, [position, meshRef.current]);

  return (
    <mesh
      {...props}
      ref={meshRef}
      position={coords}
      scale={[-1, 1, 1]}
    >
      { /* @ts-ignore */ }
      <text color={color} fontSize={0.25} text={text} anchorX="center" anchorY="middle">
        <meshBasicMaterial side={THREE.BackSide} />
      </text>
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
    const coords = calcPoint(...pinCoords.toArray(), pinDistance as number, 180);
    setCgCoords(new THREE.Vector3(...coords));
  };

  useEffect(() => {
    getCgCoords();
  }, []);

  return (
    <>
      <Marker key="PIN" color="red" position={pinCoords} />
      <MarkingLabel text="PIN" color="red" position={pinCoords} />
      {
        cgCoords && (
          <>
            <Marker key="CG" color="green" position={cgCoords} />
            <MarkingLabel text="CG" color="green" position={cgCoords} />
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
