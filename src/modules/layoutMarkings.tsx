/* global JSX */
import * as THREE from 'three';
import React, {
  ReactElement,
  useEffect,
  useState
} from 'react';
import { calcBearing, calcPoint } from '../calc/geod';
import { DotMark, LineMark } from '../components/markings';

type BaseLineProps = {
  pinCoords: THREE.Vector3;
  cgCoords: THREE.Vector3;
}

function BaseLine({ pinCoords, cgCoords }: BaseLineProps): ReactElement {
  return <LineMark pointStart={pinCoords} pointEnd={cgCoords} color="orange" />;
}

type BaseToVaLineProps = {
  pinCoords: THREE.Vector3;
  cgCoords: THREE.Vector3;
  pinToPapDistance?: number;
  drillingAngle?: number;
  leftHanded?: boolean;
}

function BaseToVaLine({
  pinCoords,
  cgCoords,
  pinToPapDistance,
  drillingAngle,
  leftHanded
}: BaseToVaLineProps): ReactElement | null {
  const [papCoords, setPapCoords] = useState<THREE.Vector3 | null>(null);

  const getPapCoordinates = () => {
    const vertLineBearing = calcBearing(pinCoords, cgCoords);

    let drillingAngleBearing;

    if (leftHanded) { // Reverse angle calculation for left-handed players
      drillingAngleBearing = vertLineBearing + drillingAngle!;
    } else {
      drillingAngleBearing = vertLineBearing - drillingAngle!;
    }

    const pap = calcPoint(pinCoords, pinToPapDistance!, drillingAngleBearing);
    setPapCoords(pap);
  };

  useEffect(() => {
    getPapCoordinates();
  }, []);

  if (papCoords) {
    return (
      <>
        <DotMark position={papCoords} text="PAP" color="navy" />
        <LineMark pointStart={pinCoords} pointEnd={papCoords} color="darkslateblue" />
      </>
    );
  }
  return null;
}

BaseToVaLine.defaultProps = {
  pinToPapDistance: 4,
  drillingAngle: 45,
  leftHanded: false
};

// function Valine() { // Vertical axis line

// }

// function Midline() {

// }

// function GripCenterLine() {

// }

export default function LineMarkings(
  props: BaseLineProps | BaseToVaLineProps
): ReactElement {
  return (
    <>
      <BaseLine {...props as BaseLineProps} />
      <BaseToVaLine {...props as BaseToVaLineProps} />
    </>
  );
}
