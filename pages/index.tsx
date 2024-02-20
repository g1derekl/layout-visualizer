import React, {
  ReactElement,
  useEffect,
  useLayoutEffect,
  useRef,
  useState
} from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  PerspectiveCamera,
  ArcballControls,
  Line,
  OrthographicCamera
} from '@react-three/drei';
import {
  Group,
  Matrix4,
  Quaternion,
  Vector3
} from 'three';

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
import { degreesToRadians } from '../src/calc/trig';

const AXIS_TILT = 0;
const AXIS_ROTATION = 0;
const REV_RATE = 60;
const ANIMATE = false;

type ContentProps = {
  markings: Markings;
  specs: BallSpecs & BowlerSpecs & Layout;
}

function CanvasContent({
  markings,
  specs
}: ContentProps): ReactElement {
  const group = useRef<Group>(null);

  const [aspectRatio, setAspectRatio] = useState(0);

  const foo = 'bar';

  useEffect(() => {
    const { papCoords } = markings;
    // const cameraPoint = new Vector3(0, 0, 1);
    const cameraPoint = group.current!.getWorldDirection(new Vector3(0, 0, 0))
      .multiply(new Vector3(-1, -1, 1));
    const normalizedCoords = papCoords.clone().normalize();
    const q = new Quaternion();
    console.log(normalizedCoords, cameraPoint, '============');
    q.setFromUnitVectors(normalizedCoords, cameraPoint);
    group.current!.applyMatrix4(new Matrix4().makeRotationFromQuaternion(q));
    // group.current!.rotateOnWorldAxis(
    //   new Vector3(0, 1, 0),
    //   (Math.PI / 2) - degreesToRadians(AXIS_ROTATION)
    // );
    // group.current!.rotateOnWorldAxis(new Vector3(1, 0, 0), degreesToRadians(-1 * AXIS_TILT));
  }, [AXIS_TILT, AXIS_ROTATION]);

  // useFrame((state, delta) => {
  //   if (ANIMATE) {
  //     // Rotate ball around PAP
  //     const rpm = -1 * ((2 * Math.PI) * (delta / 60));
  //     group.current!.rotateOnAxis(markings.papCoords.normalize(), rpm * REV_RATE);
  //   }
  // });

  useThree((state) => {
    if (aspectRatio !== state.size.width / state.size.height) {
      setAspectRatio(state.size.width / state.size.height);
    }
  });

  return (
    <>
      <ArcballControls target={[0, 0, 0]} enableZoom={false} enablePan={false} />
      <group ref={group}>
        <Ball>
          <Line
            points={[markings.papCoords.clone().negate(), markings.papCoords]}
            segments={false}
          />
          {
            markings && (
              <>
                <BallMarkings {...markings} />
                <LayoutMarkings {...markings} />
                <Annotations {...markings} {...specs} />
                <GripMarkings
                  {...specs}
                  gripCenterCoords={markings.gripCenterCoords!}
                  midlineCoords={markings.midlineCoords!}
                />
              </>
            )
          }
          {/* {
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
          } */}
        </Ball>
      </group>
      {/* <OrthographicCamera
        makeDefault
        left={(frustumSize * aspectRatio) / -2}
        right={(frustumSize * aspectRatio) / 2}
        top={frustumSize / 2}
        bottom={frustumSize / -2}
        // near={0.1}
        // far={100}
        position={[0, 0, 5]}
      /> */}
    </>
  );
}

export default function Home(): ReactElement {
  const pinCoords = PIN_COORDS;

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
    calcLayout();
  }, [specs]);

  return (
    <div className={styles.container}>
      <InputForm onChange={handleChange} values={specs} />
      <div className={styles.canvas}>
        <Canvas orthographic camera={{ zoom: 60 }}>
          <ambientLight />
          <CanvasContent markings={markings!} specs={specs} />
        </Canvas>
      </div>
      <Notes />
    </div>
  );
}
