import * as React from 'react';

import { getFilenameFromURL, getWebsiteIconPathFromFilename } from 'src/utils';
import { iconUrls } from 'src/constants';
import TabListItem from 'src/components/TabListItem/TabListItem';
import { ITabWithHighlightedText } from 'src/types';

import styles from './TabList.css';

export interface ITabListProps {
  listOfTabs: ITabWithHighlightedText[];
}

export interface ITabListState {}

export default class TabList extends React.Component<
  ITabListProps,
  ITabListState
> {
  constructor(props: ITabListProps) {
    super(props);

    this.state = {};
  }

  public render() {
    const { listOfTabs } = this.props;

    return (
      <ul className={styles['tab-list']}>
        {listOfTabs.map((item) => {
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
