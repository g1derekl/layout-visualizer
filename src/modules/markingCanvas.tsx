import React, {
  ReactElement,
  useLayoutEffect,
  useRef
} from 'react';
import { CanvasTexture } from 'three';

export default function MarkingCanvas(): ReactElement {
  const canvasRef = useRef<HTMLCanvasElement>(document.createElement('canvas'));
  const textureRef = useRef<CanvasTexture>();

  useLayoutEffect(() => {
    const canvas = canvasRef.current;

    canvas.width = 4096;
    canvas.height = 4096;

    const context = canvas.getContext('2d');
    if (context) {
      context.rect(0, 0, canvas.width, canvas.height);
      context.fillStyle = 'gray';
      context.fill();
      context.fillStyle = 'black';
      context.font = '128px sans-serif';
      context.fillText('Hello world', 128, 128);
    }
  }, []);

  return (
    <canvasTexture
      ref={textureRef}
      attach="map"
      image={canvasRef.current}
    />
  );
}
