import * as React from 'react';
import cx from 'classnames';

import { actionTypes } from 'src/constants';

import styles from './TabListItem.css';

export interface ITabListItemProps {
  showAudibleIcon: boolean;
  item: any;
  iconUrl: any;
  websiteIconFilePath: any;
}

export interface ITabListItemState {}

export default class TabListItem extends React.Component<
  ITabListItemProps,
  ITabListItemState
> {
  constructor(props: ITabListItemProps) {
    super(props);

    this.state = {};
  }

  handleGoToTabButtonClick = (tab: chrome.tabs.Tab) => () => {
    chrome.runtime.sendMessage({
      type: actionTypes.SET_FOCUSSED_WINDOW,
      windowId: tab.windowId,
    });

    this.setActiveTab(tab.id);
    this.dispatchToggleVisibilityAction();
  };

  setActiveTab(tabId) {
    chrome.runtime.sendMessage({
      type: actionTypes.SET_ACTIVE_TAB,
      tabId,
    });
  }

  dispatchToggleVisibilityAction() {
    chrome.runtime.sendMessage({
      type: actionTypes.DISPATCH_TOGGLE_VISIBILITY,
    });
  }

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

  updateMutedState(tabId: number, muted: boolean) {
    chrome.runtime.sendMessage({
      type: actionTypes.TOGGLE_MUTE,
      tabId,
      muted,
    });
  }

  public render() {
    const { showAudibleIcon, item, iconUrl, websiteIconFilePath } = this.props;

    return (
      <li className={styles['tab-list-item']}>
        {showAudibleIcon ? (
          <button
            onClick={this.handleToggleMuteButtonClick(item)}
            className={styles['toggle-mute-button']}
          >
            <div className={styles['list-item-icon-container']}>
              <img className={styles['list-item-icon']} src={iconUrl} />
            </div>
          </button>
        ) : null}
        <a
          className={cx(
            styles['unstyled-anchor-tag'],
            styles['anchor-tag-pointer-cursor']
          )}
          href="#"
          tabIndex={0}
          role="button"
          onClick={this.handleGoToTabButtonClick(item)}
        >
          <img className={styles['website-icon']} src={websiteIconFilePath} />
          <div className={styles['title-and-url-container']}>
            <div
              dangerouslySetInnerHTML={{
                __html: item.titleHighlighted || item.title,
              }}
            ></div>
            <div
              className={cx(styles['tab-url'], styles['truncate-text'])}
              dangerouslySetInnerHTML={{
                __html: item.urlHighlighted || item.url,
              }}
            ></div>
          </div>
        </a>
      </li>
    );
  }
}
