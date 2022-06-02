import { BALL_RADIUS as RADIUS } from './constants';

export function placeholder() {
}

/**
 * Given the lengths of the three sides of a triangle, calculate the median of side A
 * (that is, the line segment between the midpoint of side A and its opposing vertex)
 * @param {number} a - side of the triangle for which the median is to be calculated
 * @param {number} b - one of the other sides of the triangle
 * @param {number} c - one of the other sides of the triangle
 * @returns {number} the length of the median of side A
 */
export function getMedianLength(a: number, b: number, c: number): number {
  const radicand = 2 * (b ** 2) + 2 * (c ** 2) - (a ** 2);
  const root = Math.sqrt(radicand);
  const median = root / 2;
  return median;
}

/**
 * Converts an angle from radians to degrees
 * @param {number} radians - representation of an angle in radians (between 0 and 2 * pi)
 * @returns {number} the equivalent angle in degrees (0 - 360)
 */
export function radiansToDegrees(radians: number) {
  return (radians * 180) / Math.PI;
}

/**
 * Given the lengths of each side of a triangle, solve for the angles of its vertices
 * @param {number} a - one side of triangle
 * @param {number} b - second side of triangle
 * @param {number} c - third side of triangle
 * @returns {[number, number, number]} the angles of the three vertices in degrees, each angle
 * cooresponding to the vertex opposite its respective side
 */
export function getTriangleAngles(a: number, b: number, c: number) {
  const alpha = Math.acos(((b ** 2) + (c ** 2) - (a ** 2)) / (2 * b * c));
  const beta = Math.acos(((a ** 2) + (c ** 2) - (b ** 2)) / (2 * a * c));
  // Find third angle by subtracting first two from pi radians (180 degrees)
  const gamma = Math.PI - (alpha + beta);

  return [alpha, beta, gamma].map((i) => radiansToDegrees(i));
}

/**
 * Given the radius of a sphere and length of an arc along the sphere, find the arc angle
 * @param {number} arcLength - length of arc along the surface of the sphere
 * @param {number} radius - radius of the sphere
 * @returns {number} the arc angle in degrees
 */
export function getArcAngle(arcLength: number, radius: number = RADIUS) {
  const circumference = 2 * radius * Math.PI;
  return (arcLength / circumference) * 360;
}
