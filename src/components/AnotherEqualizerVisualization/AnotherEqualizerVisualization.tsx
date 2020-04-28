import * as React from 'react';
import cx from 'classnames';

import styles from './AnotherEqualizerVisualization.css';

// Convert this to a parameterized component and make it configurable.

export interface IAnotherEqualizerVisualizationProps {
  className?: string;
}

export default class AnotherEqualizerVisualization extends React.PureComponent<
  IAnotherEqualizerVisualizationProps
> {
  public render() {
    const { className } = this.props;

    return (
      <div className={cx(styles['another-equalizer-visualization'], className)}>
        <div className={styles['-amp-video-eq-col']}>
          <div className={styles['-amp-video-eq-1-1']}></div>
          <div className={styles['-amp-video-eq-1-2']}></div>
        </div>
        <div className={styles['-amp-video-eq-col']}>
          <div className={styles['-amp-video-eq-2-1']}></div>
          <div className={styles['-amp-video-eq-2-2']}></div>
        </div>
        <div className={styles['-amp-video-eq-col']}>
          <div className={styles['-amp-video-eq-3-1']}></div>
          <div className={styles['-amp-video-eq-3-2']}></div>
        </div>
        <div className={styles['-amp-video-eq-col']}>
          <div className={styles['-amp-video-eq-4-1']}></div>
          <div className={styles['-amp-video-eq-4-2']}></div>
        </div>

        <div className={styles['-amp-video-eq-col']}>
          <div className={styles['-amp-video-eq-5-1']}></div>
          <div className={styles['-amp-video-eq-5-2']}></div>
        </div>
        <div className={styles['-amp-video-eq-col']}>
          <div className={styles['-amp-video-eq-6-1']}></div>
          <div className={styles['-amp-video-eq-6-2']}></div>
        </div>
        <div className={styles['-amp-video-eq-col']}>
          <div className={styles['-amp-video-eq-7-1']}></div>
          <div className={styles['-amp-video-eq-7-2']}></div>
        </div>
        <div className={styles['-amp-video-eq-col']}>
          <div className={styles['-amp-video-eq-8-1']}></div>
          <div className={styles['-amp-video-eq-8-2']}></div>
        </div>

        <div className={styles['-amp-video-eq-col']}>
          <div className={styles['-amp-video-eq-9-1']}></div>
          <div className={styles['-amp-video-eq-9-2']}></div>
        </div>
        <div className={styles['-amp-video-eq-col']}>
          <div className={styles['-amp-video-eq-10-1']}></div>
          <div className={styles['-amp-video-eq-10-2']}></div>
        </div>
      </div>
    );
  }
}
