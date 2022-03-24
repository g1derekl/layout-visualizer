import { Vector3 } from 'three';
import { Nvector } from 'geodesy/latlon-nvector-spherical';

const RADIUS = 4.25;

type CartesianCoords = [number, number, number];

export function calcDistance() {

}

/**
 * Given two points on a sphere (represented by Cartesian coordinates),
 * calculate the compass heading from the start point to the destination point
 * @param {Vector3} startCoords - coordinates of the starting point
 * @param {Vector3} destCoords - coordinates of the destination point
 * @returns {number} the bearing, in degrees
 */
export function calcBearing(
  startCoords: Vector3,
  destCoords: Vector3
): number {
  const { x, y, z } = startCoords;
  const normalizedInput = [z, x, y].map((i) => i / RADIUS) as CartesianCoords;
  const nv = new Nvector(...normalizedInput);

  const { x: destX, y: destY, z: destZ } = destCoords;
  const normalizedDestInput = [destZ, destX, destY].map((i) => i / RADIUS) as CartesianCoords;
  const destNv = new Nvector(...normalizedDestInput);

  const latlon = nv.toLatLon();
  const destLatlon = destNv.toLatLon();

  const bearing = latlon.initialBearingTo(destLatlon);
  return bearing;
}

/**
 * Given a point on a sphere (represented by Cartesian coordinates),
 * calculate the coordinates of the point at the given distance and bearing
 * @param {Vector3} startCoords - coordinates of the starting point
 * @param {number} distance - distance to the destination point
 * @param {number} bearing - compass heading to the destination point, in degrees
 * @returns {Vector3} - Cartesian coordinates to the destination point
 */
export function calcPoint(
  startCoords: Vector3,
  distance: number,
  bearing: number
): Vector3 {
  const { x, y, z } = startCoords;
  const normalizedInput = [z, x, y].map((i) => i / RADIUS) as CartesianCoords;

  const nv = new Nvector(...normalizedInput);
  const latlon = nv.toLatLon();

  const destLatlon = latlon.destinationPoint(distance, bearing, RADIUS);
  const destNv = destLatlon.toNvector();

  const destCoords = [destNv.y, destNv.z, destNv.x].map((i) => i * RADIUS);
  return new Vector3().fromArray(destCoords);
}
