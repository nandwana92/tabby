import * as React from 'react';

import { ModeTypes } from 'src/types';
import { noResultsContent } from 'src/constants';

import styles from './NoResults.css';

export interface INoResultsProps {
  modeType?: ModeTypes;
}

export default class NoResults extends React.PureComponent<INoResultsProps> {
  public render() {
    const { modeType = ModeTypes.DEFAULT } = this.props;

    return (
      <div className={styles['no-results']}>
        <img
          className={styles['illustration']}
          src={noResultsContent[modeType].iconUrl}
        />
        <div className={styles['text']}>{noResultsContent[modeType].text}</div>
      </div>
    );
  }
}
