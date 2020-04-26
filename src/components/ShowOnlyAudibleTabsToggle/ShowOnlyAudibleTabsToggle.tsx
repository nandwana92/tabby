import * as React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import cx from 'classnames';

import ToggleSwitch from 'src/components/ToggleSwitch/ToggleSwitch';
import EqualizerVisualization from 'src/components/EqualizerVisualization/EqualizerVisualization';
import { IAppState } from 'src/types';
import { updateShowAudibleTabsOnlyFlagValue } from 'src/actions';
import {
  showOnlyAudibleTabsLabel,
  showOnlyAudibleTabsIdentifer,
} from 'src/constants';

import styles from './ShowOnlyAudibleTabsToggle.css';

const mapState = (state: IAppState) => ({
  showAudibleTabsOnly: state.showAudibleTabsOnly,
  isChromeOnSteroidsVisible: state.isChromeOnSteroidsVisible,
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

  componentDidMount() {
    this.registerKeyListeners();
  }

  componentDidUpdate(prevProps: TAllProps) {
    if (
      this.props.isChromeOnSteroidsVisible !==
      prevProps.isChromeOnSteroidsVisible
    ) {
      if (this.props.isChromeOnSteroidsVisible) {
        this.registerKeyListeners();
      } else {
        this.deregisterKeyListeners();
      }
    }
  }

  private registerKeyListeners() {
    const { updateShowAudibleTabsOnlyFlagValue } = this.props;

    Mousetrap.bind('command+s', (e: ExtendedKeyboardEvent, combo: string) => {
      const { showAudibleTabsOnly } = this.props;
      e.preventDefault();
      updateShowAudibleTabsOnlyFlagValue(!showAudibleTabsOnly);
    });
  }

  private deregisterKeyListeners() {
    Mousetrap.unbind('mod+s');
  }

  public render() {
    const {
      showAudibleTabsOnly,
      updateShowAudibleTabsOnlyFlagValue,
    } = this.props;

    return (
      <React.Fragment>
        <ToggleSwitch
          className={styles['toggle-switch']}
          identifier={showOnlyAudibleTabsIdentifer}
          initialValue={showAudibleTabsOnly}
          onChange={updateShowAudibleTabsOnlyFlagValue}
        />
        <div className={styles['toggle-switch-label-container']}>
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
          <div className={styles['toggle-switch-label']}>
            <div>{showOnlyAudibleTabsLabel}</div>
            <div className={styles['keyboard-shortcut']}>
              <kbd>⌘</kbd>+<kbd>S</kbd>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default connector(ShowOnlyAudibleTabsToggle);
