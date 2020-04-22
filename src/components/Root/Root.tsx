import React, { createRef } from 'react';
import cx from 'classnames';
import Fuse from 'fuse.js';

import ToggleSwitch from '../ToggleSwitch/ToggleSwitch';
import EqualizerVisualization from '../EqualizerVisualization/EqualizerVisualization';
import {
  getFilenameFromURL,
  getWebsiteIconPathFromFilename,
  highlight,
} from './../../utils';
import styles from './Root.css';
import {
  actionTypes,
  iconUrls,
  AUDIBLE_TABS_POLL_FREQUENCY_IN_MS,
} from './../../constants';

const fuseOptions = {
  includeScore: true,
  includeMatches: true,
  keys: ['url', 'title'],
};

export interface ITabWithHighlightedText extends chrome.tabs.Tab {
  titleHighlighted?: string;
  urlHighlighted?: string;
}

export interface IRootProps {}

export interface IRootState {
  isVisible: boolean;
  showOnlyAudible: boolean;
  searchInputValue: string;
  tabs: chrome.tabs.Tab[];
}

export default class Root extends React.Component<IRootProps, IRootState> {
  private inputElementRef = createRef<HTMLInputElement>();
  private tab: chrome.tabs.Tab | null = null;
  private pollingItervalId: NodeJS.Timeout | null = null;

  constructor(props: IRootProps) {
    super(props);

    this.state = {
      isVisible: false,
      searchInputValue: '',
      tabs: [],
      showOnlyAudible: false,
    };

    this.getParentTabId();
    this.registerListeners();
    this.findAudibleTabs();
  }

  registerListeners() {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      const { type } = request;

      switch (type) {
        case actionTypes.TOGGLE_VISIBILITY: {
          this.togglePopupContainerVisibility();

          break;
        }

        case actionTypes.GET_ACTIVE_TAB_SUCCESS: {
          const { data: tab } = request;
          this.tab = tab;

          break;
        }

        case actionTypes.GET_TABS_SUCCESS: {
          const { data: tabs } = request;
          this.setTabsDataInState(tabs);

          break;
        }

        case actionTypes.MUTE_TOGGLED: {
          const { data: tab } = request;
          this.findAudibleTabs();

          break;
        }
      }
    });
  }

  dispatchtoggleVisibilityAction() {
    chrome.runtime.sendMessage({
      type: actionTypes.DISPATCH_TOGGLE_VISIBILITY,
    });
  }

  getParentTabId() {
    chrome.runtime.sendMessage({ type: actionTypes.GET_ACTIVE_TAB_REQUEST });
  }

  setTabsDataInState(tabs: chrome.tabs.Tab[]) {
    this.setState({
      tabs,
    });
  }

  startPollingAudibleTabs() {
    this.findAudibleTabs();

    this.pollingItervalId = setInterval(
      this.findAudibleTabs,
      AUDIBLE_TABS_POLL_FREQUENCY_IN_MS
    );
  }

  findAudibleTabs() {
    chrome.runtime.sendMessage({ type: actionTypes.GET_TABS_REQUEST });
  }

  focusPopupInput() {
    const node = this.inputElementRef.current;

    if (node) {
      // FIXME: setTimeout should not be needed. But due to some reason if the visiblity
      // property is being animated, input element focus isn't working.

      setTimeout(() => {
        node.focus();
      }, 200);
    }
  }

  togglePopupContainerVisibility() {
    this.setState(
      {
        isVisible: !this.state.isVisible,
      },
      () => {
        if (this.state.isVisible) {
          this.focusPopupInput();
          this.startPollingAudibleTabs();
        } else {
          clearInterval(this.pollingItervalId);
        }
      }
    );
  }

  setActiveTab(tabId) {
    chrome.runtime.sendMessage({
      type: actionTypes.SET_ACTIVE_TAB,
      tabId,
    });
  }

  updateMutedState(tabId: number, muted: boolean) {
    chrome.runtime.sendMessage({
      type: actionTypes.TOGGLE_MUTE,
      tabId,
      muted,
    });
  }

  handleGoToTabButtonClick = (tab: chrome.tabs.Tab) => () => {
    chrome.runtime.sendMessage({
      type: actionTypes.SET_FOCUSSED_WINDOW,
      windowId: tab.windowId,
    });

    this.setActiveTab(tab.id);
    this.dispatchtoggleVisibilityAction();
  };

  handleToggleMuteButtonClick = (tab) => (
    e: React.SyntheticEvent<HTMLElement>
  ) => {
    e.stopPropagation();

    if (tab) {
      const { muted } = tab.mutedInfo;
      const updatedMutedValue = !muted;

      this.updateMutedState(tab.id, updatedMutedValue);
    }
  };

  handleSearchInputChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
    const element = e.target as HTMLInputElement;
    const value = element.value;

    // TODO: Handle sanitization of value, thing such as string trim, etc.
    this.setState({
      searchInputValue: value,
    });
  };

  handleAudibleOnlySwitchChange = (checked) => {
    this.setState({
      showOnlyAudible: checked,
    });
  };

  public render() {
    const filteredTabs = this.state.showOnlyAudible
      ? this.state.tabs.filter((tab) => {
          return tab.audible;
        })
      : this.state.tabs;

    const isSearchQueryPresent = this.state.searchInputValue.length > 0;
    let fuseFuzzySearchResults: ITabWithHighlightedText[];

    if (isSearchQueryPresent) {
      const fuse = new Fuse(filteredTabs, fuseOptions);

      fuseFuzzySearchResults = highlight(
        fuse.search(this.state.searchInputValue),
        styles['highlight']
      );
    } else {
      fuseFuzzySearchResults = filteredTabs as ITabWithHighlightedText[];
    }

    const isFilterApplied = this.state.showOnlyAudible || isSearchQueryPresent;

    return (
      <div
        className={cx([
          styles['container'],
          {
            [styles['visible']]: this.state.isVisible,
          },
        ])}
      >
        <div className={styles['popup']}>
          <div
            className={cx(styles['input-container'], {
              [styles['results-section-visible']]:
                filteredTabs.length > 0 || isFilterApplied,
            })}
          >
            <img className={styles['input-icon']} src={iconUrls.search} />
            <input
              onChange={this.handleSearchInputChange}
              ref={this.inputElementRef}
              placeholder="Search"
              type="text"
              value={this.state.searchInputValue}
            />
            <ToggleSwitch
              className={styles['audible-only-switch']}
              onChange={this.handleAudibleOnlySwitchChange}
            />
            <div className={styles['audible-only-switch-label-container']}>
              <div className={styles['audible-only-switch-label']}>
                AUDIBLE TABS ONLY
              </div>
              <EqualizerVisualization
                className={cx(styles['equalizer-visualization'], {
                  [styles['visible']]: this.state.showOnlyAudible,
                })}
                barWidth={8}
                barHeight={32}
                numberOfBars={10}
                transitionDuration={250}
                startHeight={10}
              />
            </div>
          </div>
          {fuseFuzzySearchResults.length > 0 ? (
            <ul className={styles['tab-list']}>
              {fuseFuzzySearchResults.map((result) => {
                const item = result;
                const { muted } = item.mutedInfo;
                const showAudibleIcon = item.audible;
                const iconUrl = muted ? iconUrls.mute : iconUrls.volume;
                const websiteIconFilename = getFilenameFromURL(item.url);
                const websiteIconFilePath =
                  websiteIconFilename !== 'default' || !item.favIconUrl
                    ? getWebsiteIconPathFromFilename(websiteIconFilename)
                    : item.favIconUrl;

                return (
                  <li key={item.id} className={styles['item']}>
                    {showAudibleIcon ? (
                      <button
                        onClick={this.handleToggleMuteButtonClick(item)}
                        className={styles['toggle-mute-button']}
                      >
                        <div className={styles['list-item-icon-container']}>
                          <img
                            className={styles['list-item-icon']}
                            src={iconUrl}
                          />
                        </div>
                      </button>
                    ) : null}
                    <a
                      className={cx(styles['unstyled-anchor-tag'])}
                      href="#"
                      tabIndex={0}
                      role="button"
                      onClick={this.handleGoToTabButtonClick(item)}
                    >
                      <img
                        className={styles['website-icon']}
                        src={websiteIconFilePath}
                      />
                      <div className={styles['title-and-url-container']}>
                        <div
                          dangerouslySetInnerHTML={{
                            __html: item.titleHighlighted || item.title,
                          }}
                        ></div>
                        <div
                          className={cx(
                            styles['tab-url'],
                            styles['truncate-text']
                          )}
                          dangerouslySetInnerHTML={{
                            __html: item.urlHighlighted || item.url,
                          }}
                        ></div>
                      </div>
                    </a>
                  </li>
                );
              })}
            </ul>
          ) : isFilterApplied ? (
            <div className={styles['no-results-found']}>
              <img
                className={styles['illustration']}
                src={iconUrls.noResultsFound}
              />
              <div className={styles['text']}>no matching tabs found</div>
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}
