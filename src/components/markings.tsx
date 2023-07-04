/* global JSX */
import {
  Mesh,
  Vector3,
  FrontSide
} from 'three';
import React, {
  ReactElement,
  useEffect,
  useRef,
  useState
} from 'react';
import { extend } from '@react-three/fiber';
import { Decal, Line, useTexture } from '@react-three/drei';

import { calcPoint } from '../calc/geod';

const { Text } = require('troika-three-text');

extend({ Text });

type MarkerProps = {
  text?: string;
  color?: string;
  radius?: number;
}

function MarkingLabel(props: JSX.IntrinsicElements['mesh'] | MarkerProps): ReactElement | null {
  const meshRef = useRef<Mesh>(null!);

  const { text, color } = props as MarkerProps;
  const { position } = props as { position: Vector3 };
  const coords = calcPoint(position, 0.25, 270);

  useEffect(() => {
    if (meshRef.current) {
      const mesh = meshRef.current;
      const lookDirection = new Vector3();
      const target = new Vector3();

      lookDirection.subVectors(mesh.position, new Vector3(0, 0, 0)).normalize();
      target.copy(mesh.position).add(lookDirection);

      mesh.lookAt(target);
    }
  }, [meshRef.current]);

  return (
    <mesh
      {...props}
      ref={meshRef}
      position={coords}
      scale={[1, 1, 1]}
    >
      { /* @ts-ignore */ }
      <text color={color} fontSize={0.25} text={text} anchorX="right" anchorY="middle">
        <meshBasicMaterial side={FrontSide} />
      </text>
    </mesh>
  );
}

MarkingLabel.defaultProps = {
  text: '',
  color: 'darkgray'
};

/**
 * Create a canvas and draw a circle on it to use as a texture for the ball model
 * @returns a URL for loading the texture
 */
function createCircleTexture(color?: string): string {
  const canvas = document.createElement('canvas');
  canvas.width = 100;
  canvas.height = 100;
  if (canvas.getContext) {
    const context = canvas.getContext('2d');
    context!.arc(50, 50, 50, 0, 2 * Math.PI);
    context!.fillStyle = color || 'black';
    context!.fill();
  }
  return canvas.toDataURL();
}

export function DotMark(props: JSX.IntrinsicElements['mesh'] | MarkerProps): ReactElement {
  const meshRef = useRef<Mesh>(null!);

  const { color, text, radius } = props as MarkerProps;
  const texture = useTexture(createCircleTexture(color));
  const { position } = props as JSX.IntrinsicElements['mesh'];

  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.lookAt(0, 0, 0);
    }
  }, [meshRef.current]);

  return (
    <>
      <Decal
        position={position}
        scale={radius ? radius * 2 : 1}
        map={texture}
        ref={meshRef}
      />
      <MarkingLabel text={text} color={color} position={position} />
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
  clockWise: boolean,
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
