import { BALL_RADIUS as RADIUS } from './constants';

/**
 * Given the radius of a sphere and length of an arc along the sphere, find the arc angle
 * @param {number} arcLength - length of arc along the surface of the sphere
 * @param {number} radius - radius of the sphere
 * @returns {number} the arc angle in radians
 */
export function getArcAngle(arcLength: number, radius: number = RADIUS) {
  const circumference = 2 * radius * Math.PI;
  return (arcLength / circumference) * (2 * Math.PI);
}

/**
 * Convert the given angle from degrees to radians
 * @param degrees - an angle in degrees
 * @returns the angle in radians
 */
export function degreesToRadians(degrees: number) {
  return degrees * (Math.PI / 180);
}

/**
 * Convert the given angle from radians to degrees
 * @param radians - an angle in radians
 * @returns the angle in degrees
 */
export function radiansToDegrees(radians: number) {
  return radians * (180 / Math.PI);
}
