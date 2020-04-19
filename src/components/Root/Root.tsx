import React, { createRef } from 'react';
import cx from 'classnames';

import ToggleSwitch from '../ToggleSwitch/ToggleSwitch';
import EqualizerVisualization from '../EqualizerVisualization/EqualizerVisualization';
import {
  getFilenameFromURL,
  getWebsiteIconPathFromFilename,
} from './../../utils';
import styles from './Root.css';
import {
  actionTypes,
  iconUrls,
  AUDIBLE_TABS_POLL_FREQUENCY_IN_MS,
} from './../../constants';

export interface IRootProps {}

export interface IRootState {
  isVisible: boolean;
  audibleTabs: chrome.tabs.Tab[];
  showOnlyAudible: boolean;
}

export default class Root extends React.Component<IRootProps, IRootState> {
  private inputElementRef = createRef<HTMLInputElement>();
  private tab: chrome.tabs.Tab | null = null;

  constructor(props: IRootProps) {
    super(props);

    this.state = {
      isVisible: false,
      audibleTabs: [],
      showOnlyAudible: false,
    };

    this.getParentTabId();
    this.registerListeners();
    this.findAudibleTabs();
    this.pollAudibleTabs();
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
          this.logAudibleTabsToConsole(tabs);

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

  logAudibleTabsToConsole(tabs: chrome.tabs.Tab[]) {
    const audibleTabs = tabs.filter((tab) => {
      return true;
    });

    this.setState({
      audibleTabs,
    });
  }

  pollAudibleTabs() {
    setInterval(() => {
      this.findAudibleTabs();
    }, AUDIBLE_TABS_POLL_FREQUENCY_IN_MS);
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

  handleAudibleOnlySwitchChange = (checked) => {
    this.setState({
      showOnlyAudible: checked,
    });
  };

  public render() {
    const filteredList = this.state.audibleTabs.filter((item) => {
      return this.state.showOnlyAudible ? item.audible : true;
    });

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
          <div className={styles['input-container']}>
            <img className={styles['input-icon']} src={iconUrls.search} />
            <input
              ref={this.inputElementRef}
              placeholder="Search (wip)"
              type="text"
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
          {filteredList.length > 0 ? (
            <ul className={styles['tab-list']}>
              {filteredList.map((item) => {
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
                    <a
                      className={cx(styles['unstyled-anchor-tag'])}
                      href="#"
                      tabIndex={0}
                      role="button"
                      onClick={this.handleGoToTabButtonClick(item)}
                    >
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
                      <img
                        className={styles['website-icon']}
                        src={websiteIconFilePath}
                      />
                      <span>{item.title}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          ) : null}
        </div>
      </div>
    );
  }
}
