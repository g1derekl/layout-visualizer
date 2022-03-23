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
  const nv = new Nvector(x / RADIUS, y / RADIUS, z / RADIUS);
  const latlon = nv.toLatLon();

  console.log(`${x}, ${y}, ${z}`);
  console.log(latlon);

  const destPoint = latlon.destinationPoint(distance, bearing, RADIUS);
  const destNv = destPoint.toNvector();

  return [destNv.x, destNv.y, destNv.z].map((i) => i * RADIUS) as [number, number, number];
}
