import { Vector3 } from 'three';
import React, {
  ReactElement,
  useEffect,
  useState
} from 'react';
import { DotMark, LineMark } from '../components/markings';
import {
  getGripCenterCoords,
  getMidlineCoords,
  getPapCoords,
  getValCoords
} from '../calc/layout';

type BaseLineProps = {
  pinCoords: Vector3;
  cgCoords: Vector3;
}

function BaseLine({ pinCoords, cgCoords }: BaseLineProps): ReactElement {
  return <LineMark pointStart={pinCoords} pointEnd={cgCoords} color="orangered" />;
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
    const pap = getPapCoords(
      pinCoords,
      cgCoords,
      pinToPapDistance!,
      drillingAngle!,
      leftHanded!
    );
    setPapCoords(pap);
    setResult(pap);
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
  valAngle?: number;
  leftHanded?: boolean;
  setResult: Function
}

function VaLine({
  pinCoords,
  papCoords,
  valAngle,
  leftHanded,
  setResult
}: VaLineProps): ReactElement | null { // Vertical axis line
  const [midlineIntCoords, setMidlineIntCoords] = useState<Vector3 | null>(null);

  useEffect(() => {
    const val = getValCoords(
      pinCoords,
      papCoords,
      valAngle!,
      leftHanded!
    );
    setMidlineIntCoords(val);
    setResult(val);
  }, []);

  if (midlineIntCoords) {
    return <LineMark pointStart={papCoords} pointEnd={midlineIntCoords} color="magenta" />;
  }
  return null;
}

VaLine.defaultProps = {
  valAngle: 45,
  leftHanded: false
};

type MidlineProps = {
  papCoords: Vector3;
  valCoords: Vector3;
  papXDistance?: number;
  papYDistance?: number;
  leftHanded?: boolean;
  setResult: Function;
}

function Midline({
  papCoords,
  valCoords,
  papXDistance,
  papYDistance,
  leftHanded,
  setResult
}: MidlineProps): ReactElement | null {
  const [midlineCoords, setMidlineCoords] = useState<Vector3 | null>(null);
  const [gripCenterCoords, setGripCenterCoords] = useState<Vector3 | null>(null);

  useEffect(() => {
    const midline = getMidlineCoords(papCoords, valCoords, papYDistance!);
    setMidlineCoords(midline);

    const gripCenter = getGripCenterCoords(
      papCoords,
      valCoords,
      midline,
      papXDistance!,
      leftHanded!
    );
    setGripCenterCoords(gripCenter);
    setResult(gripCenter);
  }, []);

  if (midlineCoords && gripCenterCoords) {
    return (
      <>
        <DotMark position={gripCenterCoords} text="CENTER" color="brown" />
        <LineMark pointStart={midlineCoords} pointEnd={gripCenterCoords} color="sandybrown" />
      </>
    );
  }
  return null;
}

Midline.defaultProps = {
  papXDistance: 5.25,
  papYDistance: 0.25,
  leftHanded: false
};

// function GripCenterLine() {

// }

export default function LineMarkings(
  props: BaseLineProps | BaseToVaLineProps | VaLineProps | MidlineProps
): ReactElement {
  const [papCoords, setPapCoords] = useState<Vector3 | null>(null);
  const [valCoords, setValCoords] = useState<Vector3 | null>(null);
  const [gripCenterCoords, setGripCenterCoords] = useState<Vector3 | null>(null);

  return (
    <>
      <BaseLine {...props as BaseLineProps} />
      <BaseToVaLine {...props as BaseToVaLineProps} setResult={setPapCoords} />
      {
        papCoords && (
          <VaLine
            {...props as VaLineProps}
            papCoords={papCoords}
            setResult={setValCoords}
          />
        )
      }
      {
        papCoords && valCoords && (
          <Midline
            {...props as MidlineProps}
            papCoords={papCoords}
            valCoords={valCoords}
            setResult={setGripCenterCoords}
          />
        )

      }
    </>
  );
}