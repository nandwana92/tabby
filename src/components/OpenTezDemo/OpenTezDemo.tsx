import React, { createRef } from 'react';
import cx from 'classnames';

import ConnectedSimulateKeyPresses, {
  InteractionType,
  SimulateKeyPresses,
} from 'src/components/SimulateKeyPresses/SimulateKeyPresses';
import { Key } from 'src/types';
import { sleep } from 'src/utils';

import styles from './OpenTezDemo.css';

export interface IOpenTezDemoProps {
  id?: string;
  onDone?: () => void;
  visible?: boolean;
}

export interface IOpenTezDemoState {
  isCommandActive: boolean;
  isShiftActive: boolean;
  isSpaceActive: boolean;
}

export default class OpenTezDemo extends React.Component<
  IOpenTezDemoProps,
  IOpenTezDemoState
> {
  private simulateKeyPressesRef = createRef<SimulateKeyPresses>();

  constructor(props: IOpenTezDemoProps) {
    super(props);

    this.state = {
      isCommandActive: false,
      isShiftActive: false,
      isSpaceActive: false,
    };
  }

  componentDidMount() {
    const { visible = true } = this.props;

    if (visible) {
      this.simulateKeyPresses();
    }
  }

  componentDidUpdate(prevProps: IOpenTezDemoProps) {
    const { visible = true } = this.props;
    const { visible: prevPropsVisible = true } = prevProps;

    if (!prevPropsVisible && visible) {
      this.simulateKeyPresses();
    }
  }

  private async simulateKeyPresses() {
    await sleep(1000);
    this.simulateKeyPressesRef.current?.simulateKeyPresses();
  }

  public render() {
    const { visible, id = 'open-tez-demo', onDone } = this.props;

    return (
      <div
        id={id}
        className={cx(styles['open-tez-demo'], {
          [styles['visible']]: visible,
        })}
      >
        <div>Press these keys together to open (and hide) the popup.</div>
        <ConnectedSimulateKeyPresses
          interactionType={InteractionType.COMBO}
          keyPresses={[Key.META, Key.SHIFT, Key.SPACE]}
          onDone={onDone}
          autoStart={false}
          ref={this.simulateKeyPressesRef}
        />
      </div>
    );
  }
}
