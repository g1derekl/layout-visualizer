import React, { ChangeEvent, ReactElement } from 'react';

import styles from '../../styles/Home.module.css';
import { BallSpecs, BowlerSpecs, Layout } from '../data/types';

type InputFormProps = {
  onChange: (e: ChangeEvent) => void,
  values: BallSpecs & BowlerSpecs & Layout
}

export default function InputForm({
  onChange,
  values
}: InputFormProps): ReactElement {
  return (
    <div className={styles.ui}>
      <div className={styles.header}>
        <h2>Layout Visualizer</h2>
        <h4>Put in your specs and see a 3D model of your drilled ball</h4>
      </div>
      <div className={styles.inputForm}>
        <form>
          <fieldset>
            <div>Ball specs</div>
            <label htmlFor="pinDistance">
              What is the pin to CG distance of your ball?
              <input name="pinDistance" type="number" value={values.pinDistance} onChange={onChange} />
            </label>
          </fieldset>
          <fieldset>
            <div>Bowler specs</div>
            <label htmlFor="papXDistance">
              What is your PAP (positive axis point)?
              <input name="papXDistance" type="number" value={values.papXDistance} onChange={onChange} />
            </label>
            <label htmlFor="papYDistance">
              &times;
              <input name="papYDistance" type="number" value={values.papYDistance} onChange={onChange} />
            </label>
          </fieldset>
          <fieldset>
            <div>Layout</div>
            <label htmlFor="drillingAngle">
              What is your desired drilling angle?
              <input name="drillingAngle" type="number" value={values.drillingAngle} onChange={onChange} />
            </label>
            <br />
            <label htmlFor="pinToPapDistance">
              What is your desired pin to PAP distance?
              <input name="pinToPapDistance" type="number" value={values.pinToPapDistance} onChange={onChange} />
            </label>
            <br />
            <label htmlFor="valAngle">
              What is your desired VAL angle?
              <input name="valAngle" type="number" value={values.valAngle} onChange={onChange} />
            </label>
          </fieldset>
        </form>
      </div>
    </div>
  );
}