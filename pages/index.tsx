import React, {
  MutableRefObject,
  ReactElement,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  ArcballControls
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
  BOWLER_STATS,
  LAYOUT,
  PIN_COORDS,
  ViewMode
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
  BowlerStats,
  Layout,
  Markings
} from '../src/data/types';

import styles from '../styles/Home.module.css';
import Annotations from '../src/modules/annotations';
import Notes from '../src/components/notes';
import { degreesToRadians } from '../src/calc/trig';
import StatsSlider from '../src/components/controls';

type ContentProps = {
  markings: Markings;
  specs: BallSpecs & BowlerSpecs & Layout;
  stats: MutableRefObject<BowlerStats>;
}

export const GroupContext = createContext(new Group());
export const ViewContext = createContext(ViewMode.LAYOUT);

function CanvasContent({
  markings,
  specs,
  stats
}: ContentProps): ReactElement {
  const group = useRef(new Group());
  const viewMode = useContext(ViewContext);

  const { papCoords } = markings;

  const focusPap = () => {
    const cameraPoint = group.current!.getWorldDirection(new Vector3(0, 0, 0))
      .multiply(new Vector3(-1, -1, 1));
    const normalizedCoords = papCoords.clone().normalize();
    const q = new Quaternion();
    q.setFromUnitVectors(normalizedCoords, cameraPoint);
    group.current!.applyMatrix4(new Matrix4().makeRotationFromQuaternion(q));
  };

  const positionPap = (statsPrev?: BowlerStats) => {
    const {
      axisRotation,
      axisTilt
    } = stats.current;

    let deltas: {
      axisTilt: number;
      axisRotation: number;
    };

    if (!statsPrev) {
      deltas = {
        axisTilt,
        axisRotation: axisRotation - 90
      };
    } else {
      deltas = {
        axisTilt: axisTilt - statsPrev.axisTilt,
        axisRotation: axisRotation - statsPrev.axisRotation
      };
    }

    group.current!.rotateOnWorldAxis(
      new Vector3(0, 1, 0),
      degreesToRadians(deltas.axisRotation)
    );
    const vertAxis = new Vector3(1, 0, 0).applyAxisAngle(
      new Vector3(0, 1, 0),
      degreesToRadians(-1 * (90 - axisRotation))
    );
    group.current!.rotateOnWorldAxis(vertAxis, degreesToRadians(-1 * deltas.axisTilt));
  };

  let statsPrev = { ...stats.current };

  useFrame((state, delta) => {
    const { clock } = state;
    const {
      axisRotation,
      axisTilt,
      revRate
    } = stats.current;

    if (
      (axisRotation !== statsPrev.axisRotation
      || axisTilt !== statsPrev.axisTilt)
      && clock.getElapsedTime() > 1
    ) {
      positionPap(statsPrev);
      statsPrev = { ...stats.current };
    }

    if (viewMode === ViewMode.ROTATION && clock.getElapsedTime() > 1) {
      // Rotate ball around PAP
      const rpm = -1 * ((2 * Math.PI) * (delta / 60));
      group.current!.rotateOnAxis(papCoords.clone().normalize(), rpm * revRate * -1);
    }
  });

  return (
    <>
      <ArcballControls target={[0, 0, 0]} enableZoom={false} enablePan={false} />
      <group ref={group}>
        <GroupContext.Provider value={group.current}>
          <Ball>
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
          </Ball>
        </GroupContext.Provider>
      </group>
    </>
  );
}

export default function Home(): ReactElement {
  const pinCoords = PIN_COORDS;

  const statsRef = useRef(BOWLER_STATS);
  // const updateStatsRef = useRef(() => null);
  const [specs, setSpecs] = useState<BallSpecs & BowlerSpecs & Layout>({
    ...BALL_SPECS, ...BOWLER_SPECS, ...LAYOUT
  });
  const [markings, setMarkings] = useState<Markings>();
  const [viewMode, setViewMode] = useState(ViewMode.LAYOUT);

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

  const toggleAnimate = (): void => {
    if (viewMode === ViewMode.LAYOUT) {
      setViewMode(ViewMode.ROTATION);
    } else {
      setViewMode(ViewMode.LAYOUT);
    }
  };

  useEffect(() => {
    calcLayout();
  }, [specs]);

  return (
    <div className={styles.container}>
      <InputForm onChange={handleChange} values={specs} />
      <div className={styles.canvas}>
        <ViewContext.Provider value={viewMode}>
          <Canvas orthographic camera={{ zoom: 60 }}>
            <ambientLight />
            <CanvasContent
              markings={markings!}
              specs={specs}
              stats={statsRef}
            />
          </Canvas>
          <StatsSlider ref={statsRef} toggleAnimate={toggleAnimate} />
        </ViewContext.Provider>
      </div>
      <Notes />
    </div>
  );
}
