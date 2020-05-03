import { connect, ConnectedProps } from 'react-redux';
import * as React from 'react';
import cx from 'classnames';

import { updateSearchInputValue } from 'src/actions';
import { IAppState } from 'src/types';
import { sleep } from 'src/utils';
import { keyLabels, ModifierKey } from 'src/constants';

import styles from './SimulatedSearch.css';

const mapState = (state: IAppState) => ({
  platformInfo: state.platformInfo,
});

const mapDispatch = {
  updateSearchInputValue,
};

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

export interface ISimulatedSearchProps {
  searchValue: string;
  searchTill: string;
  id?: string;
  onDone?: () => void;
  visible?: boolean;
}

export interface ISimulatedSearchState {
  searchedTillIndex: number;
  done: boolean;
}

type TAllProps = PropsFromRedux & ISimulatedSearchProps;

export class SimulatedSearch extends React.Component<
  TAllProps,
  ISimulatedSearchState
> {
  constructor(props: TAllProps) {
    super(props);

    this.state = {
      searchedTillIndex: -1,
      done: false,
    };
  }

  componentDidMount() {
    const { visible = true } = this.props;

    if (visible) {
      this.simulateSearch();
    }
  }

  componentDidUpdate(prevProps: TAllProps) {
    const { visible = true } = this.props;
    const { visible: prevPropsVisible = true } = prevProps;

    if (!prevPropsVisible && visible) {
      this.simulateSearch();
    }
  }

  private simulateSearch = async () => {
    await sleep(2000);
    const { updateSearchInputValue, searchTill, onDone } = this.props;
    let currentSearchTerm = '';

    for (let index = 0; index < this.props.searchValue.length; index++) {
      currentSearchTerm += this.props.searchValue[index];
      await sleep(750);
      this.setState({ searchedTillIndex: index });
      updateSearchInputValue(currentSearchTerm);
      if (currentSearchTerm === searchTill) {
        break;
      }
    }

    if (typeof onDone === 'function') {
      onDone();
      this.setState({
        done: true,
      });
    }
  };

  public render() {
    const { searchedTillIndex, done } = this.state;
    const {
      searchValue,
      visible,
      platformInfo,
      id = 'simulated-search',
    } = this.props;

    const { os } = platformInfo;
    const typed = searchValue.substring(0, searchedTillIndex + 1);
    const yetToBeTyped = searchValue.substring(searchedTillIndex + 1);

    return (
      <div
        id={id}
        className={cx(styles['simulated-search'], {
          [styles['visible']]: visible,
        })}
      >
        <div>
          Let's search for a tab now
          <span className={styles['search-value']}>
            <span className={styles['typed']}>{typed}</span>
            <span className={styles['yet-to-be-typed']}>{yetToBeTyped}</span>
          </span>
        </div>
        <div
          className={cx(styles['tip'], {
            [styles['visible']]: done,
          })}
        >
          You can now go to the tab, just click on any of the results. And if
          it's one of the first 9 results you can use the dedicated keyboard
          shortcut for it.
          <br />
          <br />
          Don't fret, press
          <span className={styles['jump-back-to-previous-tab-combo']}>
            <kbd>{keyLabels[ModifierKey.META][os]}</kbd>+<kbd>Shift</kbd>+
            <kbd>U</kbd>
          </span>
          and you can jump right back to this tab from the tab you will land at.
        </div>
      </div>
    );
  }
}

export default connector(SimulatedSearch);
