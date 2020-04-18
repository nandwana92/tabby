import React, { createRef } from 'react';
import cx from 'classnames';

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
}

export default class Root extends React.Component<IRootProps, IRootState> {
  private inputElementRef = createRef<HTMLInputElement>();

  constructor(props: IRootProps) {
    super(props);

    this.state = {
      isVisible: false,
      audibleTabs: [],
    };

    this.registerListeners();
    this.findAudibleTabs();
    this.pollAudibleTabs();
  }

  registerListeners() {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      const { type } = request;

      switch (type) {
        case actionTypes.TOGGLE_VISIBILITY:
          this.togglePopupContainerVisibility();

          break;

        case actionTypes.GET_TABS_SUCCESS:
          const { data: tabs } = request;
          this.logAudibleTabsToConsole(tabs);

          break;

        case actionTypes.MUTE_TOGGLED:
          const { data: tab } = request;
          this.findAudibleTabs();

          break;
      }
    });
  }

  logAudibleTabsToConsole(tabs: chrome.tabs.Tab[]) {
    const audibleTabs = tabs.filter((tab) => {
      return tab.audible;
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

  updateMutedState(tabId: number, muted: boolean) {
    chrome.runtime.sendMessage({
      type: actionTypes.TOGGLE_MUTE,
      tabId,
      muted,
    });
  }

  handleListItemClick = (tab) => () => {
    if (tab) {
      const { muted } = tab.mutedInfo;
      const updatedMutedValue = !muted;

      this.updateMutedState(tab.id, updatedMutedValue);
    }
  };

  public render() {
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
          </div>
          {this.state.audibleTabs.length > 0 ? (
            <ul className={styles['tab-list']}>
              {this.state.audibleTabs.map((item) => {
                const { muted } = item.mutedInfo;
                const iconUrl = muted ? iconUrls.mute : iconUrls.volume;

                return (
                  <li key={item.id} className={styles['item']}>
                    <button
                      onClick={this.handleListItemClick(item)}
                      className={styles['toggle-mute-button']}
                    >
                      <div className={styles['list-item-icon-container']}>
                        <img
                          className={styles['list-item-icon']}
                          src={iconUrl}
                        />
                      </div>
                    </button>
                    <span>{item.title}</span>
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
