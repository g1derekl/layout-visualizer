import React, {
  ReactElement,
  useEffect,
  useLayoutEffect,
  useRef,
  useState
} from 'react';
import { CanvasTexture, CircleGeometry, Texture, TextureLoader } from 'three';
import {
  Circle,
  Decal,
  PerspectiveCamera,
  RenderTexture,
  Text,
  useTexture,
  MeshDiscardMaterial,
  OrthographicCamera
} from '@react-three/drei';
import { useLoader } from '@react-three/fiber';

// export default function MarkingCanvas(): ReactElement {
//   const canvasRef = useRef<HTMLCanvasElement>(document.createElement('canvas'));
//   const textureRef = useRef<CanvasTexture>();

//   useLayoutEffect(() => {
//     const canvas = canvasRef.current;

//     canvas.width = 4096;
//     canvas.height = 4096;

//     const context = canvas.getContext('2d');
//     if (context) {
//       context.rect(0, 0, canvas.width, canvas.height);
//       context.fillStyle = 'gray';
//       context.fill();
//       context.fillStyle = 'black';
//       context.font = '128px sans-serif';
//       context.fillText('Hello world', 128, 128);
//     }
//   }, []);

//   return (
//     <canvasTexture
//       ref={textureRef}
//       attach="map"
//       image={canvasRef.current}
//     />
//   );
// }

// function GrippingHole(): ReactElement {
//   return (
//     <RenderTexture attach="map">
//       <OrthographicCamera
//         makeDefault
//         manual
//         position={[0, 0, 0]}
//       />
//       <color attach="background" args={['yellow']} />
//       <circleGeometry args={[1, 32]}>
//         <meshBasicMaterial color="blue" />
//       </circleGeometry>
//       {/* <Circle args={[1000, 32]} material-color="blue" position={[0, 0, -1]} /> */}
//     </RenderTexture>
//   );
// }

// function HoleCanvas({
//   drawHole
// }: {
//   drawHole: (context: CanvasRenderingContext2D) => string
// }): ReactElement {
//   const canvasRef = useRef<HTMLCanvasElement>(null);

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     const context = canvas!.getContext('2d');
//     drawHole(context!);
//   }, []);

//   return <canvas ref={canvasRef} />;
// }

function createHoleTexture(): string {
  const canvas = document.createElement('canvas');
  canvas.width = 100;
  canvas.height = 100;
  if (canvas.getContext) {
    const context = canvas.getContext('2d');
    context!.arc(50, 50, 50, 0, 2 * Math.PI);
    context!.fillStyle = 'green';
    context!.fill();
  }
  return canvas.toDataURL();
}

function BallMarkings(): ReactElement {
  const textureUrl = createHoleTexture();
  const texture = useTexture(textureUrl);

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
