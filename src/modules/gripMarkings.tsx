import React, {
  ReactElement,
  useEffect,
  useState
} from 'react';
import { Vector3 } from 'three';
import {
  FingerCoords,
  getCenterLineEndpointsWithThumbhole,
  getFingerCoordsWithoutThumbhole,
  getFingerCoordsWithThumbhole
} from '../calc/layout';
import { DotMark, LineMark } from '../components/markings';

type GripMarkingsProps = {
  gripCenterCoords: Vector3;
  midlineCoords: Vector3;
  leftSpan?: number;
  rightSpan?: number;
  leftFingerSize?: number;
  rightFingerSize?: number;
  bridge?: number;
  thumbHole?: boolean;
  thumbSize?: number;
  leftHanded?: boolean;
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
  const [bridgeCenterCoords, setBridgeCenterCoords] = useState<Vector3 | null>(null);
  const [thumbEdgeCoords, setThumbEdgeCoords] = useState<Vector3 | null>(null);
  const [thumbHoleCoords, setThumbHoleCoords] = useState<Vector3 | null>(null);
  const [fingerHoleCoords, setFingerHoleCoords] = useState<FingerCoords | null>(null);

  const findCenterLine = (): void => {
    const {
      bridgeCenterCoords: bridgeCenter,
      thumbEdgeCoords: thumbEdge,
      thumbCenterCoords: thumbCenter
    } = getCenterLineEndpointsWithThumbhole(
      gripCenterCoords,
      midlineCoords,
      leftSpan,
      rightSpan,
      leftFingerSize!,
      rightFingerSize!,
      thumbSize!,
      leftHanded!
    );

    setBridgeCenterCoords(bridgeCenter);
    setThumbEdgeCoords(thumbEdge);
    setThumbHoleCoords(thumbCenter);
  };

  const mapGripHoles = (): void => {
    if (thumbHole) {
      const leftFingerCoords = getFingerCoordsWithThumbhole(
        bridgeCenterCoords!,
        thumbHoleCoords!,
        leftSpan,
        leftFingerSize!,
        thumbSize!,
        bridge!,
        'left'
      );
      const rightFingerCoords = getFingerCoordsWithThumbhole(
        bridgeCenterCoords!,
        thumbHoleCoords!,
        rightSpan,
        rightFingerSize!,
        thumbSize!,
        bridge!,
        'right'
      );
      setFingerHoleCoords({
        leftFingerCoords,
        rightFingerCoords
      });
    } else {
      setFingerHoleCoords(getFingerCoordsWithoutThumbhole(
        gripCenterCoords,
        midlineCoords,
        leftFingerSize!,
        rightFingerSize!,
        bridge!,
        leftHanded!
      ));
    }
  };

  useEffect(() => {
    findCenterLine();
  }, []);

  useEffect(() => {
    if (bridgeCenterCoords && (thumbEdgeCoords || !thumbHole)) {
      mapGripHoles();
    }
  }, [bridgeCenterCoords, thumbEdgeCoords]);

  return (
    <>
      {
        bridgeCenterCoords && thumbEdgeCoords && (
          <CenterLine
            bridgeCenterCoords={bridgeCenterCoords}
            thumbEdgeCoords={thumbEdgeCoords}
          />
        )
      }
      {
        fingerHoleCoords && (
          <FingerHoles
            leftFingerSize={leftFingerSize!}
            rightFingerSize={rightFingerSize!}
            {...fingerHoleCoords}
          />
        )
      }
      {
        thumbHole && thumbHoleCoords && <ThumbHole coords={thumbHoleCoords} size={thumbSize!} />
      }
    </>
  );
}

GripMarkings.defaultProps = {
  bridge: 1 / 4,
  thumbHole: true,
  leftSpan: null,
  rightSpan: null,
  leftFingerSize: 31 / 32,
  rightFingerSize: 31 / 32,
  thumbSize: 1 + 1 / 2,
  leftHanded: false
};
