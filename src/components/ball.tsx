import React, {
  ReactElement,
  useRef,
} from 'react';
import {
  Edges
} from '@react-three/drei';
import { MeshProps } from '@react-three/fiber';
import { SphereGeometry } from 'three';

import { BALL_COORDS } from '../calc/constants';

const SHOW_EDGES = false;

export default function Ball({
  ...props
}: MeshProps): ReactElement {
  const sphereRef = useRef<SphereGeometry>(null!);

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
      <meshBasicMaterial opacity={1} color="white" />
      {props.children}
    </mesh>
  );
}
