/* global JSX */
import * as THREE from 'three';
import React, {
  ReactElement,
  useEffect,
  useRef,
  useState
} from 'react';
import { extend } from '@react-three/fiber';

import { calcPoint } from '../calc/geod';
import { PIN_COORDS } from '../calc/constants';
import LineMarkings from './layoutMarkings';

const { Text } = require('troika-three-text');

extend({ Text });

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
    const offsetCoords = calcPoint(...position.toArray(), 0.15, 270);
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
      <text color={color} fontSize={0.25} text={text} anchorX="right" anchorY="middle">
        <meshBasicMaterial side={THREE.BackSide} />
      </text>
    </mesh>
  );
}

type BallMarkingsProps = {
  pinDistance?: number;
}

export default function BallMarkings({ pinDistance }: BallMarkingsProps): ReactElement {
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
            <LineMarkings pinCoords={pinCoords} cgCoords={cgCoords} />
          </>
        )
      }
    </>
  );
}

BallMarkings.defaultProps = {
  pinDistance: 2.5
};
