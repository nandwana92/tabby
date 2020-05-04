import React, { createRef } from 'react';
import cx from 'classnames';
import Mousetrap from 'mousetrap';

import ConnectedSimulateKeyPresses, {
  InteractionType,
  SimulateKeyPresses,
} from 'src/components/SimulateKeyPresses/SimulateKeyPresses';
import { Key } from 'src/types';
import { sleep } from 'src/utils';

import styles from './ShowOnlyAudibleTabsDemo.css';

export interface IShowOnlyAudibleTabsDemoProps {
  id?: string;
  onDone?: () => void;
  visible?: boolean;
}

export interface IShowOnlyAudibleTabsDemoState {}

export default class ShowOnlyAudibleTabsDemo extends React.Component<
  IShowOnlyAudibleTabsDemoProps,
  IShowOnlyAudibleTabsDemoState
> {
  private simulateKeyPressesRef = createRef<SimulateKeyPresses>();

  constructor(props: IShowOnlyAudibleTabsDemoProps) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    const { visible = true } = this.props;

    if (visible) {
      this.simulateKeyPresses();
    }
  }

  componentDidUpdate(prevProps: IShowOnlyAudibleTabsDemoProps) {
    const { visible = true } = this.props;
    const { visible: prevPropsVisible = true } = prevProps;

    if (!prevPropsVisible && visible) {
      this.simulateKeyPresses();
    }
  }

  private onDone = () => {
    const { onDone } = this.props;

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
      </div>
    );
  }
}
