import { Vector3 } from 'three';
import React, {
  ReactElement
} from 'react';
import { DotMark, LineMark } from '../components/markings';
import { Markings } from '../data/types';

type BaseToVaLineProps = {
  pinCoords: Vector3,
  papCoords: Vector3
}

function BaseToVaLine({
  pinCoords,
  papCoords
}: BaseToVaLineProps): ReactElement | null {
  return (
    <>
      <DotMark position={papCoords} text="PAP" color="navy" />
      <LineMark pointStart={pinCoords} pointEnd={papCoords} color="darkslateblue" />
    </>
  );
}

export default function LayoutMarkings({
  pinCoords,
  cgCoords,
  papCoords,
  valCoords,
  gripCenterCoords,
  midlineCoords
}: Markings): ReactElement {
  return (
    <>
      {/* Baseline (pin to CG) */}
      <LineMark pointStart={pinCoords} pointEnd={cgCoords!} color="orangered" />
      {/* Line from pin to PAP */}
      <BaseToVaLine pinCoords={pinCoords} papCoords={papCoords!} />
      {/* VAL line */}
      <LineMark pointStart={papCoords!} pointEnd={valCoords!} color="magenta" />
      {/* Midline */}
      <LineMark pointStart={midlineCoords!} pointEnd={gripCenterCoords!} color="sandybrown" />
    </>
  );
}
