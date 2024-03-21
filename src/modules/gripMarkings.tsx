import React, {
  ReactElement, useEffect, useState,
} from 'react';
import { Vector3 } from 'three';
import {
  getCenterLineEndpointsWithThumbhole,
  getFingerCoordsWithoutThumbhole,
  getFingerCoordsWithThumbhole
} from '../calc/layout';
import { DotMark, LineMark } from '../components/markings';

type GripMarkingsProps = {
  gripCenterCoords: Vector3;
  midlineCoords: Vector3;
  leftSpan: number;
  rightSpan: number;
  leftFingerSize: number;
  rightFingerSize: number;
  bridge: number;
  thumbHole: boolean;
  thumbSize: number | null;
  leftHanded: boolean;
}

type CenterLineProps = {
  bridgeCenterCoords: Vector3;
  thumbEdgeCoords: Vector3;
}

type FingerHolesProps = {
  leftFingerCoords: Vector3;
  rightFingerCoords: Vector3;
  leftFingerSize: number;
  rightFingerSize: number;
}

function FingerHoles({
  leftFingerCoords,
  rightFingerCoords,
  leftFingerSize,
  rightFingerSize,
}: FingerHolesProps): ReactElement {
  return (
    <>
      <DotMark position={leftFingerCoords} radius={leftFingerSize / 2} color="black" />
      <DotMark position={rightFingerCoords} radius={rightFingerSize / 2} color="black" />
    </>
  );
}

type ThumbHoleProps = {
  coords: Vector3,
  size: number
}

function ThumbHole({ coords, size }: ThumbHoleProps): ReactElement {
  return <DotMark position={coords} radius={size / 2} color="black" />;
}

function CenterLine({ bridgeCenterCoords, thumbEdgeCoords }: CenterLineProps): ReactElement {
  return <LineMark pointStart={bridgeCenterCoords} pointEnd={thumbEdgeCoords} direction="counterclockwise" color="black" />;
}

type MarkingsCoords = {
  leftFingerCoords: Vector3;
  rightFingerCoords: Vector3;
  bridgeCenterCoords: Vector3 | null;
  thumbEdgeCoords: Vector3 | null;
  thumbCenterCoords: Vector3 | null;
}

export default function GripMarkings({
  gripCenterCoords,
  midlineCoords,
  leftSpan,
  rightSpan,
  leftFingerSize,
  rightFingerSize,
  bridge,
  thumbHole,
  thumbSize,
  leftHanded
}: GripMarkingsProps): ReactElement {
  const [
    markingsCoords,
    setMarkingsCoords
  ] = useState<MarkingsCoords>();

  useEffect(() => {
    let leftFingerCoords: Vector3;
    let rightFingerCoords: Vector3;
    let bridgeCenterCoords: Vector3 | null = null;
    let thumbEdgeCoords: Vector3 | null = null;
    let thumbCenterCoords: Vector3 | null = null;

    if (thumbHole) {
      ({
        bridgeCenterCoords,
        thumbEdgeCoords,
        thumbCenterCoords
      } = getCenterLineEndpointsWithThumbhole(
        gripCenterCoords,
        midlineCoords,
        leftSpan,
        rightSpan,
        leftFingerSize,
        rightFingerSize,
        thumbSize!,
        leftHanded
      ));

      leftFingerCoords = getFingerCoordsWithThumbhole(
        bridgeCenterCoords,
        thumbCenterCoords,
        leftSpan,
        leftFingerSize,
        thumbSize!,
        bridge,
        'left'
      );
      rightFingerCoords = getFingerCoordsWithThumbhole(
        bridgeCenterCoords,
        thumbCenterCoords,
        rightSpan,
        rightFingerSize,
        thumbSize!,
        bridge,
        'right'
      );
    } else {
      leftFingerCoords = getFingerCoordsWithoutThumbhole(
        gripCenterCoords,
        midlineCoords,
        leftFingerSize,
        bridge,
        leftHanded,
        'left'
      );
      rightFingerCoords = getFingerCoordsWithoutThumbhole(
        gripCenterCoords,
        midlineCoords,
        leftFingerSize,
        bridge,
        leftHanded,
        'right'
      );
    }

    setMarkingsCoords({
      leftFingerCoords,
      rightFingerCoords,
      bridgeCenterCoords,
      thumbEdgeCoords,
      thumbCenterCoords
    });
  }, [
    gripCenterCoords,
    midlineCoords,
    leftSpan,
    rightSpan,
    leftFingerSize,
    rightFingerSize,
    bridge,
    thumbHole,
    thumbSize,
    leftHanded
  ]);

  return (
    <>
      {
        markingsCoords && markingsCoords.bridgeCenterCoords && markingsCoords.thumbEdgeCoords && (
          <CenterLine
            bridgeCenterCoords={markingsCoords.bridgeCenterCoords}
            thumbEdgeCoords={markingsCoords.thumbEdgeCoords}
          />
        )
      }
      {
        markingsCoords && markingsCoords.leftFingerCoords && markingsCoords.rightFingerCoords && (
          <FingerHoles
            leftFingerSize={leftFingerSize!}
            rightFingerSize={rightFingerSize!}
            leftFingerCoords={markingsCoords.leftFingerCoords}
            rightFingerCoords={markingsCoords.rightFingerCoords}
          />
        )
      }
      {
        thumbHole
        && markingsCoords
        && markingsCoords.thumbCenterCoords
        && <ThumbHole coords={markingsCoords.thumbCenterCoords} size={thumbSize!} />
      }
    </>
  );
}
