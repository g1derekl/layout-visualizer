import { Vector3 } from 'three';

export type BowlerSpecs = {
  papXDistance: number;
  papYDistance: number;
  leftSpan: number;
  rightSpan: number;
  bridge: number;
  leftHanded: boolean;
  thumbHole: boolean;
  leftFingerSize: number;
  rightFingerSize: number;
  thumbSize: number | null;
}

export type BallSpecs = {
  pinDistance: number;
}

export type Layout = {
  drillingAngle: number;
  pinToPapDistance: number;
  valAngle: number;
}

export type Markings = {
  pinCoords: Vector3;
  cgCoords: Vector3;
  papCoords: Vector3;
  valCoords: Vector3;
  midlineCoords: Vector3;
  gripCenterCoords: Vector3;
}

export type Grip = {
  bridge: number;
  leftSpan: number;
  rightSpan: number;
  leftFingerSize: number;
  rightFingerSize: number;
  thumbSize?: number;
}
