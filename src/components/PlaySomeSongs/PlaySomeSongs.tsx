import { connect, ConnectedProps } from 'react-redux';
import * as React from 'react';
import cx from 'classnames';

import { updateSearchInputValue } from 'src/actions';
import { IAppState } from 'src/types';
import { songsToPlayForDemo } from 'src/constants';
import { getWebsiteIconPathFromFilename, getTabs, sleep } from 'src/utils';

import styles from './PlaySomeSongs.css';

const mapState = (state: IAppState) => ({
  platformInfo: state.platformInfo,
});

const mapDispatch = {
  updateSearchInputValue,
};

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

export interface IPlaySomeSongsProps {
  id?: string;
  onDone?: () => void;
  visible?: boolean;
  done?: boolean;
}

export interface IPlaySomeSongsState {}

type TAllProps = PropsFromRedux & IPlaySomeSongsProps;

export class PlaySomeSongs extends React.Component<
  TAllProps,
  IPlaySomeSongsState
> {
  constructor(props: TAllProps) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    const { visible = true, updateSearchInputValue } = this.props;

    if (visible) {
      updateSearchInputValue('');
    }
  }

  componentDidUpdate(prevProps: TAllProps) {
    const { visible = true, updateSearchInputValue } = this.props;
    const { visible: prevPropsVisible = true } = prevProps;

    if (!prevPropsVisible && visible) {
      updateSearchInputValue('');
    }
  }

  private handleClick = async () => {
    const { onDone } = this.props;

    await sleep(500);
    getTabs();

    if (typeof onDone === 'function') {
      onDone();
    }
  };

  public render() {
    const { visible, id = 'play-some-songs' } = this.props;

    return (
      <div
        id={id}
        className={cx(styles['play-some-songs'], {
          [styles['visible']]: visible,
        })}
      >
        Let's play some music for this one. Click on some the below songs to
        play them in the background and come back.
        <ul>
          {songsToPlayForDemo.map((item, index) => {
            return (
              <li key={index} className={styles['icon-and-title-container']}>
                <img
                  className={styles['icon']}
                  src={getWebsiteIconPathFromFilename(item.logoKey)}
                />
                <a
                  onClick={this.handleClick}
                  className={cx(styles['unstyled-anchor-tag'], styles['title'])}
                  href={item.url}
                  target="_blank"
                >
                  {item.title}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}

export default connector(PlaySomeSongs);
