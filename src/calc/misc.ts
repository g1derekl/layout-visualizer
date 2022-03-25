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
