/* eslint-disable react/jsx-one-expression-per-line */
import React, {
  ChangeEvent,
  ReactElement,
  useState,
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

type OpenInputs = {
  specs: boolean;
  layout: boolean;
} & {
  [key: string]: boolean;
}

export function InputForm({
  onChange,
  values
}: InputFormProps): ReactElement {
  const handleChange = (e: ChangeEvent) => {
    onChange((e.target as unknown) as InputChange);
  };

  const [openInputs, setOpenInputs] = useState<OpenInputs>({ specs: false, layout: false });

  const openInputOnMobile = (fieldGroup: string) => {
    setOpenInputs({ ...openInputs, [fieldGroup]: !openInputs[fieldGroup] });
  };

  return (
    <div className={styles.ui}>
      <div className={styles.header}>
        <h2>Layout Visualizer</h2>
        <h4>Put in your specs and see a 3D model of your drilled bowling ball</h4>
      </div>
      <div className={styles.openInputModal}>
        <button
          type="button"
          onClick={() => openInputOnMobile('specs')}
        >
          Enter your specs
        </button>
        <button
          type="button"
          onClick={() => openInputOnMobile('layout')}
        >
          Enter your desired layout
        </button>
      </div>
      <div
        className={
        `${styles.formModalOverlay} ${(openInputs.specs || openInputs.layout) ? styles.visible : ''}`
        }
        aria-label="formModalOverlay"
        role="button"
        tabIndex={-1}
        onClick={() => setOpenInputs({ specs: false, layout: false })}
        onKeyDown={() => {}}
      />
      <div className={styles.inputForm}>
        <form>
          <fieldset className={openInputs.specs ? styles.visible : ''}>
            <legend>Bowler specs (convert fractions to decimals)</legend>
            <div className={styles.inputGrid}>
              <div className={styles.inputColumn}>
                <div className={styles.inputRow}>
                  <span>What is your PAP (positive axis point)?*</span>
                  <div>
                    <input name="papXDistance" type="number" value={values.papXDistance} onChange={handleChange} />
                    &nbsp;<small>in</small>
                    &nbsp;&times;&nbsp;
                    <input name="papYDistance" type="number" value={values.papYDistance} onChange={handleChange} />
                    &nbsp;<small>in</small>
                  </div>
                </div>
                <div>
                  <small>
                    (*Positive number means a point above the center line, negative means below)
                  </small>
                </div>
                <label htmlFor="leftHanded">
                  Which hand do you bowl with?
                  <div className={styles.inputLine}>
                    <select name="leftHanded" value={values.leftHanded ? 'true' : 'false'} onChange={handleChange}>
                      <option value="false">Right</option>
                      <option value="true">Left</option>
                    </select>
                  </div>
                </label>
                <label htmlFor="thumbHole">
                  Do you use a thumb hole?
                  <div className={styles.inputLine}>
                    <select name="thumbHole" value={values.thumbHole ? 'true' : 'false'} onChange={handleChange}>
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                  </div>
                </label>
                {
                  values.thumbHole && (
                    <>
                      <label htmlFor="leftSpan">
                        What is your { values.leftHanded ? 'ring' : 'middle' } finger span?**
                        <div className={styles.inputLine}>
                          <input name="leftSpan" type="number" value={values.leftSpan} onChange={handleChange} />
                          <small>in</small>
                        </div>
                      </label>
                      <label htmlFor="rightSpan">
                        What is your { values.leftHanded ? 'middle' : 'ring' } finger span?**
                        <div className={styles.inputLine}>
                          <input name="rightSpan" type="number" value={values.rightSpan} onChange={handleChange} />
                          <small>in</small>
                        </div>
                      </label>
                      <div>
                        <small>
                          (**Use cut-to-cut spans, i.e. the distance between the edges of holes
                          without inserts, slugs, interchangeable devices, etc.)
                        </small>
                      </div>
                    </>
                  )
                }
              </div>
              <div className={styles.inputColumn}>
                <label htmlFor="bridge">
                  What is your bridge (the distance between the two finger holes)?
                  <div className={styles.inputLine}>
                    <input name="bridge" type="number" value={values.bridge} onChange={handleChange} />
                    <small>in</small>
                  </div>
                </label>
                <label htmlFor="leftFingerSize">
                  What is the size of your { values.leftHanded ? 'ring' : 'middle' } finger hole?&dagger;
                  <div className={styles.inputLine}>
                    <input name="leftFingerSize" type="number" value={values.leftFingerSize} onChange={handleChange} />
                    <small>in</small>
                  </div>
                </label>
                <label htmlFor="rightFingerSize">
                  What is the size of your { values.leftHanded ? 'middle' : 'ring' } finger hole?&dagger;
                  <div className={styles.inputLine}>
                    <input name="rightFingerSize" type="number" value={values.rightFingerSize} onChange={handleChange} />
                    <small>in</small>
                  </div>
                </label>
                <div>
                  <small>
                    (&dagger;The outer diameter of a standard finger insert is 31/32&quot;,
                    or 0.9687&quot;, though larger sizes exist.)
                  </small>
                </div>
                {
                  values.thumbHole && (
                    <>
                      <label htmlFor="thumbSize">
                        What is the size of your thumb hole?&Dagger;
                        <div className={styles.inputLine}>
                          <input name="thumbSize" type="number" value={values.thumbSize!} onChange={handleChange} />
                          <small>in</small>
                        </div>
                      </label>
                      <div>
                        <small>
                          (&Dagger;Thumb slugs usually range from 1 1/8&quot; to 1 1/2&quot;
                          in diameter; for the average bowler, 1 1/4&quot; is the most common size.)
                        </small>
                      </div>
                    </>
                  )
                }
              </div>
            </div>
          </fieldset>
          <fieldset className={openInputs.layout ? styles.visible : ''}>
            <legend>Layout</legend>
            <div className={styles.inputGrid}>
              <div className={styles.inputColumn}>
                <label htmlFor="asymm">
                  Does your ball have an asymmetrical weight block?
                  <div className={styles.inputLine}>
                    <select name="asymm" value={values.asymm ? 'true' : 'false'} onChange={handleChange}>
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                  </div>
                </label>
                <label htmlFor="drillingAngle">
                  What is your desired drilling angle?
                  <div className={styles.inputLine}>
                    <input name="drillingAngle" type="number" value={values.drillingAngle} onChange={handleChange} />
                    <small>deg</small>
                  </div>
                </label>
                <label htmlFor="pinToPapDistance">
                  What is your desired pin to PAP distance?
                  <div className={styles.inputLine}>
                    <input name="pinToPapDistance" type="number" value={values.pinToPapDistance} onChange={handleChange} />
                    <small>in</small>
                  </div>
                </label>
                <label htmlFor="valAngle">
                  What is your desired VAL angle?
                  <div className={styles.inputLine}>
                    <input name="valAngle" type="number" value={values.valAngle} onChange={handleChange} />
                    <small>deg</small>
                  </div>
                </label>
              </div>
            </div>
          </fieldset>
          <button
            onClick={() => setOpenInputs({ specs: false, layout: false })}
            type="button"
            className={`${styles.closeInputModal} ${(openInputs.specs || openInputs.layout) ? styles.visible : ''}`}
          >
            Close
          </button>
        </form>
      </div>
    </div>
  );
}
