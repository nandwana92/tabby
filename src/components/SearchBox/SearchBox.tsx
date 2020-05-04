import React, { createRef } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import cx from 'classnames';
import debounce from 'lodash/debounce';
import { Cancelable } from 'lodash';

import ShowOnlyAudibleTabsToggle from 'src/components/ShowOnlyAudibleTabsToggle/ShowOnlyAudibleTabsToggle';
import { updateSearchInputValue } from 'src/actions';
import { iconUrls } from 'src/constants';
import { IAppState } from 'src/types';

import styles from './SearchBox.css';

const mapState = (state: IAppState) => ({
  isChromeOnSteroidsVisible: state.isChromeOnSteroidsVisible,
  searchInputValue: state.searchInputValue,
});

const mapDispatch = {
  updateSearchInputValue,
};

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

export interface ISearchBoxProps {
  className?: string;
  onSearchBoxInputChange?: (value: string) => void;
}

export interface ISearchBoxState {
  searchInputValue: string;
}

type TAllProps = PropsFromRedux & ISearchBoxProps;

export class SearchBox extends React.Component<TAllProps, ISearchBoxState> {
  private inputElementRef = createRef<HTMLInputElement>();
  private onSearchBoxInputChangeDebounced:
    | undefined
    | (((value: string) => void) & Cancelable);

  constructor(props: TAllProps) {
    super(props);

    if (typeof props.onSearchBoxInputChange === 'function') {
      this.onSearchBoxInputChangeDebounced = debounce<(value: string) => void>(
        props.onSearchBoxInputChange,
        200,
        {
          leading: true,
        }
      );
    }

    this.state = {
      searchInputValue: '',
    };
  }

  componentDidUpdate(prevProps: TAllProps, prevState: ISearchBoxState) {
    const { searchInputValue: prevPropsSearchInputValue } = prevProps;
    const { searchInputValue: propsSearchInputValue } = this.props;

    if (
      prevProps.isChromeOnSteroidsVisible !==
      this.props.isChromeOnSteroidsVisible
    ) {
      if (this.props.isChromeOnSteroidsVisible) {
        this.focusInput();
      } else {
        this.setState(
          {
            searchInputValue: '',
          },
          this.callOnSearchBoxInputChangeDebounced
        );
      }
    }

    if (propsSearchInputValue !== prevPropsSearchInputValue) {
      this.callOnSearchBoxInputChangeDebounced();
    }
  }

  private callOnSearchBoxInputChangeDebounced = () => {
    if (typeof this.onSearchBoxInputChangeDebounced === 'function') {
      this.onSearchBoxInputChangeDebounced(this.getInputValue());
    }
  };

  private focusInput() {
    const node = this.inputElementRef.current;

    if (node) {
      // FIXME: setTimeout should not be needed. But due to some reason if the visiblity
      // property is being animated, input element focus isn't working.

      setTimeout(() => {
        node.focus();
      }, 200);
    }
  }

  private handleSearchBoxInputChange = (
    e: React.SyntheticEvent<HTMLInputElement>
  ) => {
    const {
      updateSearchInputValue,
      searchInputValue: propsSearchInputValue,
    } = this.props;

    if (propsSearchInputValue.length > 0) {
      updateSearchInputValue('');
    }

    const element = e.target as HTMLInputElement;
    const searchInputValue = element.value;
    const trimmedPreviousValue = this.state.searchInputValue.trim();

    this.setState(
      {
        searchInputValue,
      },
      () => {
        const trimmedNextValue = this.state.searchInputValue.trim();

        if (trimmedNextValue !== trimmedPreviousValue) {
          // If after stripping the leading and trailing whitespace from the
          // previous and current value of the input, the comparison says there
          // is a change do something.

          this.callOnSearchBoxInputChangeDebounced();
        }
      }
    );
  };

  private getInputValue = (): string => {
    const { searchInputValue: propsSearchInputValue } = this.props;
    const { searchInputValue } = this.state;

    if (searchInputValue.length > 0) {
      return searchInputValue;
    }

    return propsSearchInputValue;
  };

  public render() {
    const { className } = this.props;
    const searchInputValue = this.getInputValue();

    return (
      <div className={cx(styles['search-box'], className)}>
        <img className={styles['input-icon']} src={iconUrls.search} />
        <input
          className={cx(
            styles['unstyled-input-element'],
            styles['input'],
            'mousetrap'
          )}
          onChange={this.handleSearchBoxInputChange}
          ref={this.inputElementRef}
          placeholder="Search"
          type="text"
          value={searchInputValue}
        />
        <ShowOnlyAudibleTabsToggle />
      </div>
    );
  }
}

export default connector(SearchBox);
