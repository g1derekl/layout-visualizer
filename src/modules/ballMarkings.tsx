import React, {
  ReactElement,
} from 'react';
import { Vector3 } from 'three';

import { DotMark } from '../components/markings';

type BallMarkingsProps = {
  asymm: boolean;
  pinCoords: Vector3;
  cgCoords?: Vector3;
}

export default function BallMarkings({
  asymm,
  pinCoords,
  cgCoords,
}: BallMarkingsProps): ReactElement {
  return (
    <>
      <DotMark text="PIN" color="red" position={pinCoords} />
      {
        cgCoords && <DotMark text={asymm ? 'MB' : 'CG'} color="green" position={cgCoords} />
      }
    </>
  );
}

BallMarkings.defaultProps = {
  cgCoords: null
};
