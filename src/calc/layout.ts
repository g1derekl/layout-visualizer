/**
 * Calculations to determine where to drill the finger holes in bowling balls,
 * using the dual angle method. More info:
 * - https://www.buddiesproshop.com/content/DualAngle.pdf
 * - http://www.bowlersreference.com/Ball/Layout/Dual.htm
 * NOTE: from here on, relative directions (up, down, left, right) will be given from
 * the perspective of looking at the ball oriented with the CG directly below the pin.
 */
import { Vector3 } from 'three';

import { calcBearing, calcPoint } from './geod';

/**
 * With the ball's pin as the starting point, draw a line to the CG marker.
 * Then, rotate the line about the pin [drillingAngle] degrees counterclockwise
 * (clockwise for left-handed players) and follow that line for [pinToPapDistance]
 * inches to place the player's PAP.
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
    drillingAngleBearing = vertLineBearing + drillingAngle!;
  } else {
    drillingAngleBearing = vertLineBearing - drillingAngle!;
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

/**
 * Like getValCoords, except this determines the intersection of the VAL and the midline, used to
 * find the grip center. getValCoords is needed because this point may be identical to the PAP
 * (i.e. papYDistance = 0), making it impossible to draw the VAL. From here, a line perpendicular
 * to the VAL is drawn, and some point along this line is the grip center.
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
