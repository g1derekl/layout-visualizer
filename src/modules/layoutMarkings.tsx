import { Vector3 } from 'three';
import React, {
  ReactElement
} from 'react';
import { DotMark, LineMark } from '../components/markings';
import { Markings } from '../data/types';

type BaseToVaLineMarkProps = {
  pinCoords: Vector3;
  papCoords: Vector3;
}

function BaseToVaLineMark({
  pinCoords,
  papCoords
}: BaseToVaLineMarkProps): ReactElement {
  return (
    <>
      <DotMark position={papCoords} text="PAP" color="navy" />
      <LineMark pointStart={pinCoords} pointEnd={papCoords} color="darkslateblue" direction="counterclockwise" />
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
      <LineMark pointStart={pinCoords} pointEnd={cgCoords!} color="orangered" direction="counterclockwise" />
      {/* Line from pin to PAP */}
      <BaseToVaLineMark pinCoords={pinCoords} papCoords={papCoords!} />
      {/* VAL line */}
      <LineMark pointStart={papCoords!} pointEnd={valCoords!} color="magenta" />
      {/* Midline */}
      <LineMark pointStart={midlineCoords!} pointEnd={gripCenterCoords!} color="sandybrown" />
    </>
  );
}
