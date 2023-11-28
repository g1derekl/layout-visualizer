import React, { ReactElement } from 'react';

import styles from '../../styles/Home.module.css';

export default function Notes(): ReactElement {
  const learnMoreLinks = [
    'https://www.buddiesproshop.com/content/DualAngle.pdf',
    'http://www.bowlersreference.com/Ball/Layout/Dual.htm'
  ];
  const githubLink = 'https://github.com/g1derekl/layout-visualizer';
  return (
    <div className={styles.notes}>
      <div>
        To learn more, visit these pages:
        <ul>
          {
            learnMoreLinks.map((link) => (
              <li key={link}>
                <a target="_blank" rel="noreferrer" href={link}>{link}</a>
              </li>
            ))
          }
        </ul>
      </div>
      <div>
        <p>
          Source code:&nbsp;
          <a target="_blank" rel="noreferrer" href={githubLink}>{githubLink}</a>
        </p>
      </div>
      <div>
        <p>
          Copyright (c)&nbsp;
          {new Date().getFullYear()}
          &nbsp;Derek Li. All rights reserved.
        </p>
        <p>
          This work is licensed under the terms of the MIT license.
          For a copy, see&nbsp;
          <a href="https://opensource.org/licenses/MIT" target="_blank" rel="noreferrer">https://opensource.org/licenses/MIT</a>
          .
        </p>
      </div>
    </div>
  );
}
