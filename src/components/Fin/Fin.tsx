import * as React from 'react';
import cx from 'classnames';

import { iconUrls } from 'src/constants';
import KeyboardShortcuts from 'src/components/KeyboardShortcuts/KeyboardShortcuts';
import { sleep } from 'src/utils';

import styles from './Fin.css';

export interface IFinProps {
  id?: string;
  onDone?: () => void;
  visible?: boolean;
}

export interface IFinState {}

export default class Fin extends React.Component<IFinProps, {}> {
  constructor(props: IFinProps) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    const { visible = true } = this.props;

    if (visible) {
      this.onDone();
    }
  }

  componentDidUpdate(prevProps: IFinProps) {
    const { visible = true } = this.props;
    const { visible: prevPropsVisible = true } = prevProps;

    if (!prevPropsVisible && visible) {
      this.onDone();
    }
  }

  private onDone = async () => {
    const { onDone } = this.props;

    if (typeof onDone === 'function') {
      await sleep(1000);
      onDone();
    }
  };

  public render() {
    const { visible, id = 'fin' } = this.props;

    return (
      <div
        id={id}
        className={cx(styles['fin'], {
          [styles['visible']]: visible,
        })}
      >
        <div>That's it. Here's a list of all the shortcuts together.</div>
        <KeyboardShortcuts className={styles['keyboard-shortcuts']} />
        For any feature requests or bugs, please checkout the
        <a
          className={cx(styles['repo-link'], styles['unstyled-anchor-tag'])}
          target="_blank"
          href="https://github.com/nandwana92/tez"
        >
          GitHub page
        </a>
        . If you like the extension, please
        <img className={styles['illustration']} src={iconUrls.star} />
        the repo. Have fun. 🤲🏼.
      </div>
    );
  }
}
