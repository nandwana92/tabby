import * as React from 'react';
import cx from 'classnames';

import VerticalBar from 'src/components/VerticalBar/VerticalBar';

import styles from './EqualizerVisualization.css';

// Separation between adjacent bars in pixels.
const SEPARATION_BETWEEN_BARS = 2;

export interface IEqualizerVisualizationProps {
  startHeight: number;
  transitionDuration: number;
  numberOfBars: number;
  barHeight: number;
  barWidth: number;
  className?: string;
}

export interface IEqualizerVisualizationState {}

export default class EqualizerVisualization extends React.Component<
  IEqualizerVisualizationProps,
  IEqualizerVisualizationState
> {
  constructor(props: IEqualizerVisualizationProps) {
    super(props);
    this.state = {};
  }

  public render() {
    const { numberOfBars, barWidth, className, ...rest } = this.props;

    const containerWidth =
      numberOfBars * barWidth + (numberOfBars - 1) * SEPARATION_BETWEEN_BARS;

    return (
      <div
        style={{
          width: `${containerWidth}px`,
        }}
        className={cx(styles['container'], className)}
      >
        {Array.from({ length: numberOfBars }).map((item, index) => {
          return <VerticalBar key={index} barWidth={barWidth} {...rest} />;
        })}
      </div>
    );
  }
}
