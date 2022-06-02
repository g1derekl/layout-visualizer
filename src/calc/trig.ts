import { BALL_RADIUS as RADIUS } from './constants';

export function placeholder() {
}

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
