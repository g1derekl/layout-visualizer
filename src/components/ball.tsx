import React, {
  ReactElement,
} from 'react';
import {
  Edges, Sphere
} from '@react-three/drei';
import { MeshProps } from '@react-three/fiber';

import { BALL_COORDS } from '../calc/constants';

const SHOW_EDGES = false;

export default function Ball({
  ...props
}: MeshProps): ReactElement {
  const ballCoords = BALL_COORDS;

  return (
    <Sphere {...props} args={ballCoords.toArray()} scale={1}>
      { SHOW_EDGES && <Edges scale={1} threshold={0} color="gray" /> }
      <meshBasicMaterial opacity={1} color="white" />
      {props.children}
    </Sphere>
  );
}
