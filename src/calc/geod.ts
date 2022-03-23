import { Nvector } from 'geodesy/latlon-nvector-spherical';

const RADIUS = 4.25;

export function calcDistance() {

}

export function calcPoint(
  x: number,
  y: number,
  z: number,
  distance: number,
  bearing: number
): [number, number, number] {
  const normalizedInput = [z, x, y].map((i) => i / RADIUS) as [number, number, number];
  const nv = new Nvector(...normalizedInput);
  const latlon = nv.toLatLon();

  const destPoint = latlon.destinationPoint(distance, bearing, RADIUS);
  const destNv = destPoint.toNvector();

  const coords = [destNv.y, destNv.z, destNv.x].map((i) => i * RADIUS) as [number, number, number];

  return coords;
}
