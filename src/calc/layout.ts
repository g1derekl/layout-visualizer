/**
 * Calculations to determine where to drill the finger holes in bowling balls,
 * using the dual angle method. More info:
 * - https://www.buddiesproshop.com/content/DualAngle.pdf
 * - http://www.bowlersreference.com/Ball/Layout/Dual.htm
 * NOTE: on this page, relative directions (up, down, left, right) will be given from
 * the perspective of looking at the ball oriented with the CG directly below the pin.
 * All coordinates, unless otherwise specified, are Cartesian.
 */
import { Vector3 } from 'three';
import { radToDeg } from 'three/src/math/MathUtils';

import {
  calcBearing,
  calcPoint,
  normalizeBearing
} from './geod';
import { getArcAngle } from './trig';

export type FingerCoords = {
  leftFingerCoords: Vector3;
  rightFingerCoords: Vector3;
};

export type CenterLineCoords = {
  bridgeCenterCoords: Vector3;
  thumbEdgeCoords: Vector3;
  thumbCenterCoords: Vector3;
};

/**
 * With the ball's pin as the starting point, draw a line to the CG marker.
 * Then, rotate the line about the pin [drillingAngle] degrees counterclockwise
 * (clockwise for left-handed players) and follow that line for [pinToPapDistance]
 * inches to mark the player's PAP (positive axis point).
 * @param {Vector3} pinCoords - coordinates of the pin
 * @param {Vector3} cgCoords - coordinates of the CG marker
 * @param {number} pinToPapDistance - distance from pin to PAP in inches
 * @param {number} drillingAngle - angle of rotation from pin-to-CG vector, in degrees
 * @param {boolean} leftHanded - true if player is left-handed
 * @returns {Vector3} the coordinates of the PAP
 */
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
    drillingAngleBearing = <number>normalizeBearing(vertLineBearing + drillingAngle!);
  } else {
    drillingAngleBearing = <number>normalizeBearing(vertLineBearing - drillingAngle!);
  }

  const papCoords = calcPoint(pinCoords, pinToPapDistance!, drillingAngleBearing);

  return papCoords;
}

/**
 * With the PAP as the starting point, draw a line to the pin. Then, rotate
 * the line clockwise (counterclockwise for left-handed players) [valAngle] degrees
 * to obtain the vertical angle line.
 * NOTE: this function actually returns an arbitrary point 1 inch away from the PAP.
 * The line that goes through the PAP and this point is the VAL.
 * @param {Vector3} pinCoords - coordinates of the pin
 * @param {Vector3} papCoords - coordinates of the PAP, as derived from the above function
 * @param {number} valAngle - angle of rotation from PAP-to-pin vector, in degrees
 * @param {boolean} leftHanded - true if player is left-handed
 * @returns {Vector3} the coordinates of an arbitrary point from which,
 * together with the PAP, the VAL is formed
 */
export function getValCoords(
  pinCoords: Vector3,
  papCoords: Vector3,
  valAngle: number,
  leftHanded: boolean
): Vector3 {
  const papToPinBearing = calcBearing(papCoords, pinCoords);

  let valAngleBearing: number;

  if (leftHanded) { // Reverse angle calculation for left-handed players
    valAngleBearing = <number>normalizeBearing(papToPinBearing - valAngle);
  } else {
    valAngleBearing = <number>normalizeBearing(papToPinBearing + valAngle);
  }

  const valCoords = calcPoint(papCoords, 1, valAngleBearing);

  return valCoords;
}

/**
 * Like getValCoords, except this determines the intersection of the VAL and the midline, used to
 * find the grip center. getValCoords is needed because if papYDistance = 0, this point is
 * identical to the PAP, making it impossible to draw the VAL. From here, a line perpendicular
 * to the VAL is drawn, and at some point along this line is the grip center.
 * @param {Vector3} papCoords - coordinates of the PAP
 * @param {Vector3} valCoords - coordinates of the arbitrary VAL point as defined in getValCoords
 * @param {number} papYDistance - vertical distance from the PAP to the grip center
 * (> 0: up, toward the pin, < 0: down, toward the CG)
 * @returns {Vector3} the coordinates of the point from which the midline is drawn
 */
export function getMidlineCoords(
  papCoords: Vector3,
  valCoords: Vector3,
  papYDistance: number
): Vector3 {
  const papToValBearing = calcBearing(papCoords, valCoords);
  const midlineCoords = calcPoint(papCoords, papYDistance, papToValBearing);

  return midlineCoords;
}

/**
 * Starting from the point determined in getMidlineCoords, draw a line perpendicular to the VAL.
 * Follow the line left/clockwise around the ball, (right/counterclockwise for left-handed players)
 * for [papXDistance] inches to find the grip center. This is where the holes will be.
 * @param {Vector3} papCoords - coordinates of the PAP
 * @param {Vector3} valCoords - coordinates of the arbitrary VAL point as defined in getValCoords
 * @param {Vector3} midlineCoords - coordinates of the point where the midline intersects with VAL
 * @param {number} papXDistance - lateral distance from the VAL to the grip center
 * @param {boolean} leftHanded - true if player is left-handed
 * @returns {Vector3} the coordinates of the point around which the finger holes are drilled
 */
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
    midlineBearing = <number>normalizeBearing(papToValBearing + 90);
  } else {
    midlineBearing = <number>normalizeBearing(papToValBearing - 90);
  }

  return calcPoint(midlineCoords, papXDistance, midlineBearing);
}

/**
 * Find the coordinates of the bridge center (the midpoint between the bottom edges
 * of the two finger holes) and the top edge of the thumb hole.
 * NOTE: this does not apply to players who do not use a thumb hole. For those players,
 * simply place the finger holes along the midline, such that the grip center lies
 * at the midpoint between them.
 * @param {Vector3} gripCenterCoords - coordinates of the grip center
 * @param {Vector3} midlineCoords - coordinates of the midline
 * @param {number} leftSpan - length of the player's left finger span
 * (middle finger for right-handed players, ring finger for left-handed players)
 * @param {number} rightSpan - length of the player's right finger span
 * (ring finger for right-handed players, middle finger for left-handed players)
 * @param {number} bridge - distance between the two finger holes
 * @param {boolean} leftHanded - true if player is left-handed
 * @returns {CenterLineCoords} an object containing coordinates to the grip center
 * and thumb hole edge
 */
export function getCenterLineEndpointsWithThumbhole(
  gripCenterCoords: Vector3,
  midlineCoords: Vector3,
  leftSpan: number,
  rightSpan: number,
  leftFingerSize: number,
  rightFingerSize: number,
  thumbSize: number,
  leftHanded: boolean
): CenterLineCoords {
  const centerLineLength = Math.max(leftSpan, rightSpan);
  const gripCenterToMidlineBearing = calcBearing(gripCenterCoords, midlineCoords);

  let bridgeCenterBearing: number;
  let thumbEdgeBearing: number;

  if (leftHanded) {
    bridgeCenterBearing = <number>normalizeBearing(gripCenterToMidlineBearing + 90);
    thumbEdgeBearing = <number>normalizeBearing(gripCenterToMidlineBearing - 90);
  } else {
    bridgeCenterBearing = <number>normalizeBearing(gripCenterToMidlineBearing - 90);
    thumbEdgeBearing = <number>normalizeBearing(gripCenterToMidlineBearing + 90);
  }

  const bridgeCenterCoords = calcPoint(
    gripCenterCoords,
    (centerLineLength + Math.max(leftFingerSize, rightFingerSize)) / 2,
    bridgeCenterBearing
  );
  const thumbEdgeCoords = calcPoint(
    gripCenterCoords,
    centerLineLength / 2,
    thumbEdgeBearing
  );
  const thumbCenterCoords = calcPoint(
    gripCenterCoords,
    (thumbSize + centerLineLength) / 2,
    thumbEdgeBearing
  );

  return { bridgeCenterCoords, thumbEdgeCoords, thumbCenterCoords };
}

export function getFingerCoordsWithThumbhole(
  bridgeCenterCoords: Vector3,
  thumbCenterCoords: Vector3,
  span: number,
  fingerSize: number,
  thumbSize: number,
  bridge: number,
  side: 'left' | 'right'
): Vector3 {
  const thumbToBridgeBearing = calcBearing(thumbCenterCoords, bridgeCenterCoords);

  // Find the distance between the center of the finger hole and the center line
  const distanceFingerToCenterLine = (bridge + fingerSize) / 2;
  const distanceThumbToFinger = span + thumbSize / 2 + fingerSize / 2;

  // Define angles in spherical triangle formed by the span, center line and distanceToCenterLine.
  // Reference for calculations:
  // https://en.wikipedia.org/wiki/Spherical_trigonometry#Napier's_rules_for_right_spherical_triangles
  const a = getArcAngle(distanceFingerToCenterLine); // center line to center of finger hole
  const c = getArcAngle(distanceThumbToFinger); // center of thumb hole to center of finger hole

  // Find the angle at thumb hole between center line and span line
  const A = Math.asin(Math.sin(a) / Math.sin(c));

  let bearingFromThumbToFinger: number;

  // Add or subtract angle from center line bearing
  if (side === 'left') {
    bearingFromThumbToFinger = <number>normalizeBearing(thumbToBridgeBearing - radToDeg(A));
  } else {
    bearingFromThumbToFinger = <number>normalizeBearing(thumbToBridgeBearing + radToDeg(A));
  }

  const fingerHoleCenter = calcPoint(
    thumbCenterCoords,
    distanceThumbToFinger,
    bearingFromThumbToFinger
  );

  return fingerHoleCenter;
}

export function getFingerCoordsWithoutThumbhole(
  gripCenterCoords: Vector3,
  midlineCoords: Vector3,
  leftFingerSize: number,
  rightFingerSize: number,
  bridge: number,
  leftHanded: boolean
): FingerCoords {
  const gripCenterToLeftFingerDistance = bridge / 2 + leftFingerSize / 2;
  const gripCenterToRightFingerDistance = bridge / 2 + rightFingerSize / 2;

  const gripCenterToMidlineBearing = calcBearing(gripCenterCoords, midlineCoords);

  let leftFingerBearing: number;
  let rightFingerBearing: number;

  if (leftHanded) {
    leftFingerBearing = gripCenterToMidlineBearing;
    rightFingerBearing = <number>normalizeBearing(gripCenterToMidlineBearing + 180);
  } else {
    leftFingerBearing = <number>normalizeBearing(gripCenterToMidlineBearing + 180);
    rightFingerBearing = gripCenterToMidlineBearing;
  }

  const leftFingerCoords = calcPoint(
    gripCenterCoords,
    gripCenterToLeftFingerDistance,
    leftFingerBearing
  );
  const rightFingerCoords = calcPoint(
    gripCenterCoords,
    gripCenterToRightFingerDistance,
    rightFingerBearing
  );

  return { leftFingerCoords, rightFingerCoords };
}
