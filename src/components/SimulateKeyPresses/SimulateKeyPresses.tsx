import { connect, ConnectedProps } from 'react-redux';
import React, { createRef, RefObject } from 'react';
import cx from 'classnames';

import { Key, IAppState } from 'src/types';
import {
  modifierKeysToClassMapping,
  keysToClassMapping,
  ModifierKey,
  iconUrls,
} from 'src/constants';
import keysStyles from 'src/keys.css';

import styles from './SimulateKeyPresses.css';
import { sleep } from 'src/utils';

const mapState = (state: IAppState) => ({
  platformInfo: state.platformInfo,
});

const connector = connect(mapState, null, null, {
  forwardRef: true,
});

type PropsFromRedux = ConnectedProps<typeof connector>;

export enum InteractionType {
  COMBO = 'COMBO',
  SEQUENTIAL = 'SEQUENTIAL',
}

export enum KeysLayout {
  HORIZONTAL = 'HORIZONTAL',
  VERTICAL = 'VERTICAL',
}

export interface ISimulateKeyPressesProps {
  interactionType: InteractionType;
  keyPresses: Key[];
  keysLayout: KeysLayout;
  numberOfLoops: number;
  delayBetweenKeypresses: number;
  delayBetweenLoopIterations: number;
  pressKeyFor: number;
  autoStart: boolean;
  ref: RefObject<SimulateKeyPresses>;
  onDone?: () => void;
}

export interface ISimulateKeyPressesState {
  [x: string]: boolean;
}

type TAllProps = PropsFromRedux & ISimulateKeyPressesProps;

export class SimulateKeyPresses extends React.Component<
  TAllProps,
  ISimulateKeyPressesState
> {
  public static defaultProps = {
    keysLayout: KeysLayout.HORIZONTAL,
    numberOfLoops: 1,
    delayBetweenKeypresses: 1000,
    pressKeyFor: 200,
    delayBetweenLoopIterations: 500,
    autoStart: true,
    ref: createRef<SimulateKeyPresses>(),
  };

  constructor(props: TAllProps) {
    super(props);

    this.state = this.getInitialState();
  }

  componentDidMount() {
    const { autoStart } = this.props;

    if (autoStart) {
      this.simulateKeyPresses();
    }
  }

  componentDidUpdate(
    prevProps: TAllProps,
    prevState: ISimulateKeyPressesState
  ) {
    const { interactionType, keyPresses, onDone } = this.props;
    const keyCount = keyPresses.length;

    if (typeof onDone !== 'function') {
      return;
    }

    // If the interaction being simulated is of type "Combo", then the
    // flipping of last key's active state from false to true will imply the
    // combo being active as the key presses are in order.

    if (interactionType === InteractionType.COMBO && keyCount > 0) {
      const stringifiedLastIndex = keyCount - 1;
      const { [stringifiedLastIndex]: isKeyActive } = this.state;
      const { [stringifiedLastIndex]: prevStateIsKeyActive } = prevState;

      if (!prevStateIsKeyActive && isKeyActive) {
        onDone();
      }
    }
  }

  private getInitialState = (): ISimulateKeyPressesState => {
    const { keyPresses } = this.props;
    const initialState: ISimulateKeyPressesState = {};

    keyPresses.forEach((item, index) => {
      const stringifiedIndex = index.toString();
      initialState[stringifiedIndex] = false;
    });

    return initialState;
  };

  public simulateKeyPresses = async () => {
    const {
      keyPresses,
      interactionType,
      delayBetweenKeypresses,
      delayBetweenLoopIterations,
      pressKeyFor,
      numberOfLoops,
      onDone,
    } = this.props;
    await sleep(delayBetweenKeypresses);

    for (let i = 0; i < numberOfLoops; i++) {
      for (let j = 0; j < keyPresses.length; j++) {
        const stringifiedIndex = j.toString();

        if (interactionType === InteractionType.COMBO) {
          this.setState({
            [stringifiedIndex]: true,
          });
        } else if (interactionType === InteractionType.SEQUENTIAL) {
          await new Promise((resolve) =>
            this.setState(
              {
                [stringifiedIndex]: true,
              },
              resolve
            )
          );

          await sleep(pressKeyFor);

          await new Promise((resolve) =>
            this.setState(
              {
                [stringifiedIndex]: false,
              },
              resolve
            )
          );
        }

        await sleep(delayBetweenKeypresses);
      }

      if (i < numberOfLoops) {
        if (interactionType === InteractionType.COMBO) {
          this.setState(this.getInitialState());
        }

        await sleep(delayBetweenLoopIterations);
      }
    }

    if (
      interactionType === InteractionType.SEQUENTIAL &&
      typeof onDone === 'function'
    ) {
      onDone();
    }
  };

  private getKeyClass(key: Key): string {
    const { platformInfo } = this.props;
    const { os } = platformInfo;

    // If this key is one of the modifer keys, then grab the OS specific class
    // name from the key to class mapping for modifier keys. Otherwise, just get
    // the value from the regular key to class mapping hashmap.

    if (key in ModifierKey) {
      return modifierKeysToClassMapping[key][os];
    } else {
      return keysToClassMapping[key];
    }
  }

  public render() {
    const {
      keyPresses,
      keysLayout = KeysLayout.HORIZONTAL,
      interactionType,
    } = this.props;
    const keyCount = keyPresses.length;

    return (
      <div
        className={cx(styles['simulate-key-presses'], {
          [styles['vertical']]: keysLayout === KeysLayout.VERTICAL,
        })}
      >
        {keyPresses.map((item, index) => {
          const stringifiedIndex = index.toString();
          const { [stringifiedIndex]: isKeyActive } = this.state;
          const keyClass = this.getKeyClass(item);

          return (
            <React.Fragment key={index}>
              <span
                className={cx(
                  {
                    [keysStyles['keyboard-keydown']]: isKeyActive,
                  },
                  styles['keyboard-key'],
                  keysStyles['keyboard-key'],
                  keysStyles[keyClass]
                )}
              ></span>
              {index < keyCount - 1 ? (
                <img
                  className={cx(styles['plus'], {
                    [styles['invisible']]:
                      interactionType === InteractionType.SEQUENTIAL,
                  })}
                  src={iconUrls.plus}
                />
              ) : null}
            </React.Fragment>
          );
        })}
      </div>
    );
  }
}

export default connector(SimulateKeyPresses);
