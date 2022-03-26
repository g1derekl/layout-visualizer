import { Vector3 } from 'three';
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
import LayoutMarkings from '../src/modules/layoutMarkings';
import { PIN_COORDS } from '../src/calc/constants';
import GripMarkings from '../src/modules/gripMarkings';

const { Text } = require('troika-three-text');

extend({ Text });

export default function Home(): ReactElement {
  const [aspectRatio, setAspectRatio] = useState(0);
  const [cgCoords, setCgCoords] = useState<Vector3 | undefined>();
  const [gripCenterCoords, setGripCenterCoords] = useState<Vector3 | undefined>();
  const [midlineCoords, setMidlineCoords] = useState<Vector3 | undefined>();

  const pinCoords = PIN_COORDS;
  const leftSpan = 4 + 1 / 2;
  const rightSpan = 4 + 1 / 4;

  useEffect(() => {
    if (window) {
      setAspectRatio(window.innerWidth / (window.innerHeight * 0.8));
    }
  }, []);

  return (
    <div className={styles.container}>
      <Canvas>
        <PerspectiveCamera makeDefault args={[50, aspectRatio, 1, 1000]} position={[0, 0, 11]} />
        <ambientLight />
        <Ball position={[0, 0, 0]} />
        <BallMarkings
          pinDistance={2.5}
          pinCoords={pinCoords}
          cgCoords={cgCoords}
          setCgCoords={setCgCoords}
        />
        {
            cgCoords && (
              <LayoutMarkings
                pinCoords={pinCoords}
                cgCoords={cgCoords}
                gripCenterCoords={gripCenterCoords}
                setGripCenterCoords={setGripCenterCoords}
                midlineCoords={midlineCoords}
                setMidlineCoords={setMidlineCoords}
              />
            )
        }
        {
          gripCenterCoords && midlineCoords
            && (
              <GripMarkings
                gripCenterCoords={gripCenterCoords}
                midlineCoords={midlineCoords}
                leftSpan={leftSpan}
                rightSpan={rightSpan}
              />
            )
        }
        <ArcballControls target={[0, 0, 0]} enableZoom={false} enablePan={false} />
      </Canvas>
    </div>
  );
}
