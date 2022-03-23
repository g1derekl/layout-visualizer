/* global JSX */
import * as THREE from 'three';
import React, {
  ReactElement,
  useRef,
} from 'react';
import {
  Edges,
} from '@react-three/drei';

const SHOW_EDGES = false;

export default function Ball(props: JSX.IntrinsicElements['mesh']): ReactElement {
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
