import React, {
  ReactElement,
  useEffect,
} from 'react';
import { Vector3 } from 'three';

import { calcPoint } from '../calc/geod';
import { DotMark } from '../components/markings';

type BallMarkingsProps = {
  pinDistance: number;
  pinCoords: Vector3;
  cgCoords?: Vector3;
  setCgCoords: Function;
}

export default function BallMarkings({
  pinDistance,
  pinCoords,
  cgCoords,
  setCgCoords
}: BallMarkingsProps): ReactElement {
  const getCgCoords = (): void => {
    const coords = calcPoint(pinCoords, pinDistance as number, 180);
    setCgCoords(coords);
  };

  useEffect(() => {
    getCgCoords();
  }, []);

  return (
    <>
      <DotMark text="PIN" color="red" position={pinCoords} />
      {
        cgCoords && <DotMark text="CG" color="green" position={cgCoords} />
      }
    </>
  );
}

BallMarkings.defaultProps = {
  cgCoords: null
};
