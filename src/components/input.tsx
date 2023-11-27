/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-one-expression-per-line */
import React, {
  ChangeEvent,
  ReactElement,
  useEffect,
  useState
} from 'react';
// import Fraction from 'fractions';

import styles from '../../styles/Home.module.css';
import { BallSpecs, BowlerSpecs, Layout } from '../data/types';

export type InputChange = {
  name: string;
  type: string;
  value?: string;
  checked?: boolean;
}

// type FractionInputProps = {
//   name: string;
//   value: number;
//   onChange: (i: InputChange) => void;
// }

// function FractionInput({
//   name,
//   value,
//   onChange
// }: FractionInputProps): ReactElement {
//   const fraction = new Fraction(value);

//   const [integer, setInteger] = useState<number>(Math.floor(value));
//   const [numerators, setNumerators] = useState<number[]>([1]);
//   const [numerator, setNum] = useState<number>(1);
//   const [denominator, setDenom] = useState<number>(2);
//   const denominators = [1, 2, 4, 8, 16, 32, 64];

//   const updateNumerators = (e: ChangeEvent) => {
//     const elem = e.target as HTMLInputElement;
//     const denom = parseInt(elem.value, 10);
//     setDenom(denom);
//     if (denom === 1) {
//       setNumerators([1]);
//     }
//     setNumerators(
//       Array.from(Array(denom).keys()).filter((n) => n % 2)
//     );
//   };

//   useEffect(() => {
//     onChange({
//       name,
//       type: 'number',
//       value: (integer + (numerator / denominator)).toString()
//     });
//   }, [numerator, denominator]);

//   return (
//     <>
//       <input
//         name={name}
//         value={integer}
//         onChange={
//           (e: ChangeEvent) => setInteger(parseInt((e.target as HTMLInputElement).value, 10))
//         }
//         type="number"
//       />
//       <div className={styles.fraction}>
//         <select
//           value={numerator}
//           onChange={
//             (e: ChangeEvent) => setNum(parseInt((e.target as HTMLInputElement).value, 10))
//           }
//         >
//           {numerators.map((n) => (
//             <option key={n} value={n}>{n}</option>
//           ))}
//         </select>
//         <hr />
//         <select
//           value={denominator}
//           onChange={updateNumerators}
//         >
//           {denominators.map((n) => (
//             <option key={n} value={n}>{n}</option>
//           ))}
//         </select>
//       </div>
//     </>
//   );
// }

type InputFormProps = {
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
                    What is your { values.leftHanded ? 'ring' : 'middle' } finger span?
                    <input name="leftSpan" type="number" value={values.leftSpan} onChange={handleChange} />
                  </label>
                  <label htmlFor="leftSpan">
                    What is your { values.leftHanded ? 'middle' : 'ring' } finger span?
                    <input name="rightSpan" type="number" value={values.rightSpan} onChange={handleChange} />
                  </label>
                  <br />
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
