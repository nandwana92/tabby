import { connect, ConnectedProps } from 'react-redux';
import React from 'react';
import cx from 'classnames';
import Fuse from 'fuse.js';

import KeyboardShortcuts from 'src/components/KeyboardShortcuts/KeyboardShortcuts';
import NoResults from 'src/components/NoResults/NoResults';
import TabList from 'src/components/TabList/TabList';
import SearchBox from 'src/components/SearchBox/SearchBox';
import { updateIsChromeOnSteroidsVisibleFlagValue } from 'src/actions';
import { IAppState, ModeTypes } from 'src/types';
import { transformIntoFuseResultLikeShape } from 'src/utils';
import { fuseOptions } from 'src/config';
import {
  ActionTypes,
  AUDIBLE_TABS_POLL_FREQUENCY_IN_MS,
  consoleCommands,
} from 'src/constants';

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

export interface IRootProps {
  isEmbedded?: boolean;
}

type TAllProps = PropsFromRedux & IRootProps;

export interface IRootState {
  searchInputValue: string;
  modeType: ModeTypes;
  tabs: Fuse.FuseResult<chrome.tabs.Tab>[];
  fuzzySearchResults: Fuse.FuseResult<chrome.tabs.Tab>[];
  consoleModeFuzzySearchResults: Fuse.FuseResult<string>[];
}

export class Root extends React.Component<TAllProps, IRootState> {
  private consoleModeFuse = new Fuse<string, {}>(consoleCommands);
  private fuse = new Fuse<chrome.tabs.Tab, {}>([], fuseOptions);
  private pollingItervalId: NodeJS.Timeout | null = null;

  constructor(props: TAllProps) {
    super(props);

    this.state = {
      searchInputValue: '',
      tabs: [],
      modeType: ModeTypes.DEFAULT,
      fuzzySearchResults: [],
      consoleModeFuzzySearchResults: [],
    };

    this.registerListeners();
    this.getTabs();
  }

  componentDidMount() {
    const { updateIsChromeOnSteroidsVisibleFlagValue } = this.props;

    // TODO Not quite sure why this has to be done. But without causing this
    // forced deferred execution, the invisible to visible CSS transitions
    // aren't working. Need to investigate this.
    setTimeout(() => {
      updateIsChromeOnSteroidsVisibleFlagValue(true);
    }, 0);
  }

  componentDidUpdate(prevProps: TAllProps, prevState: IRootState) {
    if (
      !prevProps.isChromeOnSteroidsVisible &&
      this.props.isChromeOnSteroidsVisible
    ) {
      // debugger;
    }

    if (prevProps.showAudibleTabsOnly !== this.props.showAudibleTabsOnly) {
      this.getTabs();
    }
  }

  private registerListeners() {
    chrome.runtime.onMessage.addListener((request) => {
      const { type } = request;

      switch (type) {
        case ActionTypes.TOGGLE_VISIBILITY: {
          this.togglePopupContainerVisibility();

          break;
        }

        case ActionTypes.GET_TABS_SUCCESS: {
          const { searchInputValue } = this.state;
          const { data: tabs } = request;
          this.fuse = new Fuse(tabs, fuseOptions);

          if (this.state.searchInputValue.trim() !== '') {
            this.setState({
              tabs: transformIntoFuseResultLikeShape(tabs),
              fuzzySearchResults: this.fuse.search<chrome.tabs.Tab>(
                searchInputValue
              ),
            });
          } else {
            this.setState({
              tabs: transformIntoFuseResultLikeShape(tabs),
              fuzzySearchResults: [],
            });
          }

          break;
        }

        // This is not being used right now, as the polling takes care of
        // updating the state.
        case ActionTypes.MUTE_TOGGLED: {
          this.getTabs();

          break;
        }
      }
    });
  }

  // TODO: This is an unused method. I am still not decided on whether polling
  // is a good idea. So letting this stay for the time being. Decide on this soon.
  private startPollingAudibleTabs() {
    this.pollingItervalId = setInterval(
      this.getTabs,
      AUDIBLE_TABS_POLL_FREQUENCY_IN_MS
    );
  }

  private getTabs() {
    chrome.runtime.sendMessage({ type: ActionTypes.GET_TABS_REQUEST });
  }

  private togglePopupContainerVisibility() {
    const {
      updateIsChromeOnSteroidsVisibleFlagValue,
      isChromeOnSteroidsVisible,
    } = this.props;

    updateIsChromeOnSteroidsVisibleFlagValue(!isChromeOnSteroidsVisible);
  }

  private onSearchBoxInputChange = (value: string) => {
    const trimmedSearchInputValue = value.trim();
    const startsWithRightAngleBracket =
      trimmedSearchInputValue.indexOf('>') === 0;
    const modeType = startsWithRightAngleBracket
      ? ModeTypes.CONSOLE
      : ModeTypes.DEFAULT;

    this.setState(
      {
        searchInputValue: value,
        modeType,
      },
      () => {
        if (this.state.modeType === ModeTypes.DEFAULT) {
          this.getTabs();
        } else {
          const trimmedSearchInputValue = this.state.searchInputValue.trim();
          const consoleModeSearchQuery = trimmedSearchInputValue.substring(1);
          const consoleModeFuzzySearchResults = this.consoleModeFuse.search(
            consoleModeSearchQuery
          );

          this.setState({
            consoleModeFuzzySearchResults,
          });
        }
      }
    );
  };

  private getActualSearchQuery(): string {
    const { modeType, searchInputValue } = this.state;
    const trimmedSearchInputValue = searchInputValue.trim();

    if (modeType === ModeTypes.CONSOLE) {
      const consoleModeSearchQuery = trimmedSearchInputValue.substring(1);

      return consoleModeSearchQuery;
    } else {
      return trimmedSearchInputValue;
    }
  }

  private areFiltersApplied(): boolean {
    const { modeType } = this.state;
    const { showAudibleTabsOnly } = this.props;
    const actualSearchQuery = this.getActualSearchQuery();

    if (modeType === ModeTypes.CONSOLE) {
      return actualSearchQuery.length > 0;
    } else {
      return actualSearchQuery.length > 0 || showAudibleTabsOnly;
    }
  }

  private getResultsComponent(): React.ReactNode | null {
    const { modeType } = this.state;
    const areFiltersApplied = this.areFiltersApplied();
    const actualSearchQuery = this.getActualSearchQuery();
    const isSearchQueryPresent = actualSearchQuery.length > 0;

    if (modeType === ModeTypes.CONSOLE) {
      const { consoleModeFuzzySearchResults } = this.state;
      const nonEmptyResults = consoleModeFuzzySearchResults.length > 0;

      return nonEmptyResults ? (
        <KeyboardShortcuts />
      ) : areFiltersApplied ? (
        <NoResults modeType={modeType} />
      ) : null;
    } else {
      const { tabs, fuzzySearchResults } = this.state;
      const { showAudibleTabsOnly } = this.props;

      const filteredTabs = (isSearchQueryPresent
        ? fuzzySearchResults
        : tabs
      ).filter((item) => !showAudibleTabsOnly || item.item.audible);

      const nonEmptyResults = filteredTabs.length > 0;

      return nonEmptyResults ? (
        <TabList tabs={filteredTabs} />
      ) : areFiltersApplied ? (
        <NoResults modeType={modeType} />
      ) : null;
    }
  }

  public render() {
    const { isChromeOnSteroidsVisible, isEmbedded = false } = this.props;
    const resultsComponent = this.getResultsComponent();
    const resultsSectionVisible = resultsComponent !== null;

    return (
      <div
        className={cx([
          styles['container'],
          {
            [styles['visible']]: isChromeOnSteroidsVisible,
            [styles['full-screen-mode']]: !isEmbedded,
            [styles['embed']]: isEmbedded,
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
          {resultsComponent}
        </div>
      </div>
    );
  }
}

export default connector(Root);
