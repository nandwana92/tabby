import { connect, ConnectedProps } from 'react-redux';
import * as React from 'react';
import cx from 'classnames';

import { iconUrls } from 'src/constants';
import { IAppState } from 'src/types';

import styles from './KeyboardShortcuts.css';

const mapState = (state: IAppState) => ({
  keyboardShortcuts: state.keyboardShortcuts,
});

const connector = connect(mapState);

type PropsFromRedux = ConnectedProps<typeof connector>;

export interface IKeyboardShortcutsProps {
  className?: string;
}

type TAllProps = PropsFromRedux & IKeyboardShortcutsProps;

export class KeyboardShortcuts extends React.PureComponent<TAllProps> {
  public render() {
    const { keyboardShortcuts, className } = this.props;

    return (
      <div className={cx(styles['keyboard-shortcuts'], className)}>
        <img className={styles['illustration']} src={iconUrls.keyboard} />
        <table>
          <tbody>
            {keyboardShortcuts.map((item, index) => {
              return (
                <tr className={styles['list-item']} key={index}>
                  <td
                    dangerouslySetInnerHTML={{
                      __html: item.label,
                    }}
                  ></td>
                  <td
                    dangerouslySetInnerHTML={{
                      __html: item.shortcut,
                    }}
                  ></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
}

export default connector(KeyboardShortcuts);
