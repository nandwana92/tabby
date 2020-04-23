import { connect, ConnectedProps } from 'react-redux';
import React from 'react';
import cx from 'classnames';
import Fuse from 'fuse.js';

import NoResults from 'src/components/NoResults/NoResults';
import TabList from 'src/components/TabList/TabList';
import SearchBox from 'src/components/SearchBox/SearchBox';
import { updateIsChromeOnSteroidsVisibleFlagValue } from 'src/actions';
import { IAppState, ITabWithHighlightedText } from 'src/types';
import { highlight } from 'src/utils';
import { fuseOptions } from 'src/config';
import { actionTypes, AUDIBLE_TABS_POLL_FREQUENCY_IN_MS } from 'src/constants';

import styles from './Root.css';

const mapState = (state: IAppState) => ({
  showAudibleTabsOnly: state.showAudibleTabsOnly,
  isChromeOnSteroidsVisible: state.isChromeOnSteroidsVisible,
});

const mapDispatch = {
  updateIsChromeOnSteroidsVisibleFlagValue,
};

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

export interface IRootProps {}

type TAllProps = PropsFromRedux & IRootProps;

export interface IRootState {
  searchInputValue: string;
  tabs: chrome.tabs.Tab[];
  highlightedFuzzySearchResults: ITabWithHighlightedText[];
}

export class Root extends React.Component<TAllProps, IRootState> {
  private fuse: Fuse<chrome.tabs.Tab, {}> = new Fuse([], fuseOptions);
  private pollingItervalId: NodeJS.Timeout | null = null;

  constructor(props: TAllProps) {
    super(props);

    this.state = {
      searchInputValue: '',
      tabs: [],
      highlightedFuzzySearchResults: [],
    };

    this.registerListeners();
    this.getTabs();
  }

  componentDidUpdate(prevProps: TAllProps, prevState: IRootProps) {
    if (
      prevProps.isChromeOnSteroidsVisible !==
      this.props.isChromeOnSteroidsVisible
    ) {
      if (this.props.isChromeOnSteroidsVisible) {
        this.startPollingAudibleTabs();
      } else {
        clearInterval(this.pollingItervalId);
      }
    }
  }

  registerListeners() {
    chrome.runtime.onMessage.addListener((request) => {
      const { type } = request;

      switch (type) {
        case actionTypes.TOGGLE_VISIBILITY: {
          this.togglePopupContainerVisibility();

          break;
        }

        case actionTypes.GET_TABS_SUCCESS: {
          const { data: tabs } = request;
          this.fuse = new Fuse(tabs, fuseOptions);

          if (this.state.searchInputValue.trim() !== '') {
            this.setState({
              tabs,
              highlightedFuzzySearchResults: this.getHighlightedFuzzySearchResults(
                this.state.searchInputValue
              ),
            });
          } else {
            this.setState({
              tabs,
              highlightedFuzzySearchResults: [],
            });
          }

          break;
        }

        // This is not being used right now, as the polling takes care of
        // updating the state.
        case actionTypes.MUTE_TOGGLED: {
          const { data: tab } = request;
          this.getTabs();

          break;
        }
      }
    });
  }

  getHighlightedFuzzySearchResults(pattern: string) {
    const fuzzySearchResults = this.fuse.search<chrome.tabs.Tab>(pattern);

    const highlightedFuzzySearchResults = highlight(
      fuzzySearchResults,
      styles['highlight']
    );

    return highlightedFuzzySearchResults;
  }

  startPollingAudibleTabs() {
    this.getTabs();

    this.pollingItervalId = setInterval(
      this.getTabs,
      AUDIBLE_TABS_POLL_FREQUENCY_IN_MS
    );
  }

  getTabs() {
    chrome.runtime.sendMessage({ type: actionTypes.GET_TABS_REQUEST });
  }

  togglePopupContainerVisibility() {
    const {
      updateIsChromeOnSteroidsVisibleFlagValue,
      isChromeOnSteroidsVisible,
    } = this.props;

    updateIsChromeOnSteroidsVisibleFlagValue(!isChromeOnSteroidsVisible);
  }

  onSearchBoxInputChange = (value) => {
    this.setState({
      searchInputValue: value,
      highlightedFuzzySearchResults: this.getHighlightedFuzzySearchResults(
        value
      ),
    });
  };

  public render() {
    const { showAudibleTabsOnly, isChromeOnSteroidsVisible } = this.props;
    const isSearchQueryPresent = this.state.searchInputValue.trim().length > 0;
    let listOfTabs: ITabWithHighlightedText[];

    if (isSearchQueryPresent) {
      listOfTabs = this.state.highlightedFuzzySearchResults;
    } else {
      listOfTabs = this.state.tabs as ITabWithHighlightedText[];
    }

    listOfTabs = showAudibleTabsOnly
      ? listOfTabs.filter((tab) => tab.audible)
      : listOfTabs;

    const isListEmpty = listOfTabs.length === 0;
    const isFilterApplied = showAudibleTabsOnly || isSearchQueryPresent;
    const resultsSectionVisible = listOfTabs.length > 0 || isFilterApplied;

    return (
      <div
        className={cx([
          styles['container'],
          {
            [styles['visible']]: isChromeOnSteroidsVisible,
          },
        ])}
      >
        <div className={styles['popup']}>
          <SearchBox
            className={cx({
              [styles['results-section-visible']]: resultsSectionVisible,
            })}
            onSearchBoxInputChange={this.onSearchBoxInputChange}
          />
          {!isListEmpty ? (
            <TabList listOfTabs={listOfTabs} />
          ) : isFilterApplied ? (
            <NoResults />
          ) : null}
        </div>
      </div>
    );
  }
}

export default connector(Root);
