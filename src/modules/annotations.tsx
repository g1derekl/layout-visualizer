import React, { ReactElement } from 'react';
import { Vector3 } from 'three';
import { AngleMark, MarkingLabel } from '../components/markings';
import { calcBearing, calcPoint } from '../calc/geod';

type AnnotationsProps = {
  pinCoords: Vector3;
  papCoords: Vector3;
  cgCoords: Vector3;
  valCoords: Vector3;
  gripCenterCoords: Vector3;
  midlineCoords: Vector3;
  pinDistance: number;
  pinToPapDistance: number;
  papXDistance: number;
  papYDistance: number;
  drillingAngle: number;
  valAngle: number;
  leftHanded: boolean;
}

export default function Annotations({
  pinCoords,
  papCoords,
  cgCoords,
  valCoords,
  gripCenterCoords,
  midlineCoords,
  pinDistance,
  pinToPapDistance,
  papXDistance,
  papYDistance,
  drillingAngle,
  valAngle,
  leftHanded
}: AnnotationsProps): ReactElement {
  const pinDistanceLabelPosition = calcPoint(
    calcPoint(
      pinCoords,
      pinDistance / 2,
      calcBearing(pinCoords, cgCoords)
    ),
    0.5,
    270
  );

  const pinToPapDistanceLabelPosition = calcPoint(
    calcPoint(
      pinCoords,
      pinToPapDistance / 2,
      calcBearing(pinCoords, papCoords)
    ),
    0.25,
    270
  );

  const markerStyle = {
    color: 'saddlebrown',
    background: 'whitesmoke',
    whiteSpace: 'nowrap',
    textAlign: 'center'
  };

  const papYDistanceLabel = papYDistance > 0
    ? `${papYDistance}" up`
    : `${papYDistance}" down`;

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
      <AngleMark
        center={papCoords}
        pointA={pinCoords}
        pointB={valCoords}
        angle={valAngle}
        clockwise={!leftHanded}
        label="VAL angle"
      />
      {/* Pin to PAP distance */}
      <MarkingLabel
        position={pinToPapDistanceLabelPosition}
        text={`PAP distance: ${pinToPapDistance}"`}
        style={markerStyle}
      />
      {/* PAP measurements */}
      <MarkingLabel
        position={gripCenterCoords}
        text={`PAP: ${papXDistance}" over, ${papYDistanceLabel}`}
        style={markerStyle}
      />
    </>
  );
}
