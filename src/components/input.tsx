/* eslint-disable react/jsx-one-expression-per-line */
import React, {
  ChangeEvent,
  ReactElement,
} from 'react';

import styles from '../../styles/Home.module.css';
import { BallSpecs, BowlerSpecs, Layout } from '../data/types';

export type InputChange = {
  name: string;
  type: string;
  value?: string;
  checked?: boolean;
}

type InputFormProps = {
  // eslint-disable-next-line no-unused-vars
  onChange: (i: InputChange) => void;
  values: BallSpecs & BowlerSpecs & Layout;
}

export function InputForm({
  onChange,
  values
}: InputFormProps): ReactElement {
  const handleChange = (e: ChangeEvent) => {
    onChange((e.target as unknown) as InputChange);
  };

  return (
    <div className={styles.ui}>
      <div className={styles.header}>
        <h2>Layout Visualizer</h2>
        <h4>Put in your specs and see a 3D model of your drilled ball</h4>
      </div>
      <div className={styles.inputForm}>
        <form>
          <fieldset>
            <legend>Bowler specs (convert fractions to decimals before entering)</legend>
            <label htmlFor="papXDistance">
              What is your PAP (positive axis point)?
              <input name="papXDistance" type="number" value={values.papXDistance} onChange={handleChange} />
            </label>
            <label htmlFor="papYDistance">
              &times;
              <input name="papYDistance" type="number" value={values.papYDistance} onChange={handleChange} />
            </label>
            <br />
            <label htmlFor="leftHanded">
              Which hand do you bowl with?
              <select name="leftHanded" value={values.leftHanded ? 'true' : 'false'} onChange={handleChange}>
                <option value="false">Right</option>
                <option value="true">Left</option>
              </select>
            </label>
            <br />
            <label htmlFor="thumbHole">
              Do you use a thumb hole?
              <input name="thumbHole" type="checkbox" checked={values.thumbHole} value="true" onChange={handleChange} />
            </label>
            {
              values.thumbHole && (
                <>
                  <br />
                  <label htmlFor="leftSpan">
                    What is your { values.leftHanded ? 'ring' : 'middle' } finger span?*
                    <input name="leftSpan" type="number" value={values.leftSpan} onChange={handleChange} />
                  </label>
                  <label htmlFor="leftSpan">
                    What is your { values.leftHanded ? 'middle' : 'ring' } finger span?*
                    <input name="rightSpan" type="number" value={values.rightSpan} onChange={handleChange} />
                  </label>
                  <br />
                  <small>
                    (*Use cut-to-cut spans, i.e. the distance between the edges of holes
                    without inserts, slugs, interchangeable devices, etc.)
                  </small>
                </>
              )
            }
          </fieldset>
          <fieldset>
            <legend>Layout</legend>
            <label htmlFor="drillingAngle">
              What is your desired drilling angle?
              <input name="drillingAngle" type="number" value={values.drillingAngle} onChange={handleChange} />
            </label>
            <br />
            <label htmlFor="pinToPapDistance">
              What is your desired pin to PAP distance?
              <input name="pinToPapDistance" type="number" value={values.pinToPapDistance} onChange={handleChange} />
            </label>
            <br />
            <label htmlFor="valAngle">
              What is your desired VAL angle?
              <input name="valAngle" type="number" value={values.valAngle} onChange={handleChange} />
            </label>
          </fieldset>
        </form>
      </div>
    </div>
  );
}
