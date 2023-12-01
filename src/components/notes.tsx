import React, { ReactElement } from 'react';

import styles from '../../styles/Home.module.css';

export default function Notes(): ReactElement {
  const learnMoreLinks = [
    {
      link: 'https://www.buddiesproshop.com/content/DualAngle.pdf',
      text: 'Understanding dual angle layouts (pdf)'
    },
    {
      link: 'https://wiki.bowlingchat.net/wiki/index.php?title=Measure_Bowlers_Positive_Axis_Point',
      text: 'How to measure your PAP'
    },
    {
      link: 'https://www.youtube.com/watch?v=51Z9kIqD39U',
      text: 'How to lay out a bowling ball (YouTube)'
    }
  ];
  const githubLink = 'https://github.com/g1derekl/layout-visualizer';
  return (
    <div className={styles.notes}>
      <div>
        <p>
          Copyright (c)&nbsp;
          {new Date().getFullYear()}
          &nbsp;Derek Li. All rights reserved.
        </p>
      </div>
      <div>
        <p>
          This program is not meant to be instructional and there are no guarantees to its accuracy.
          Do not use this as a drilling guide. Consult your local pro shop to find the best
          layout and fit for you.
        </p>
      </div>
      <div>
        <p>
          Currently, only the dual-angle layout method is supported. In the future,
          I may look into implementing other measurement systems, e.g. VLS/2LS.
        </p>
      </div>
      <div>
        <p>
          To learn more, visit these pages:
        </p>
        <ul>
          {
            learnMoreLinks.map((link) => (
              <li key={link.link}>
                <a target="_blank" rel="noreferrer" href={link.link}>{link.text}</a>
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
    </div>
  );
}
