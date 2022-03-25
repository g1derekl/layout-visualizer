import React, { ReactElement } from 'react';
import { Line } from '@react-three/drei';
import { Vector3 } from 'three';

type GripMarkingsProps = {
  gripCenterCoords: Vector3;
  midlineCoords: Vector3;
  leftSpan: number;
  rightSpan: number;
  bridge?: number;
  thumbHole?: boolean;
}

type CenterLineProps = {
  bridgeCenterCoords: Vector3;
  thumbEdgeCoords: Vector3;
}

type FingerHolesProps = {
  leftHoleCoords: Vector3;
  rightHoleCoords: Vector3;
  leftFingerSize?: number;
  rightFingerSize?: number;
  bridge: number;
}

function FingerHoles({
  leftFingerCoords,
  rightFingerCoords,
  leftFingerSize,
  rightFingerSize,
  bridge,
}: FingerHolesProps): ReactElement {

  return (
    <></>
  );
}

FingerHoles.defaultProps = {
  leftFingerSize: 31 / 32,
  rightFingerSize: 31 / 32
};

function ThumbHole() {

}

function CenterLine({ bridgeCenterCoords, thumbEdgeCoords }: CenterLineProps): ReactElement {
  return <Line points={[bridgeCenterCoords, thumbEdgeCoords]} />;
}

export default function GripMarkings(props: GripMarkingsProps): ReactElement {
  const { thumbHole } = props;

  return (
    <>
      <CenterLine />
      <FingerHoles />
      {
        thumbHole && <ThumbHole />
      }
    </>
  );
}

GripMarkings.defaultProps = {
  bridge: 1 / 4,
  thumbHole: true
};
