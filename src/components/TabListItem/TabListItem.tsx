import React, { createRef } from 'react';
import cx from 'classnames';

import { actionTypes } from 'src/constants';
import {
  jumpToTab,
  handleToggleMuteButtonClick,
  dispatchToggleVisibilityAction,
} from 'src/utils';
import { ITabWithHighlightedText } from 'src/types';

import styles from './TabListItem.css';

export interface ITabListItemProps {
  showAudibleIcon: boolean;
  item: ITabWithHighlightedText;
  iconUrl: any;
  websiteIconFilePath: any;
  isHighlighted: boolean;
  containerRef: React.RefObject<HTMLElement>;
  index?: number;
  onFocus?: (node: HTMLLIElement) => void;
  className?: string;
}

export interface ITabListItemState {}

export default class TabListItem extends React.Component<
  ITabListItemProps,
  ITabListItemState
> {
  private liElementRef = createRef<HTMLLIElement>();

  constructor(props: ITabListItemProps) {
    super(props);

    this.state = {};
  }

  componentDidUpdate(prevProps: ITabListItemProps) {
    if (!prevProps.isHighlighted && this.props.isHighlighted) {
      this.scrollListItemIntoViewIfNeeded();
    }
  }

  scrollListItemIntoViewIfNeeded() {
    const node = this.liElementRef.current;
    const containerNode = this.props.containerRef.current;

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

  handleToggleMuteButtonClick = (tab) => (
    e: React.SyntheticEvent<HTMLElement>
  ) => {
    e.stopPropagation();
    handleToggleMuteButtonClick(tab);
  };

  private handleClick = (tab: ITabWithHighlightedText) => () => {
    const { id, windowId } = tab;

    jumpToTab(id, windowId);
    dispatchToggleVisibilityAction();
  };

  public render() {
    const {
      showAudibleIcon,
      item,
      iconUrl,
      websiteIconFilePath,
      className,
      index = -1,
    } = this.props;

    const showKeyboardShortcut = index > -1 && index < 9;

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
          {showKeyboardShortcut ? (
            <React.Fragment>
              <kbd>⌥</kbd> + <kbd>{index + 1}</kbd>
            </React.Fragment>
          ) : null}
        </a>
      </li>
    );
  }
}
