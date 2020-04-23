import React, { createRef } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import cx from 'classnames';
import throttle from 'lodash/throttle';
import { Cancelable } from 'lodash';

import ShowOnlyAudibleTabsToggle from 'src/components/ShowOnlyAudibleTabsToggle/ShowOnlyAudibleTabsToggle';
import { iconUrls } from 'src/constants';
import { IAppState } from 'src/types';

import styles from './SearchBox.css';

const mapState = (state: IAppState) => ({
  isChromeOnSteroidsVisible: state.isChromeOnSteroidsVisible,
});

const connector = connect(mapState, {});

type PropsFromRedux = ConnectedProps<typeof connector>;

export interface ISearchBoxProps {
  className?: string;
  onSearchBoxInputChange?: (value: string) => void;
}

export interface ISearchBoxState {
  inputValue: string;
}

type TAllProps = PropsFromRedux & ISearchBoxProps;

export class SearchBox extends React.Component<TAllProps, ISearchBoxState> {
  private inputElementRef = createRef<HTMLInputElement>();
  private onSearchBoxInputChangeThrottled:
    | undefined
    | (((value: string) => void) & Cancelable);

  constructor(props: TAllProps) {
    super(props);

    if (typeof props.onSearchBoxInputChange === 'function') {
      this.onSearchBoxInputChangeThrottled = throttle<(value: string) => void>(
        props.onSearchBoxInputChange,
        100
      );
    }

    this.state = {
      inputValue: '',
    };
  }

  componentDidUpdate(prevProps: TAllProps, prevState: ISearchBoxState) {
    if (
      prevProps.isChromeOnSteroidsVisible !==
      this.props.isChromeOnSteroidsVisible
    ) {
      if (this.props.isChromeOnSteroidsVisible) {
        this.focusInput();
      }
    }
  }

  focusInput() {
    const node = this.inputElementRef.current;

    if (node) {
      // FIXME: setTimeout should not be needed. But due to some reason if the visiblity
      // property is being animated, input element focus isn't working.

      setTimeout(() => {
        node.focus();
      }, 200);
    }
  }

  handleSearchBoxInputChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
    const { onSearchBoxInputChange } = this.props;
    const element = e.target as HTMLInputElement;
    const inputValue = element.value;
    const trimmedPreviousValue = this.state.inputValue.trim();

    this.setState(
      {
        inputValue,
      },
      () => {
        const trimmedNextValue = this.state.inputValue.trim();

        if (trimmedNextValue !== trimmedPreviousValue) {
          // If after stripping the leading and trailing whitespace from the
          // previous and current value of the input, the comparison says there
          // is change do something.

          if (typeof this.onSearchBoxInputChangeThrottled === 'function') {
            this.onSearchBoxInputChangeThrottled(this.state.inputValue);
          }
        }
      }
    );
  };

  public render() {
    const { className } = this.props;

    return (
      <div className={cx(styles['search-box'], className)}>
        <img className={styles['input-icon']} src={iconUrls.search} />
        <input
          className={cx(styles['unstyled-input-element'], styles['input'])}
          onChange={this.handleSearchBoxInputChange}
          ref={this.inputElementRef}
          placeholder="Search"
          type="text"
          value={this.state.inputValue}
        />
        <ShowOnlyAudibleTabsToggle />
      </div>
    );
  }
}

export default connector(SearchBox);
