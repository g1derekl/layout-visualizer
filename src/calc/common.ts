import { Vector3 } from 'three';

import { calcBearing, calcPoint } from './geod';

export function placeholder() {
}

export function getPapCoords(
  pinCoords: Vector3,
  cgCoords: Vector3,
  pinToPapDistance: number,
  drillingAngle: number,
  leftHanded: boolean
): Vector3 {
  const vertLineBearing = calcBearing(pinCoords, cgCoords);

  let drillingAngleBearing: number;

  if (leftHanded) { // Reverse angle calculation for left-handed players
    drillingAngleBearing = vertLineBearing + drillingAngle!;
  } else {
    drillingAngleBearing = vertLineBearing - drillingAngle!;
  }

  const papCoords = calcPoint(pinCoords, pinToPapDistance!, drillingAngleBearing);

  return papCoords;
}

export function getMidlineIntCoords(
  pinCoords: Vector3,
  papCoords: Vector3,
  papYDistance: number,
  valAngle: number,
  leftHanded: boolean
): Vector3 {
  const pinToPapLineBearing = calcBearing(papCoords, pinCoords);

  let valAngleBearing: number;

  if (leftHanded) { // Reverse angle calculation for left-handed players
    if (pinToPapLineBearing - valAngle < 0) {
      valAngleBearing = 360 - (pinToPapLineBearing - valAngle);
    } else {
      valAngleBearing = pinToPapLineBearing - valAngle;
    }
  } else if (pinToPapLineBearing + valAngle > 359) {
    valAngleBearing = (pinToPapLineBearing + valAngle) - 360;
  } else {
    valAngleBearing = pinToPapLineBearing + valAngle;
  }

  const midlineIntCoords = calcPoint(papCoords, papYDistance!, valAngleBearing);

  return midlineIntCoords;
}
