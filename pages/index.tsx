import React, {
  ReactElement,
  useEffect,
  useState
} from 'react';
import { Canvas, extend } from '@react-three/fiber';
import {
  PerspectiveCamera,
  ArcballControls
} from '@react-three/drei';

import styles from '../styles/Home.module.css';

import Ball from '../src/components/ball';
import BallMarkings from '../src/modules/ballMarkings';

const { Text } = require('troika-three-text');

extend({ Text });

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
        <Ball position={[0, 0, 0]} />
        <BallMarkings />
        <ArcballControls target={[0, 0, 0]} enableZoom={false} enablePan={false} />
      </Canvas>
    </div>
  );
}
