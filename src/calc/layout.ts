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

export function getValCoords(
  pinCoords: Vector3,
  papCoords: Vector3,
  valAngle: number,
  leftHanded: boolean
): Vector3 {
  const papToPinBearing = calcBearing(papCoords, pinCoords);

  let valAngleBearing: number;

  if (leftHanded) { // Reverse angle calculation for left-handed players
    if (papToPinBearing - valAngle < 0) {
      valAngleBearing = 360 + (papToPinBearing - valAngle);
    } else {
      valAngleBearing = papToPinBearing - valAngle;
    }
  } else if (papToPinBearing + valAngle >= 360) {
    valAngleBearing = (papToPinBearing + valAngle) - 360;
  } else {
    valAngleBearing = papToPinBearing + valAngle;
  }

  const valCoords = calcPoint(papCoords, 1, valAngleBearing);

  return valCoords;
}

export function getMidlineCoords(
  papCoords: Vector3,
  valCoords: Vector3,
  papYDistance: number
): Vector3 {
  const papToValBearing = calcBearing(papCoords, valCoords);
  const midlineCoords = calcPoint(papCoords, papYDistance, papToValBearing);

  return midlineCoords;
}

export function getGripCenterCoords(
  papCoords: Vector3,
  valCoords: Vector3,
  midlineCoords: Vector3,
  papXDistance: number,
  leftHanded: boolean
): Vector3 {
  const papToValBearing = calcBearing(papCoords, valCoords);

  let midlineBearing: number;

  if (leftHanded) {
    if (papToValBearing + 90 >= 360) {
      midlineBearing = (papToValBearing + 90) - 360;
    } else {
      midlineBearing = papToValBearing + 90;
    }
  } else if (papToValBearing - 90 < 0) {
    midlineBearing = 360 + (papToValBearing - 90);
  } else {
    midlineBearing = papToValBearing - 90;
  }

  return calcPoint(midlineCoords, papXDistance, midlineBearing);
}
