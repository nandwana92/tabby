import * as React from 'react';

import { iconUrls } from 'src/constants';

import styles from './NoResults.css';

export interface INoResultsProps {}

export default class NoResults extends React.PureComponent<INoResultsProps> {
  public render() {
    return (
      <div className={styles['no-results']}>
        <img className={styles['illustration']} src={iconUrls.noResultsFound} />
        <div className={styles['text']}>no matching tabs found</div>
      </div>
    );
  }
}
