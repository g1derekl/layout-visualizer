import * as THREE from 'three';
import React, { useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Edges } from '@react-three/drei';

import styles from '../styles/Home.module.css'

function Ball(props: JSX.IntrinsicElements['mesh']) {
  const ref = useRef<THREE.Mesh>(null!)
  const [hovered, hover] = useState(false)
  const [clicked, click] = useState(false)
  return (
    <mesh
      {...props}
      ref={ref}
      scale={1}>
      <sphereGeometry args={[4.25, 128, 128]} />
      <Edges scale={1} threshold={0} color="gray" />
      <meshBasicMaterial color="white" />
    </mesh>
  )
}

export default function Home() {
  return (
    <div className={styles.container}>
      <Canvas>
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <Ball position={[0, 0, -3]} />
      </Canvas>
    </div>
  )
}
