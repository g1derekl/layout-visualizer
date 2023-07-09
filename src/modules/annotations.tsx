import React, { ReactElement } from 'react';
import { Vector3 } from 'three';
import { AngleMark, LineMark, MarkingLabel } from '../components/markings';
import { calcBearing, calcPoint } from '../calc/geod';

type AnnotationsProps = {
  pinCoords: Vector3;
  papCoords: Vector3;
  cgCoords: Vector3;
  valCoords: Vector3;
  drillingAngle: number;
  pinDistance: number;
  pinToPapDistance: number;
  valAngle: number;
  leftHanded: boolean;
}

export default function Annotations({
  pinCoords,
  papCoords,
  cgCoords,
  valCoords,
  drillingAngle,
  pinDistance,
  pinToPapDistance,
  valAngle,
  leftHanded
}: AnnotationsProps): ReactElement {
  const pinDistanceLabelPosition = calcPoint(
    pinCoords,
    pinDistance / 2,
    calcBearing(pinCoords, cgCoords)
  );

  const pinToPapDistanceLabelPosition = calcPoint(
    pinCoords,
    pinToPapDistance / 2,
    calcBearing(pinCoords, papCoords)
  );

  const markerStyle = {
    color: 'saddlebrown',
    background: 'whitesmoke',
    whiteSpace: 'nowrap',
    textAlign: 'center'
  };

  return (
    <>
      {/* Drilling angle */}
      <AngleMark
        center={pinCoords}
        pointA={cgCoords}
        pointB={papCoords}
        angle={drillingAngle}
        clockwise={leftHanded}
        label="Drilling angle"
      />
      {/* VAL angle */}
      {/* <AngleMark
        center={papCoords}
        pointA={pinCoords}
        pointB={valCoords}
        angle={valAngle}
        clockwise={!leftHanded}
        label="VAL angle"
      /> */}
      {/* Pin to PAP distance */}
      <MarkingLabel
        position={pinToPapDistanceLabelPosition}
        text={`PAP distance: ${pinToPapDistance}"`}
        style={markerStyle}
      />
      <MarkingLabel
        position={pinDistanceLabelPosition}
        text={`CG distance: ${pinDistance}"`}
        style={markerStyle}
      />
    </>
  );
}
