import * as React from 'react';

import styles from './VerticalBar.css';

export interface IVerticalBarProps {
  barWidth: number;
  barHeight: number;
  startHeight: number;
  transitionDuration: number;
}

export interface IVerticalBarState {
  height: number;
  transitionDuration: number;
}

export default class VerticalBar extends React.Component<
  IVerticalBarProps,
  IVerticalBarState
> {
  private forwardCycle: boolean = true;

  constructor(props: IVerticalBarProps) {
    super(props);

    this.state = {
      height: 0,
      transitionDuration: 0,
    };

    this.updateHeightAtEveryInterval();
  }

  updateHeightAtEveryInterval() {
    setInterval(() => {
      const updatedHeight = this.forwardCycle
        ? this.getRandomMaxHeight()
        : this.getRandomMaxHeight(0, this.state.height);

      const updatedTransitionDuration = this.forwardCycle
        ? Math.ceil(
            (this.props.transitionDuration * updatedHeight) /
              this.props.barHeight
          )
        : this.state.transitionDuration;

      this.setState(
        {
          height: updatedHeight,
          transitionDuration: updatedTransitionDuration,
        },
        () => {
          this.forwardCycle = !this.forwardCycle;
        }
      );
    }, this.props.transitionDuration);
  }

  getRandomMaxHeight(from = this.props.startHeight, to = this.props.barHeight) {
    return from + Math.floor(Math.random() * (to - from + 1));
  }

  public render() {
    const { barWidth, barHeight } = this.props;
    const opacity = 0.25 + (this.state.height / barHeight) * 0.75;

    return (
      <div
        style={{
          height: `${barHeight}px`,
        }}
        className={styles['container']}
      >
        <div
          className={styles['bar']}
          style={{
            transitionDuration: `${this.state.transitionDuration}ms`,
            opacity,
            width: barWidth,
            height: this.state.height,
          }}
        ></div>
      </div>
    );
  }
}
