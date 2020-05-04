import * as React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import cx from 'classnames';
import Mousetrap from 'mousetrap';

import ToggleSwitch from 'src/components/ToggleSwitch/ToggleSwitch';
import AnotherEqualizerVisualization from 'src/components/AnotherEqualizerVisualization/AnotherEqualizerVisualization';
import { IAppState } from 'src/types';
import { updateShowAudibleTabsOnlyFlagValue } from 'src/actions';
import {
  showOnlyAudibleTabsLabel,
  showOnlyAudibleTabsIdentifer,
  keyLabels,
  ModifierKey,
} from 'src/constants';

import styles from './ShowOnlyAudibleTabsToggle.css';

const mapState = (state: IAppState) => ({
  showAudibleTabsOnly: state.showAudibleTabsOnly,
  platformInfo: state.platformInfo,
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

    Mousetrap.bind('mod+s', (e: ExtendedKeyboardEvent, combo: string) => {
      const { showAudibleTabsOnly } = this.props;
      e.preventDefault?.();
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
      platformInfo,
    } = this.props;

    const { os } = platformInfo;

    return (
      <React.Fragment>
        <ToggleSwitch
          className={styles['toggle-switch']}
          identifier={showOnlyAudibleTabsIdentifer}
          initialValue={showAudibleTabsOnly}
          onChange={updateShowAudibleTabsOnlyFlagValue}
        />
        <div className={styles['toggle-switch-label-container']}>
          <AnotherEqualizerVisualization
            className={cx(styles['equalizer-visualization'], {
              [styles['visible']]: showAudibleTabsOnly,
            })}
          />
          <div className={styles['toggle-switch-label-container']}>
            <div className={styles['toggle-switch-label']}>
              {showOnlyAudibleTabsLabel}
            </div>
            <div className={styles['keyboard-shortcut']}>
              <kbd>{keyLabels[ModifierKey.META][os]}</kbd>+<kbd>S</kbd>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default connector(ShowOnlyAudibleTabsToggle);
