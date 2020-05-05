import React, { createRef } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import cx from 'classnames';
import Fuse from 'fuse.js';

import {
  jumpToTab,
  handleToggleMuteButtonClick,
  dispatchToggleVisibilityAction,
  getHighlightedHTMLStrings,
  getFilenameFromURL,
  getWebsiteIconPathFromFilename,
} from 'src/utils';
import { IAppState } from 'src/types';
import { keyLabels, ModifierKey, iconUrls } from 'src/constants';

import styles from './TabListItem.css';

const mapState = (state: IAppState) => ({
  platformInfo: state.platformInfo,
});

const connector = connect(mapState);

type PropsFromRedux = ConnectedProps<typeof connector>;

export interface ITabListItemProps {
  tabFuseResult: Fuse.FuseResult<chrome.tabs.Tab>;
  isHighlighted: boolean;
  containerRef: React.RefObject<HTMLElement>;
  isRecentlyAudibleTab?: boolean;
  index?: number;
  onFocus?: (node: HTMLLIElement) => void;
  className?: string;
}

export interface ITabListItemState {}

type TAllProps = PropsFromRedux & ITabListItemProps;

export class TabListItem extends React.Component<TAllProps, ITabListItemState> {
  private liElementRef = createRef<HTMLLIElement>();

  constructor(props: TAllProps) {
    super(props);

    this.state = {};
  }

  componentDidUpdate(prevProps: TAllProps) {
    if (!prevProps.isHighlighted && this.props.isHighlighted) {
      this.scrollListItemIntoViewIfNeeded();
    }
  }

  private scrollListItemIntoViewIfNeeded() {
    const node = this.liElementRef.current;
    const containerNode = this.props.containerRef.current;

    if (node === null || containerNode === null) {
      return;
    }

    const containerTop = containerNode.scrollTop;
    const containerBottom = containerTop + containerNode.clientHeight;

    const nodeTop = node.offsetTop;
    const nodeBottom = nodeTop + node.clientHeight;

    if (nodeTop < containerTop) {
      containerNode.scrollTop -= containerTop - nodeTop;
    } else if (nodeBottom > containerBottom) {
      containerNode.scrollTop += nodeBottom - containerBottom;
    }
  }

  private getUrl(tab: chrome.tabs.Tab): string | undefined {
    if (typeof tab.url === 'string' && tab.url.length > 0) {
      return tab.url;
    }

    return tab.pendingUrl;
  }

  private handleToggleMuteButtonClick = (tab: chrome.tabs.Tab) => (
    e: React.SyntheticEvent<HTMLElement>
  ) => {
    e.stopPropagation();
    handleToggleMuteButtonClick(tab);
  };

  private handleClick = (tab: chrome.tabs.Tab) => () => {
    const { id, windowId } = tab;

    if (typeof id === 'undefined') {
      return;
    }

    jumpToTab(id, windowId);
    dispatchToggleVisibilityAction();
  };

  public render() {
    const {
      tabFuseResult,
      className,
      platformInfo,
      isRecentlyAudibleTab = false,
      index = -1,
    } = this.props;

    const { os } = platformInfo;
    const showKeyboardShortcut = index > -1 && index < 9;
    const item = tabFuseResult.item;

    const highlightedHTMLStrings = getHighlightedHTMLStrings(
      tabFuseResult,
      styles['highlight']
    );

    const title = highlightedHTMLStrings.title || item.title || '';
    const url = highlightedHTMLStrings.url || item.url || '';

    const muted = item.mutedInfo?.muted === true;
    const showAudibleIcon = item.audible === true;
    const iconUrl = muted ? iconUrls.mute : iconUrls.volume;
    const websiteIconFilename = getFilenameFromURL(this.getUrl(item));
    const websiteIconFilePath =
      websiteIconFilename !== 'default' || !item.favIconUrl
        ? getWebsiteIconPathFromFilename(websiteIconFilename)
        : item.favIconUrl;

    return (
      <li
        className={cx(styles['tab-list-item'], 'tab-list-item')}
        ref={this.liElementRef}
      >
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
            className,
            styles['unstyled-anchor-tag'],
            styles['anchor-tag-pointer-cursor']
          )}
          href="#"
          tabIndex={-1}
          role="button"
          onClick={this.handleClick(item)}
        >
          <img className={styles['website-icon']} src={websiteIconFilePath} />
          <div className={styles['title-and-url-container']}>
            <div
              dangerouslySetInnerHTML={{
                __html: title,
              }}
            ></div>
            <div
              className={cx(styles['tab-url'], styles['truncate-text'])}
              dangerouslySetInnerHTML={{
                __html: url,
              }}
            ></div>
          </div>
          {showKeyboardShortcut ? (
            <React.Fragment>
              <kbd>{keyLabels[ModifierKey.ALT][os]}</kbd>+<kbd>{index + 1}</kbd>
            </React.Fragment>
          ) : null}
        </a>
      </li>
    );
  }
}

export default connector(TabListItem);
