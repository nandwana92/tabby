import * as React from 'react';
import cx from 'classnames';

import Button from 'src/components/Button/Button';
import { OPEN_URLS_IN_BACKGROUND, AsyncStatus } from 'src/types';
import { websitesToOpenForDemo } from 'src/constants';
import { getWebsiteIconPathFromFilename } from 'src/utils';
import { iconUrls } from 'src/constants';

import styles from './OpenWebsitesInBackground.css';

export interface IOpenWebsitesInBackgroundProps {
  id?: string;
  onDone?: () => void;
  visible?: boolean;
}

export interface IOpenWebsitesInBackgroundState {
  tabsOpeningStatus: AsyncStatus;
}

export default class OpenWebsitesInBackground extends React.Component<
  IOpenWebsitesInBackgroundProps,
  IOpenWebsitesInBackgroundState
> {
  constructor(props: IOpenWebsitesInBackgroundProps) {
    super(props);

    this.state = {
      tabsOpeningStatus: AsyncStatus.INIT,
    };
  }

  private openTabsClickHandler = () => {
    this.setState({
      tabsOpeningStatus: AsyncStatus.LOADING,
    });

    chrome.runtime.sendMessage(
      {
        type: OPEN_URLS_IN_BACKGROUND,
        data: websitesToOpenForDemo.map((item) => item.url),
      },
      (response) => {
        const tabCreationPromises: Promise<chrome.tabs.Tab>[] = response;

        Promise.all(tabCreationPromises).then((values) => {
          const { onDone } = this.props;

          this.setState({
            tabsOpeningStatus: AsyncStatus.SUCCESS,
          });

          if (typeof onDone === 'function') {
            onDone();
          }
        });
      }
    );
  };

  public render() {
    const { tabsOpeningStatus } = this.state;
    const { id = 'open-websites-in-background' } = this.props;

    const openTabsButtonText =
      tabsOpeningStatus === AsyncStatus.SUCCESS ? 'Done!' : 'Go!';
    const disableOpenTabsButton =
      tabsOpeningStatus === AsyncStatus.LOADING ||
      tabsOpeningStatus === AsyncStatus.SUCCESS;

    return (
      <div id={id} className={styles['open-websites-in-background']}>
        <div className={styles['tap-open-prompt']}>
          Before we start,
          <br /> let's open a few tabs in the background for the demo.
          <Button
            disabled={disableOpenTabsButton}
            onClick={this.openTabsClickHandler}
            className={cx(styles['open-tabs-button'], {
              [styles['loading']]: tabsOpeningStatus === AsyncStatus.LOADING,
            })}
          >
            {openTabsButtonText}
            {tabsOpeningStatus === AsyncStatus.SUCCESS ? null : (
              <img className={styles['go-icon']} src={iconUrls.next} />
            )}
          </Button>
        </div>
        <ul>
          {websitesToOpenForDemo.map((item, index) => {
            return (
              <li key={index} className={styles['icon-and-url-container']}>
                <img
                  className={styles['icon']}
                  src={getWebsiteIconPathFromFilename(item.logoKey)}
                />
                <span className={styles['url']}>{item.url}</span>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}
