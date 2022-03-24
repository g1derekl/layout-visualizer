import * as THREE from 'three';
import React, {
  ReactElement,
  useEffect,
  useState
} from 'react';

import { calcPoint } from '../calc/geod';
import { PIN_COORDS } from '../calc/constants';
import LineMarkings from './layoutMarkings';
import { DotMark } from '../components/markings';

type BallMarkingsProps = {
  pinDistance?: number;
}

export default function BallMarkings({ pinDistance }: BallMarkingsProps): ReactElement {
  const [cgCoords, setCgCoords] = useState<THREE.Vector3 | null>(null);
  const pinCoords = PIN_COORDS;

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
        cgCoords && (
          <>
            <DotMark text="CG" color="green" position={cgCoords} />
            <LineMarkings pinCoords={pinCoords} cgCoords={cgCoords} />
          </>
        )
      }
    </>
  );
}

BallMarkings.defaultProps = {
  pinDistance: 2.5
};
