/* global JSX */
import * as THREE from 'three';
import React, {
  ReactElement,
  useRef,
} from 'react';
import {
  Edges,
} from '@react-three/drei';

import { BALL_COORDS } from '../calc/constants';

const SHOW_EDGES = false;

export default function Ball(props: JSX.IntrinsicElements['mesh']): ReactElement {
  const sphereRef = useRef<THREE.SphereGeometry>(null!);

  const ballCoords = BALL_COORDS;

  return (
    <mesh
      {...props}
      scale={1}
    >
      <sphereGeometry args={ballCoords} ref={sphereRef} />
      {
        SHOW_EDGES && <Edges scale={1} threshold={0} color="gray" />
      }
      <meshStandardMaterial transparent color="lightgray" opacity={1} />
    </mesh>
  );
}
