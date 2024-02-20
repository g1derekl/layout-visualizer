import { Vector3 } from 'three';
import {
  BallSpecs,
  BowlerSpecs,
  BowlerStats,
  Layout
} from '../data/types';

export const PIN_COORDS = new Vector3(0, 0, 4.25);

export const BALL_COORDS = new Vector3(4.25, 64, 32);

export const BALL_RADIUS = 4.25;

export const BALL_SPECS: BallSpecs = {
  pinDistance: 2,
  asymm: false
};

export const BOWLER_SPECS: BowlerSpecs = {
  papXDistance: 5.25,
  papYDistance: 0.5,
  leftSpan: 4,
  rightSpan: 4,
  bridge: 0.25,
  leftHanded: false,
  thumbHole: true,
  leftFingerSize: 31 / 32,
  rightFingerSize: 31 / 32,
  thumbSize: 1 + 1 / 4
};

export const BOWLER_STATS: BowlerStats = {
  axisTilt: 20,
  axisRotation: 35,
  revRate: 300
};

export const LAYOUT: Layout = {
  drillingAngle: 45,
  pinToPapDistance: 3.5,
  valAngle: 45
};
