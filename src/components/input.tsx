/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-one-expression-per-line */
import React, { ChangeEvent, ReactElement, useEffect, useState } from 'react';

import styles from '../../styles/Home.module.css';
import { BallSpecs, BowlerSpecs, Layout } from '../data/types';

type FractionInputProps = {
  name: string;
  value: number;
  onChange: (e: ChangeEvent) => void;
}

function FractionInput({
  name,
  value,
  onChange
}: FractionInputProps): ReactElement {
  const [numerators, setNumerators] = useState<number[]>([]);
  const denominators = [2, 4, 8, 16, 32, 64];

  const handleFraction = (e: ChangeEvent) => {

  };

  const updateNumerators = (e: ChangeEvent) => {
    const denom = parseInt((e.target as HTMLInputElement).value, 10);
    setNumerators(
      Array.from(Array(denom).keys()).filter((n) => n % 2)
    );
  };

  return (
    <>
      <input name={name} value={value} type="number" />
      <div className={styles.fraction}>
        <select>
          {numerators.map((n) => (
            <option value={n}>{n}</option>
          ))}
        </select>
        <hr />
        <select onChange={updateNumerators}>
          {denominators.map((n) => (
            <option value={n}>{n}</option>
          ))}
        </select>
      </div>
    </>
  );
}

type InputFormProps = {
  onChange: (e: ChangeEvent) => void;
  values: BallSpecs & BowlerSpecs & Layout;
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
            <legend>Bowler specs</legend>
            <label htmlFor="papXDistance">
              What is your PAP (positive axis point)?
              <input name="papXDistance" type="number" value={values.papXDistance} onChange={onChange} />
            </label>
            <label htmlFor="papYDistance">
              &times;
              <input name="papYDistance" type="number" value={values.papYDistance} onChange={onChange} />
            </label>
            <br />
            <label htmlFor="leftHanded">
              Are you left- or right-handed?
              <select name="leftHanded" value={values.leftHanded ? 'true' : 'false'} onChange={onChange}>
                <option value="false">Right</option>
                <option value="true">Left</option>
              </select>
            </label>
            <br />
            <label htmlFor="thumbHole">
              Do you use a thumb hole?
              <input name="thumbHole" type="checkbox" checked={values.thumbHole} value="true" onChange={onChange} />
            </label>
            {
              values.thumbHole && (
                <>
                  <br />
                  <label htmlFor="leftSpan" className={styles.fractionContainer}>
                    What is your { values.leftHanded ? 'ring' : 'middle' } finger span?
                    <FractionInput name="leftSpan" value={values.leftSpan} onChange={onChange} />
                  </label>
                  <label htmlFor="leftSpan" className={styles.fractionContainer}>
                    What is your { values.leftHanded ? 'middle' : 'ring' } finger span?
                    <input name="rightSpan" type="number" value={Math.floor(values.rightSpan)} onChange={onChange} />
                    <div className={styles.fraction}>
                      <input type="number" />
                      <hr />
                      <input type="number" />
                    </div>
                  </label>
                  <br />
                  <i>(For spans, use cut-to-cut measurements)</i>
                </>
              )
            }
          </fieldset>
          <fieldset>
            <legend>Layout</legend>
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