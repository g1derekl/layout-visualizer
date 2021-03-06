/* global JSX */
import * as THREE from 'three';
import React, {
  ReactElement,
  useEffect,
  useRef,
  useState
} from 'react';
import { extend } from '@react-three/fiber';
import { Line } from '@react-three/drei';

import { calcPoint } from '../calc/geod';

const { Text } = require('troika-three-text');

extend({ Text });

type MarkerProps = {
  text?: string;
  color?: string;
  radius?: number;
}

function MarkingLabel(props: JSX.IntrinsicElements['mesh'] | MarkerProps): ReactElement | null {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [coords, setCoords] = useState<THREE.Vector3>(new THREE.Vector3(0, 0, 0));

  const { text, color } = props as MarkerProps;
  const { position } = props as { position: THREE.Vector3 };

  const getOffsetCoords = (): void => {
    const offsetCoords = calcPoint(position, 0.25, 270);
    setCoords(offsetCoords);
  };

  useEffect(() => {
    if (meshRef.current) {
      const mesh = meshRef.current;
      const lookDirection = new THREE.Vector3();
      const target = new THREE.Vector3();

      lookDirection.subVectors(mesh.position, new THREE.Vector3(0, 0, 0)).normalize();
      target.copy(mesh.position).add(lookDirection);

      mesh.lookAt(target);
    }
    getOffsetCoords();
  }, [position, meshRef.current]);

  return (
    <mesh
      {...props}
      ref={meshRef}
      position={coords}
      scale={[1, 1, 1]}
    >
      { /* @ts-ignore */ }
      <text color={color} fontSize={0.25} text={text} anchorX="right" anchorY="middle">
        <meshBasicMaterial side={THREE.FrontSide} />
      </text>
    </mesh>
  );
}

MarkingLabel.defaultProps = {
  text: '',
  color: 'darkgray'
};

export function DotMark(props: JSX.IntrinsicElements['mesh'] | MarkerProps): ReactElement {
  const meshRef = useRef<THREE.Mesh>(null!);

  const { color, text, radius } = props as MarkerProps;
  const { position } = props as JSX.IntrinsicElements['mesh'];

  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.lookAt(0, 0, 0);
    }
  }, [meshRef.current]);

  return (
    <>
      <mesh
        {...props}
        ref={meshRef}
        scale={1}
      >
        <circleGeometry args={[radius, 16]} />
        <meshStandardMaterial color={color} side={THREE.BackSide} />
      </mesh>
      <MarkingLabel text={text} color={color} position={position} />
    </>
  );
}

DotMark.defaultProps = {
  text: '',
  color: 'darkgray',
  radius: 0.0625
};

// Adapted from https://stackoverflow.com/a/42721392/1573031
function setArc3D(
  pointStart: THREE.Vector3,
  pointEnd: THREE.Vector3,
  clockWise: boolean,
  smoothness = 256,
): THREE.Vector3[] {
  // calculate normal
  const cb = new THREE.Vector3();
  const ab = new THREE.Vector3();
  const normal = new THREE.Vector3();

  cb.subVectors(new THREE.Vector3(), pointEnd);
  ab.subVectors(pointStart, pointEnd);
  cb.cross(ab);
  normal.copy(cb).normalize();

  // get angle between vectors
  let angle = pointStart.angleTo(pointEnd);
  if (clockWise) {
    angle -= Math.PI * 2;
  }

  const numPoints = smoothness * (Math.abs(angle) / (Math.PI * 2));
  const angleDelta = angle / (numPoints - 1);

  const pts = [];
  for (let i = 0; i < numPoints; i++) {
    pts.push(pointStart.clone().applyAxisAngle(normal, angleDelta * i));
  }

  return pts;
}

type CircumferenceLineProps = {
  pointStart: THREE.Vector3;
  pointEnd: THREE.Vector3;
  color: string;
  direction?: string
}

export function LineMark({
  pointEnd,
  pointStart,
  color,
  direction
}: CircumferenceLineProps): ReactElement {
  const clockwisePoints = setArc3D(pointStart, pointEnd, true);
  const counterclockwisePoints = setArc3D(pointStart, pointEnd, false);

  return (
    <>
      {
        (direction === 'clockwise' || direction === 'both')
          && <Line points={clockwisePoints} color={color} />
      }
      {
        (direction === 'counterclockwise' || direction === 'both')
          && <Line points={counterclockwisePoints} color={color} />
      }
    </>
  );
}

LineMark.defaultProps = {
  direction: 'both'
};
