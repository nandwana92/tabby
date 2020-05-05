import { connect, ConnectedProps } from 'react-redux';
import React, { createRef } from 'react';
import cx from 'classnames';
import Mousetrap from 'mousetrap';

import ConnectedSimulateKeyPresses, {
  InteractionType,
  SimulateKeyPresses,
} from 'src/components/SimulateKeyPresses/SimulateKeyPresses';
import { Key, IAppState } from 'src/types';
import { sleep } from 'src/utils';

import styles from './ShowOnlyAudibleTabsDemo.css';

const mapState = (state: IAppState) => ({
  showAudibleTabsOnly: state.showAudibleTabsOnly,
});

const connector = connect(mapState);

type PropsFromRedux = ConnectedProps<typeof connector>;

export interface IShowOnlyAudibleTabsDemoProps {
  id?: string;
  onDone?: () => void;
  visible?: boolean;
  done?: boolean;
}

export interface IShowOnlyAudibleTabsDemoState {
  done: boolean;
}

type TAllProps = PropsFromRedux & IShowOnlyAudibleTabsDemoProps;

export class ShowOnlyAudibleTabsDemo extends React.Component<
  TAllProps,
  IShowOnlyAudibleTabsDemoState
> {
  private simulateKeyPressesRef = createRef<SimulateKeyPresses>();

  constructor(props: TAllProps) {
    super(props);

    this.state = {
      done: false,
    };
  }

  componentDidMount() {
    const { visible = true } = this.props;

    if (visible) {
      this.simulateKeyPresses();
    }
  }

  componentDidUpdate(prevProps: TAllProps) {
    const { visible = true, done = false, showAudibleTabsOnly } = this.props;
    const {
      visible: prevPropsVisible = true,
      done: prevPropsDone = false,
    } = prevProps;

    if (!prevPropsVisible && visible) {
      this.simulateKeyPresses();
    }

    if (!prevPropsDone && done && showAudibleTabsOnly) {
      Mousetrap.trigger('mod+s');
    }
  }

  private onDone = () => {
    const { onDone } = this.props;

    this.setState({
      done: true,
    });

    Mousetrap.trigger('mod+s');

    if (typeof onDone === 'function') {
      onDone();
    }
  };

  private async simulateKeyPresses() {
    await sleep(1000);
    this.simulateKeyPressesRef.current?.simulateKeyPresses();
  }

  public render() {
    const { visible, id = 'show-only-audible-tabs-demo' } = this.props;
    const { done } = this.state;

    return (
      <div
        id={id}
        className={cx(styles['show-only-audible-tabs-demo'], {
          [styles['visible']]: visible,
        })}
      >
        <div>Let's filter the results to just show the audible tabs now.</div>
        <ConnectedSimulateKeyPresses
          interactionType={InteractionType.COMBO}
          keyPresses={[Key.META, Key.S]}
          onDone={this.onDone}
          autoStart={false}
          ref={this.simulateKeyPressesRef}
        />
        <div
          className={cx(styles['tip'], {
            [styles['visible']]: done,
          })}
        >
          You can also use the shortcut{' '}
          <span className={styles['mute-toggle-combo']}>
            <kbd>shift</kbd>+<kbd>[1-9]</kbd>
          </span>
          to toggle mute for a tab.
        </div>
      </div>
    );
  }
}

export default connector(ShowOnlyAudibleTabsDemo);
