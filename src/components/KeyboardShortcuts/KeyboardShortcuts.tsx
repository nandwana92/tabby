import * as React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { iconUrls } from 'src/constants';
import { IAppState } from 'src/types';

import styles from './KeyboardShortcuts.css';

const mapState = (state: IAppState) => ({
  keyboardShortcuts: state.keyboardShortcuts,
});

const connector = connect(mapState, null);

type PropsFromRedux = ConnectedProps<typeof connector>;

export interface IKeyboardShortcutsProps {}

type TAllProps = PropsFromRedux & IKeyboardShortcutsProps;

export class KeyboardShortcuts extends React.PureComponent<TAllProps> {
  public render() {
    const { keyboardShortcuts } = this.props;

    return (
      <div className={styles['keyboard-shortcuts']}>
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
