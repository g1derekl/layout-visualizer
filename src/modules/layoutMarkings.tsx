/* global JSX */
import { Vector3 } from 'three';
import React, {
  ReactElement,
  useEffect,
  useState
} from 'react';
import { calcBearing, calcPoint } from '../calc/geod';
import { DotMark, LineMark } from '../components/markings';
import { getMidlineIntCoords, getPapCoords } from '../calc/common';

type BaseLineProps = {
  pinCoords: Vector3;
  cgCoords: Vector3;
}

function BaseLine({ pinCoords, cgCoords }: BaseLineProps): ReactElement {
  return <LineMark pointStart={pinCoords} pointEnd={cgCoords} color="orange" />;
}

type BaseToVaLineProps = {
  pinCoords: Vector3;
  cgCoords: Vector3;
  pinToPapDistance?: number;
  drillingAngle?: number;
  leftHanded?: boolean;
  setResult: Function;
}

function BaseToVaLine({
  pinCoords,
  cgCoords,
  pinToPapDistance,
  drillingAngle,
  leftHanded,
  setResult
}: BaseToVaLineProps): ReactElement | null {
  const [papCoords, setPapCoords] = useState<Vector3 | null>(null);

  useEffect(() => {
    const coords = getPapCoords(
      pinCoords,
      cgCoords,
      pinToPapDistance!,
      drillingAngle!,
      leftHanded!
    );
    setPapCoords(coords);
    setResult(coords);
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

type VaLineProps = {
  pinCoords: Vector3;
  papCoords: Vector3;
  papYDistance?: number;
  valAngle?: number;
  leftHanded?: boolean;
  setResult: Function
}

function VaLine({
  pinCoords,
  papCoords,
  papYDistance,
  valAngle,
  leftHanded,
  setResult
}: VaLineProps): ReactElement | null { // Vertical axis line
  const [midlineIntCoords, setMidlineIntCoords] = useState<Vector3 | null>(null);

  useEffect(() => {
    const coords = getMidlineIntCoords(
      pinCoords,
      papCoords,
      papYDistance!,
      valAngle!,
      leftHanded!
    );
    setMidlineIntCoords(coords);
    setResult(coords);
  }, []);

  if (midlineIntCoords) {
    return <LineMark pointStart={papCoords} pointEnd={midlineIntCoords} color="magenta" />;
  }
  return null;
}

VaLine.defaultProps = {
  papYDistance: (1 / 4),
  valAngle: 45,
  leftHanded: false
};

// function Midline() {

// }

// function GripCenterLine() {

// }

export default function LineMarkings(
  props: BaseLineProps | BaseToVaLineProps | VaLineProps
): ReactElement {
  const [papCoords, setPapCoords] = useState<Vector3 | null>(null);
  const [midlineIntCoords, setMidlineIntCoords] = useState<Vector3 | null>(null);

  return (
    <>
      <BaseLine {...props as BaseLineProps} />
      <BaseToVaLine {...props as BaseToVaLineProps} setResult={setPapCoords} />
      {
        papCoords
          && (
            <VaLine
              {...props as VaLineProps}
              papCoords={papCoords}
              setResult={setMidlineIntCoords}
            />
          )
      }
    </>
  );
}
