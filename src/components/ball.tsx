import * as THREE from 'three';
import React, {
  ReactElement,
  useRef,
} from 'react';
import {
  Edges
} from '@react-three/drei';
import { MeshProps } from '@react-three/fiber';

import { BALL_COORDS } from '../calc/constants';

const SHOW_EDGES = false;

interface BallProps extends MeshProps {
  markings: ReactElement
}

export default function Ball({
  markings,
  ...props
}: BallProps): ReactElement {
  const sphereRef = useRef<THREE.SphereGeometry>(null!);

  const ballCoords = BALL_COORDS;

  return (
    <mesh
      {...props}
      scale={1}
    >
      <sphereGeometry args={ballCoords.toArray()} ref={sphereRef} />
      {
        SHOW_EDGES && <Edges scale={1} threshold={0} color="gray" />
      }
      <meshStandardMaterial opacity={1}>
        {markings}
      </meshStandardMaterial>
    </mesh>
  );
}
