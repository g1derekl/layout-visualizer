/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/jsx-one-expression-per-line */
import React, {
  ForwardedRef,
  MutableRefObject,
  ReactElement,
  forwardRef,
  useContext,
  useState
} from 'react';
import Slider from 'rc-slider';

import 'rc-slider/assets/index.css';

import { BowlerStats } from '../data/types';
import { BOWLER_STATS, ViewMode } from '../calc/constants';

import styles from '../../styles/Controls.module.css';
import { ViewContext } from '../../pages';

type StatsSliderProps = {
  toggleAnimate: () => void;
};

const StatsSlider = forwardRef(({
  toggleAnimate
}: StatsSliderProps, ref: ForwardedRef<BowlerStats>): ReactElement => {
  const [stats, setStats] = useState(BOWLER_STATS);
  const viewMode = useContext(ViewContext);

  const handleChange = (name: string, val: number) => {
    const newStats = {
      ...stats,
      [name]: val
    };
    setStats(newStats);
    // eslint-disable-next-line no-param-reassign
    (ref as MutableRefObject<BowlerStats>).current = newStats;
  };

  const handleAnimate = () => {
    toggleAnimate();
  };

  return (
    <div className={styles.sliderControls}>
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
      <div>
        <button type="button" onClick={() => handleAnimate()}>
          { viewMode === ViewMode.ROTATION ? 'Stop' : 'Animate!' }
        </button>
      </div>
    </div>
  );
});

export default StatsSlider;
