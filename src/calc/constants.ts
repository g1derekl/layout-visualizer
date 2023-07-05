import { Vector3 } from 'three';
import { BallSpecs, BowlerSpecs, Layout } from '../data/types';

export const PIN_COORDS = new Vector3(0, 0, 4.25);

export const BALL_COORDS = new Vector3(4.25, 64, 32);

export const BALL_RADIUS = 4.25;

export const BALL_SPECS: BallSpecs = {
  pinDistance: 2.5
};

export const BOWLER_SPECS: BowlerSpecs = {
  papXDistance: 5.25,
  papYDistance: 0.5,
  leftSpan: 3.5,
  rightSpan: 3.5,
  bridge: 0.25,
  leftHanded: false,
  thumbHole: true
};

export const LAYOUT: Layout = {
  drillingAngle: 45,
  pinToPapDistance: 3.5,
  valAngle: 45
};
