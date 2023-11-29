import React, {
  ReactElement,
  useEffect,
  useState
} from 'react';
import { Canvas } from '@react-three/fiber';
import {
  PerspectiveCamera,
  ArcballControls
} from '@react-three/drei';

import {
  InputChange,
  InputForm
} from '../src/components/input';
import Ball from '../src/components/ball';
import BallMarkings from '../src/modules/ballMarkings';
import {
  BALL_SPECS,
  BOWLER_SPECS,
  LAYOUT,
  PIN_COORDS
} from '../src/calc/constants';
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
import Annotations from '../src/modules/annotations';
import Notes from '../src/components/notes';

export default function Home(): ReactElement {
  const pinCoords = PIN_COORDS;

  const [aspectRatio, setAspectRatio] = useState(0);
  const [specs, setSpecs] = useState<BallSpecs & BowlerSpecs & Layout>({
    ...BALL_SPECS, ...BOWLER_SPECS, ...LAYOUT
  });
  const [markings, setMarkings] = useState<Markings>();

  const calcLayout = (): void => {
    // Find the location of the CG in relation to the pin
    const cgCoords = calcPoint(pinCoords, specs.pinDistance, 180);

    // Find the location of the bowler's PAP
    const papCoords = getPapCoords(
      pinCoords,
      cgCoords,
      specs.pinToPapDistance,
      specs.drillingAngle,
      specs.leftHanded
    );

    // Find the coordinates to draw the VAL
    const valCoords = getValCoords(
      pinCoords,
      papCoords,
      specs.valAngle,
      specs.leftHanded
    );

    // Find the coordinates to draw the midline
    // Multiply papYDistance by -1 because it is normally expressed relative to the midline,
    // not the other way around
    const midlineCoords = getMidlineCoords(
      papCoords,
      valCoords,
      specs.papYDistance * -1
    );

    // Find the location of the grip center
    const gripCenterCoords = getGripCenterCoords(
      papCoords,
      valCoords,
      midlineCoords,
      specs.papXDistance,
      specs.leftHanded
    );

    setMarkings({
      asymm: specs.asymm,
      pinCoords,
      cgCoords,
      papCoords,
      valCoords,
      midlineCoords,
      gripCenterCoords
    });
  };

  const handleChange = (input: InputChange): void => {
    const {
      name,
      value,
      type,
      checked
    } = input;

    if (type === 'checkbox') {
      setSpecs({ ...specs, [name]: checked });
    } else if (name === 'leftHanded' || name === 'thumbHole' || name === 'asymm') {
      setSpecs({ ...specs, [name]: (value === 'true') });
    } else if (value && !Number.isNaN(value)) {
      setSpecs({ ...specs, [name]: parseFloat(value) });
    } else if (type !== 'number') {
      setSpecs({ ...specs, [name]: value });
    }
  };

  useEffect(() => {
    if (window) {
      setAspectRatio(window.innerWidth / (window.innerHeight * 0.8));
    }
  }, []);

  useEffect(() => {
    calcLayout();
  }, [specs]);

  return (
    <div className={styles.container}>
      <InputForm onChange={handleChange} values={specs} />
      <div className={styles.canvas}>
        <Canvas>
          <PerspectiveCamera
            makeDefault
            args={[50, aspectRatio, 1, 1000]}
            position={[0, 0, 11]}
          />
          <ambientLight />
          <Ball>
            {
              markings && (
                <BallMarkings {...markings} />
              )
            }
            {
              markings && (
                <LayoutMarkings {...markings} />
              )
            }
            {
              markings && (
                <Annotations {...markings} {...specs} />
              )
            }
            {
              markings && (
                <GripMarkings
                  {...specs}
                  gripCenterCoords={markings.gripCenterCoords!}
                  midlineCoords={markings.midlineCoords!}
                />
              )
            }
          </Ball>
          <ArcballControls target={[0, 0, 0]} enableZoom={false} enablePan={false} />
        </Canvas>
      </div>
      <Notes />
    </div>
  );
}
