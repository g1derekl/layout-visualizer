/* global JSX */
import * as THREE from 'three';
import React, {
  ReactElement
} from 'react';
import { Line } from '@react-three/drei';

type BaseLineProps = {
  pinCoords: THREE.Vector3;
  cgCoords: THREE.Vector3;
}

// Adapted from https://stackoverflow.com/a/42721392/1573031
function setArc3D(
  pointStart: THREE.Vector3,
  pointEnd: THREE.Vector3,
  clockWise: boolean,
  smoothness = 256,
): THREE.Vector3[] {
  // calculate normal
  const cb = new THREE.Vector3();
  const ab = new THREE.Vector3();
  const normal = new THREE.Vector3();

  cb.subVectors(new THREE.Vector3(), pointEnd);
  ab.subVectors(pointStart, pointEnd);
  cb.cross(ab);
  normal.copy(cb).normalize();

  // get angle between vectors
  let angle = pointStart.angleTo(pointEnd);
  if (clockWise) {
    angle -= Math.PI * 2;
  }

  const numPoints = smoothness * (Math.abs(angle) / (Math.PI * 2));
  const angleDelta = angle / (numPoints - 1);

  const pts = [];
  for (let i = 0; i < numPoints; i++) {
    pts.push(pointStart.clone().applyAxisAngle(normal, angleDelta * i));
  }

  return pts;
}

type CircumferenceLineProps = {
  pointStart: THREE.Vector3;
  pointEnd: THREE.Vector3;
  color: string
}

function CircumferenceLine({ pointStart, pointEnd, color }: CircumferenceLineProps): ReactElement {
  const clockwisePoints = setArc3D(pointStart, pointEnd, true);
  const counterclockwisePoints = setArc3D(pointStart, pointEnd, false);

  return (
    <>
      <Line points={clockwisePoints} color={color} />
      <Line points={counterclockwisePoints} color={color} />
    </>
  );
}

function BaseLine(props: JSX.IntrinsicElements['mesh'] | BaseLineProps): ReactElement {
  const { pinCoords, cgCoords } = props as BaseLineProps;

  return <CircumferenceLine pointStart={pinCoords} pointEnd={cgCoords} color="orange" />;
}

// function BaseToVaLine() {

// }

// function Valine() { // Vertical axis line

// }

// function Midline() {

// }

// function GripCenterLine() {

// }

export default function LineMarkings(props: BaseLineProps): ReactElement {
  return (
    <BaseLine {...props} />
  );
}
