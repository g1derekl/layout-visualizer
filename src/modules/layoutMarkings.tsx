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
  pinToPapDistance: 4 + 1 / 2,
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
  midlineCoords: Vector3;
  setMidlineCoords: Function;
}

function Midline({
  papCoords,
  valCoords,
  papXDistance, // Distance "over" the midline from grip center
  papYDistance, // Vertical offset from midline
  leftHanded,
  setResult,
  midlineCoords,
  setMidlineCoords
}: MidlineProps): ReactElement | null {
  const [gripCenterCoords, setGripCenterCoords] = useState<Vector3 | null>(null);

  useEffect(() => {
    // Multiply papYDistance by -1 because it is normally expressed relative to the midline,
    // not the other way around
    const midline = getMidlineCoords(papCoords, valCoords, papYDistance! * -1);
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
      <LineMark pointStart={midlineCoords} pointEnd={gripCenterCoords} color="sandybrown" />
    );
  }
  return null;
}

Midline.defaultProps = {
  papXDistance: 5.25,
  papYDistance: 0.5,
  leftHanded: false
};

type LayoutMarkingsProps = {
  gripCenterCoords: Vector3;
  setGripCenterCoords: Function;
}

export default function LayoutMarkings(
  props: LayoutMarkingsProps | BaseLineProps | BaseToVaLineProps | VaLineProps | MidlineProps
): ReactElement {
  const [papCoords, setPapCoords] = useState<Vector3 | null>(null);
  const [valCoords, setValCoords] = useState<Vector3 | null>(null);

  const { setGripCenterCoords } = props as LayoutMarkingsProps;

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
