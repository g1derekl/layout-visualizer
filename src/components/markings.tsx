/* eslint-disable no-lonely-if */
/* global JSX */
import {
  Mesh,
  Vector3
} from 'three';
import React, {
  ReactElement,
  useContext,
  useEffect,
  useRef
} from 'react';
import {
  CatmullRomLine,
  Decal,
  Html,
  Line,
  useTexture
} from '@react-three/drei';
import { calcBearing, calcPoint, normalizeBearing } from '../calc/geod';
import { GroupContext } from '../../pages';

const LABEL_STYLE = {
  font: '1.25rem sans-serif',
  background: '#303030',
  padding: '0.25rem',
  color: 'whitesmoke',
  borderRadius: '5px'
};

type MarkerProps = {
  text?: string;
  color?: string;
  radius?: number;
  position?: Vector3;
  style?: any;
  placement?: string;
}

export function MarkingLabel(props: JSX.IntrinsicElements['mesh'] | MarkerProps): ReactElement | null {
  const { text, style, position } = props as MarkerProps;

  return (
    <Html position={position} scale={[1, 1, 1]} zIndexRange={[1, 0]} occlude>
      <div className="label" style={{ ...LABEL_STYLE, ...style }}>{text}</div>
    </Html>
  );
}

MarkingLabel.defaultProps = {
  text: '',
  color: 'whitesmoke',
  background: '#303030'
};

/**
 * Create a canvas and draw a circle on it to use as a texture for the ball model
 * @returns a URL for loading the texture
 */
function createCircleTexture(color: string = 'black'): string {
  const canvas = document.createElement('canvas');
  canvas.width = 100;
  canvas.height = 100;
  if (canvas.getContext) {
    const context = canvas.getContext('2d');
    context!.arc(50, 50, 50, 0, 2 * Math.PI);
    context!.fillStyle = color;
    context!.fill();
  }
  return canvas.toDataURL();
}

export function DotMark(props: JSX.IntrinsicElements['mesh'] | MarkerProps): ReactElement {
  const meshRef = useRef<Mesh>(null!);
  const group = useContext(GroupContext);

  const { color, text, radius } = props as MarkerProps;
  const texture = useTexture(createCircleTexture(color));
  const { position } = props as JSX.IntrinsicElements['mesh'];

  const positionWorld = group.localToWorld((position as Vector3).clone());

  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.lookAt(0, 0, 0);
    }
  }, [meshRef.current]);

  const markerStyle = {
    color: 'whitesmoke'
  };

  return (
    <>
      <Decal
        position={positionWorld}
        scale={radius ? radius * 2 : 1}
        map={texture}
        ref={meshRef}
      />
      {
        text && (
          <MarkingLabel
            text={text}
            style={markerStyle}
            position={(position as Vector3).clone().addScalar(0.2)}
          />
        )
      }
    </>
  );
}

DotMark.defaultProps = {
  text: '',
  color: 'darkgray',
  radius: 0.0625
};

// Adapted from https://stackoverflow.com/a/42721392/1573031
function setArc3D(
  pointStart: Vector3,
  pointEnd: Vector3,
  clockwise: boolean,
  smoothness = 256,
): Vector3[] {
  // calculate normal
  const cb = new Vector3();
  const ab = new Vector3();
  const normal = new Vector3();

  cb.subVectors(new Vector3(), pointEnd);
  ab.subVectors(pointStart, pointEnd);
  cb.cross(ab);
  normal.copy(cb).normalize();

  // get angle between vectors
  let angle = pointStart.angleTo(pointEnd);
  if (clockwise) {
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
  pointStart: Vector3;
  pointEnd: Vector3;
  color: string;
  direction?: string
}

export function LineMark({
  pointEnd,
  pointStart,
  color,
  direction
}: CircumferenceLineProps): ReactElement {
  const clockwisePoints = setArc3D(pointStart, pointEnd, true);
  const counterclockwisePoints = setArc3D(pointStart, pointEnd, false);

  return (
    <>
      {
        (direction === 'clockwise' || direction === 'both')
          && <Line points={clockwisePoints} color={color} />
      }
      {
        (direction === 'counterclockwise' || direction === 'both')
          && <Line points={counterclockwisePoints} color={color} />
      }
    </>
  );
}

LineMark.defaultProps = {
  direction: 'both'
};

type AngleMarkProps = {
  center: Vector3;
  pointA: Vector3;
  pointB: Vector3;
  angle: number;
  clockwise: boolean,
  label: string;
}

export function AngleMark({
  center,
  pointA,
  pointB,
  angle,
  clockwise,
  label
}: AngleMarkProps): ReactElement {
  // Find the bearings from the center point to the other two points
  const pointABearing = calcBearing(center, pointA);
  const pointBBearing = calcBearing(center, pointB);

  const markerStyle = {
    color: 'midnightblue',
    background: 'ghostwhite',
    whiteSpace: 'nowrap'
  };

  if (pointABearing === pointBBearing) {
    return (
      <MarkingLabel
        text={`${label}: ${angle}°`}
        position={center.clone().add(new Vector3(0, 0, 0.25))}
        style={markerStyle}
      />
    );
  }

  let bearing = pointABearing;
  const points = [];

  if (clockwise) {
    if (pointABearing < pointBBearing) {
      while (bearing < pointBBearing) {
        points.push(calcPoint(center, 0.5, bearing));
        bearing += 5;
      }
    } else {
      while (bearing < 360) {
        points.push(calcPoint(center, 0.5, bearing));
        bearing += 5;
      }
      bearing = normalizeBearing(bearing) as number;
      while (bearing < pointBBearing) {
        points.push(calcPoint(center, 0.5, bearing));
        bearing += 5;
      }
    }
  } else {
    if (pointABearing > pointBBearing) {
      while (bearing > pointBBearing) {
        points.push(calcPoint(center, 0.5, bearing));
        bearing -= 5;
      }
    } else {
      while (bearing > 0) {
        points.push(calcPoint(center, 0.5, bearing));
        bearing -= 5;
      }
      bearing = normalizeBearing(bearing) as number;
      while (bearing > pointBBearing) {
        points.push(calcPoint(center, 0.5, bearing));
        bearing -= 5;
      }
    }
  }
  points.push(calcPoint(center, 0.5, pointBBearing));

  const midpoint = points[Math.floor(points.length / 2)];
  const labelPosition = new Vector3(midpoint.x, midpoint.y, midpoint.z + 0.2);

  return (
    <>
      <CatmullRomLine points={points} color="black" />
      <MarkingLabel text={`${label}: ${angle}°`} position={labelPosition} style={markerStyle} />
    </>
  );
}
