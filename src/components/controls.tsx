/* eslint-disable react/jsx-one-expression-per-line */
import React, {
  ForwardedRef,
  MutableRefObject,
  ReactElement,
  forwardRef,
  useState
} from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

import { BowlerStats } from '../data/types';
import { BOWLER_STATS } from '../calc/constants';

// type StatsSliderProps = {
//   updateStats: () => void;
// };

const StatsSlider = forwardRef((props, ref: ForwardedRef<BowlerStats>): ReactElement => {
  const [stats, setStats] = useState(BOWLER_STATS);
  // eslint-disable-next-line no-param-reassign, no-unused-vars
  // ref = useRef<BowlerStats>(stats);

  const handleChange = (name: string, val: number) => {
    setStats({
      ...stats,
      [name]: val
    });
    // eslint-disable-next-line no-param-reassign
    ref.current = stats;
  };

  return (
    <>
      <div>
        <span>Axis Tilt: {stats.axisTilt}</span>
        <Slider
          value={stats.axisTilt}
          onChange={(val) => handleChange('axisTilt', val as number)}
          min={-90}
          max={90}
        />
      </div>
      <div>
        <span>Axis Rotation: {stats.axisRotation}</span>
        <Slider
          value={stats.axisRotation}
          onChange={(val) => handleChange('axisRotation', val as number)}
          min={-90}
          max={90}
        />
      </div>
      <div>
        <span>Rev Rate: {stats.revRate}</span>
        <Slider
          value={stats.revRate}
          onChange={(val) => handleChange('revRate', val as number)}
          min={0}
          max={800}
        />
      </div>
    </>
  );
});

export default StatsSlider;
