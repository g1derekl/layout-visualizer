import React, {
  ReactElement
} from 'react';
import {
  Decal,
  useTexture
} from '@react-three/drei';

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

function BallMarkings(): ReactElement {
  const fingerHoleTexture = createCircleTexture('green');
  const texture = useTexture(fingerHoleTexture);

  return (
    <Decal
      debug
      position={[0, 0, 4.25]}
      rotation={[0, 0, 0]}
      scale={31 / 32}
      map={texture}
    />
  );
}

export default function MarkingCanvas(): ReactElement {
  return <BallMarkings />;
}
