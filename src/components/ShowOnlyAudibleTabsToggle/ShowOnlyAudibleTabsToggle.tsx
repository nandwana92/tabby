import * as React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import cx from 'classnames';

import ToggleSwitch from 'src/components/ToggleSwitch/ToggleSwitch';
import EqualizerVisualization from 'src/components/EqualizerVisualization/EqualizerVisualization';
import { IAppState } from 'src/types';
import { updateShowAudibleTabsOnlyFlagValue } from 'src/actions';
import { showOnlyAudibleTabsLabel } from 'src/constants';

import styles from './ShowOnlyAudibleTabsToggle.css';

const mapState = (state: IAppState) => ({
  showAudibleTabsOnly: state.showAudibleTabsOnly,
});

const mapDispatch = {
  updateShowAudibleTabsOnlyFlagValue,
};

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

export interface IShowOnlyAudibleTabsToggleProps {}

export interface IShowOnlyAudibleTabsToggleState {}

type TAllProps = PropsFromRedux & IShowOnlyAudibleTabsToggleProps;

export class ShowOnlyAudibleTabsToggle extends React.Component<
  TAllProps,
  IShowOnlyAudibleTabsToggleState
> {
  constructor(props: TAllProps) {
    super(props);

    this.state = {};
  }

  onChange = (checked: boolean) => {
    const { updateShowAudibleTabsOnlyFlagValue } = this.props;

    updateShowAudibleTabsOnlyFlagValue(checked);
  };

  public render() {
    const { showAudibleTabsOnly } = this.props;

    return (
      <React.Fragment>
        <ToggleSwitch
          className={styles['toggle-switch']}
          onChange={this.onChange}
        />
        <div className={styles['toggle-switch-label-container']}>
          <div className={styles['toggle-switch-label']}>
            {showOnlyAudibleTabsLabel}
          </div>
          <EqualizerVisualization
            className={cx(styles['equalizer-visualization'], {
              [styles['visible']]: showAudibleTabsOnly,
            })}
            barWidth={8}
            barHeight={32}
            numberOfBars={10}
            transitionDuration={250}
            startHeight={10}
          />
        </div>
      </React.Fragment>
    );
  }
}

export default connector(ShowOnlyAudibleTabsToggle);
