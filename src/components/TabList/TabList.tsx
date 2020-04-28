import React, { createRef } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import cx from 'classnames';
import Mousetrap from 'mousetrap';

import {
  getFilenameFromURL,
  getWebsiteIconPathFromFilename,
  jumpToTab,
  dispatchToggleVisibilityAction,
  handleToggleMuteButtonClick,
} from 'src/utils';
import { iconUrls, mousetrapKeyMappings, Keys, OS } from 'src/constants';
import TabListItem from 'src/components/TabListItem/TabListItem';
import { ITabWithHighlightedText, IAppState } from 'src/types';

import styles from './TabList.css';

const mapState = (state: IAppState) => ({
  isChromeOnSteroidsVisible: state.isChromeOnSteroidsVisible,
  platformInfo: state.platformInfo,
});

const connector = connect(mapState, null);

type PropsFromRedux = ConnectedProps<typeof connector>;

export interface ITabListProps {
  listOfTabs: ITabWithHighlightedText[];
}

export interface ITabListState {
  highlightedItemIndex: number;
}

type TAllProps = PropsFromRedux & ITabListProps;

export class TabList extends React.Component<TAllProps, ITabListState> {
  private ulElementRef = createRef<HTMLUListElement>();

  constructor(props: TAllProps) {
    super(props);

    this.state = {
      highlightedItemIndex: 0,
    };
  }

  componentDidMount() {
    this.registerKeyListeners();
  }

  componentDidUpdate(prevProps: TAllProps) {
    if (prevProps.listOfTabs.length !== this.props.listOfTabs.length) {
      this.setState({
        highlightedItemIndex: 0,
      });
    }

    if (
      this.props.isChromeOnSteroidsVisible !==
      prevProps.isChromeOnSteroidsVisible
    ) {
      if (this.props.isChromeOnSteroidsVisible) {
        this.registerKeyListeners();
      } else {
        this.deregisterKeyListeners();
      }
    }
  }

  private registerKeyListeners() {
    const { platformInfo } = this.props;
    const { os } = platformInfo;

    for (let i = 1; i < 10; i++) {
      const key = `${mousetrapKeyMappings[Keys.OPTION][os]}+${i}`;

      Mousetrap.bind(key, this.handleToggleMuteButtonClick);
    }

    for (let i = 1; i < 10; i++) {
      Mousetrap.bind(`shift+${i}`, this.handleSwitchToTabKeyboardShortcut);
    }

    Mousetrap.bind('down', (e: ExtendedKeyboardEvent, combo: string) => {
      e.preventDefault();
      this.highlightNextItem();
    });

    Mousetrap.bind('up', (e: ExtendedKeyboardEvent, combo: string) => {
      e.preventDefault();
      this.highlightPrevousItem();
    });

    Mousetrap.bind('enter', (e: ExtendedKeyboardEvent, combo: string) => {
      e.preventDefault();
      const tab = this.props.listOfTabs[this.state.highlightedItemIndex];
      const { id, windowId } = tab;

      jumpToTab(id, windowId);
      dispatchToggleVisibilityAction();
    });
  }

  private deregisterKeyListeners() {
    const { platformInfo } = this.props;
    const { os } = platformInfo;

    Mousetrap.unbind('up');
    Mousetrap.unbind('down');
    Mousetrap.unbind('enter');
    for (let i = 1; i < 10; i++) {
      const key = `${mousetrapKeyMappings[Keys.OPTION][os]}+${i}`;
      Mousetrap.unbind(key);
    }
    for (let i = 1; i < 10; i++) {
      Mousetrap.unbind(`shift+${i}`);
    }
  }

  private handleToggleMuteButtonClick = (
    e: ExtendedKeyboardEvent,
    combo: string
  ) => {
    e.preventDefault();
    const { platformInfo } = this.props;
    const { os } = platformInfo;
    const index =
      os === OS.MAC
        ? parseInt(combo.replace(/option\+/g, ''), 10) - 1
        : parseInt(combo.replace(/alt\+/g, ''), 10) - 1;

    if (index < this.props.listOfTabs.length) {
      const tab = this.props.listOfTabs[index];
      handleToggleMuteButtonClick(tab);
    }
  };

  private handleSwitchToTabKeyboardShortcut = (
    e: ExtendedKeyboardEvent,
    combo: string
  ) => {
    e.preventDefault();
    const index = parseInt(combo.replace(/shift\+/g, ''), 10) - 1;

    if (index < this.props.listOfTabs.length) {
      const tab = this.props.listOfTabs[index];
      const { id, windowId } = tab;

      jumpToTab(id, windowId);
      dispatchToggleVisibilityAction();
    }
  };

  private highlightNextItem = () => {
    const { highlightedItemIndex } = this.state;
    const { listOfTabs } = this.props;

    if (highlightedItemIndex + 1 < listOfTabs.length) {
      this.setState({
        highlightedItemIndex: highlightedItemIndex + 1,
      });
    }
  };

  private highlightPrevousItem = () => {
    const { highlightedItemIndex } = this.state;

    if (highlightedItemIndex - 1 > -1) {
      this.setState({
        highlightedItemIndex: highlightedItemIndex - 1,
      });
    }
  };

  public render() {
    const { highlightedItemIndex } = this.state;
    const { listOfTabs } = this.props;

    return (
      <ul className={styles['tab-list']} ref={this.ulElementRef}>
        {listOfTabs.map((item, index) => {
          const { muted } = item.mutedInfo;
          const showAudibleIcon = item.audible;
          const iconUrl = muted ? iconUrls.mute : iconUrls.volume;
          const websiteIconFilename = getFilenameFromURL(item.url);
          const websiteIconFilePath =
            websiteIconFilename !== 'default' || !item.favIconUrl
              ? getWebsiteIconPathFromFilename(websiteIconFilename)
              : item.favIconUrl;

          return (
            <TabListItem
              className={cx({
                [styles['highlighted']]: highlightedItemIndex === index,
              })}
              containerRef={this.ulElementRef}
              index={index}
              isHighlighted={highlightedItemIndex === index}
              key={item.id}
              showAudibleIcon={showAudibleIcon}
              item={item}
              iconUrl={iconUrl}
              websiteIconFilePath={websiteIconFilePath}
            />
          );
        })}
      </ul>
    );
  }
}

export default connector(TabList);
