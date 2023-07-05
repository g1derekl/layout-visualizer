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
import { Vector3 } from 'three';

import Ball from '../src/components/ball';
import BallMarkings from '../src/modules/ballMarkings';
import { PIN_COORDS } from '../src/calc/constants';
import LayoutMarkings from '../src/modules/layoutMarkings';
import GripMarkings from '../src/modules/gripMarkings';
import { calcPoint } from '../src/calc/geod';
import {
  getGripCenterCoords,
  getMidlineCoords,
  getPapCoords,
  getValCoords
} from '../src/calc/layout';
import {
  BallSpecs,
  BowlerSpecs,
  Layout,
  Markings
} from '../src/data/types';

import styles from '../styles/Home.module.css';

const { Text } = require('troika-three-text');

extend({ Text });

const bowlerSpecs: BowlerSpecs = {
  papXDistance: 5.25,
  papYDistance: 0.5,
  leftSpan: 3.5,
  rightSpan: 3.5,
  bridge: 0.25,
  leftHanded: false,
  thumbHole: true
};

const ballSpecs: BallSpecs = {
  pinDistance: 2.5
};

const layout: Layout = {
  drillingAngle: 45,
  pinToPapDistance: 4.5,
  valAngle: 45
};

export default function Home(): ReactElement {
  const [aspectRatio, setAspectRatio] = useState(0);
  const [markings, setMarkings] = useState<Markings>();

  const calcLayout = (): void => {
    const pinCoords = PIN_COORDS;

    setMarkings({
      ...markings,
      pinCoords
    });

    // Find the location of the CG in relation to the pin
    const cgCoords = calcPoint(pinCoords, ballSpecs.pinDistance, 180);
    // Find the location of the bowler's PAP
    const papCoords = getPapCoords(
      pinCoords,
      cgCoords!,
      layout.pinToPapDistance,
      layout.drillingAngle,
      bowlerSpecs.leftHanded
    );

    // Find the coordinates to draw the VAL
    const valCoords = getValCoords(
      pinCoords,
      papCoords!,
      layout.valAngle,
      bowlerSpecs.leftHanded
    );

    // Find the coordinates to draw the midline
    // Multiply papYDistance by -1 because it is normally expressed relative to the midline,
    // not the other way around
    const midlineCoords = getMidlineCoords(
      papCoords!,
      valCoords!,
      bowlerSpecs.papYDistance * -1
    );

    // Find the location of the grip center
    const gripCenterCoords = getGripCenterCoords(
      papCoords!,
      valCoords!,
      midlineCoords!,
      bowlerSpecs.papXDistance,
      bowlerSpecs.leftHanded
    );

    setMarkings({
      pinCoords,
      cgCoords,
      papCoords,
      valCoords,
      midlineCoords,
      gripCenterCoords
    });
  };

  useEffect(() => {
    if (window) {
      setAspectRatio(window.innerWidth / (window.innerHeight * 0.8));
    }
    calcLayout();
  }, []);

  return (
    <div className={styles.container}>
      <Canvas>
        <PerspectiveCamera makeDefault args={[50, aspectRatio, 1, 1000]} position={[0, 0, 11]} />
        <ambientLight />
        <Ball position={[0, 0, 0]}>
          {
            markings && markings.pinCoords && markings.cgCoords && (
              <BallMarkings
                pinCoords={markings.pinCoords}
                cgCoords={markings.cgCoords}
              />
            )
          }
          {
            markings && markings.papCoords && markings.valCoords && markings.gripCenterCoords && (
              <LayoutMarkings {...markings} />
            )
          }
          {
            markings && (
              <GripMarkings
                gripCenterCoords={markings.gripCenterCoords!}
                midlineCoords={markings.midlineCoords!}
                leftSpan={bowlerSpecs.leftSpan}
                rightSpan={bowlerSpecs.rightSpan}
              />
            )
          }
        </Ball>
        <ArcballControls target={[0, 0, 0]} enableZoom={false} enablePan={false} />
      </Canvas>
    </div>
  );
}
