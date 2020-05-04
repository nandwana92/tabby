import * as React from 'react';
import cx from 'classnames';

import Button from 'src/components/Button/Button';
import Fin from 'src/components/Fin/Fin';
import ShowOnlyAudibleTabsDemo from 'src/components/ShowOnlyAudibleTabsDemo/ShowOnlyAudibleTabsDemo';
import PlaySomeSongs from 'src/components/PlaySomeSongs/PlaySomeSongs';
import SimulatedSearch from 'src/components/SimulatedSearch/SimulatedSearch';
import OpenTezDemo from 'src/components/OpenTezDemo/OpenTezDemo';
import OpenWebsitesInBackground from 'src/components/OpenWebsitesInBackground/OpenWebsitesInBackground';
import Root from 'src/components/Root/Root';
import { iconUrls } from 'src/constants';
import { ISectionComponentWithProps } from 'src/types';

import styles from './Guide.css';

const sectionComponents: ISectionComponentWithProps[] = [
  {
    component: OpenWebsitesInBackground,
    props: {
      id: 'open-websites-in-background',
    },
  },
  {
    component: OpenTezDemo,
    props: {
      id: 'open-tez-demo',
    },
    manual: true,
    annotationImage: iconUrls.searchInputBoxGuide,
    positioningClass: styles['search-input-box-guide'],
  },
  {
    component: SimulatedSearch,
    props: {
      id: 'simulated-search',
      searchTill: 'twit',
      searchValue: 'twitter',
    },
    manual: true,
    annotationImage: iconUrls.jumpToTabGuide,
    positioningClass: styles['jump-to-tab-guide'],
  },
  {
    component: PlaySomeSongs,
    props: {
      id: 'play-some-songs',
    },
    manual: true,
  },
  {
    component: ShowOnlyAudibleTabsDemo,
    props: {
      id: 'show-only-audible-tabs-demo',
    },
    manual: true,
    annotationImage: iconUrls.showOnlyAudibleTabsGuide,
    positioningClass: styles['show-only-audible-tabs-guide'],
  },
  {
    component: Fin,
    props: {
      id: 'fin',
    },
    manual: true,
  },
];

export interface IGuideProps {}

export interface IGuideState {
  showTillSectionNumber: number;
  doneTillSectionNumber: number;
}

export default class Guide extends React.Component<IGuideProps, IGuideState> {
  constructor(props: IGuideProps) {
    super(props);

    this.state = {
      showTillSectionNumber: 0,
      doneTillSectionNumber: -1,
    };
  }

  componentDidUpdate(prevProps: IGuideProps, prevState: IGuideState) {
    const { showTillSectionNumber } = this.state;
    const { showTillSectionNumber: prevStateShowTillSectionNumber } = prevState;

    if (showTillSectionNumber !== prevStateShowTillSectionNumber) {
      const id = sectionComponents[showTillSectionNumber]?.props.id;

      if (typeof id === 'string') {
        const node = document.getElementById(id);
        node?.scrollIntoView({
          block: 'center',
          behavior: 'smooth',
        });
      }
    }
  }

  private showNextSection = () => {
    const { showTillSectionNumber } = this.state;
    const nextSectionIndex = showTillSectionNumber + 1;

    if (nextSectionIndex < sectionComponents.length) {
      this.setState({
        showTillSectionNumber: nextSectionIndex,
      });
    }
  };

  private onDone = () => {
    const { showTillSectionNumber, doneTillSectionNumber } = this.state;
    const currentSection = sectionComponents[showTillSectionNumber];
    const { manual = false } = currentSection;

    this.setState(
      {
        doneTillSectionNumber: doneTillSectionNumber + 1,
      },
      () => {
        if (!manual) {
          this.showNextSection();
        }
      }
    );
  };

  public render() {
    const { showTillSectionNumber, doneTillSectionNumber } = this.state;
    const section = sectionComponents[doneTillSectionNumber];
    const { manual = false, annotationImage, positioningClass } = section || {};
    const showAnnotation =
      manual &&
      showTillSectionNumber === doneTillSectionNumber &&
      annotationImage &&
      positioningClass;

    return (
      <div className={styles['guide']}>
        <h1>How to use this extension 🤔</h1>
        <div className={styles['sections-container']}>
          <div className={styles['left']}>
            {sectionComponents.map((item, index) => {
              const { component: Component, props } = item;
              const section = sectionComponents[index];
              const { manual = false } = section;
              const isLastButton = index === sectionComponents.length - 1;
              const showNextButton =
                manual &&
                index === doneTillSectionNumber &&
                doneTillSectionNumber === showTillSectionNumber;

              return (
                <React.Fragment key={index}>
                  <Component
                    {...props}
                    onDone={this.onDone}
                    visible={index <= showTillSectionNumber}
                  />
                  <div
                    className={cx(
                      styles['show-next-section-button-container'],
                      {
                        [styles['visible']]: showNextButton,
                      }
                    )}
                  >
                    <Button
                      disabled={isLastButton}
                      onClick={this.showNextSection}
                      className={cx(styles['show-next-section'], {
                        [styles['pulse-animation']]: !isLastButton,
                      })}
                    >
                      {isLastButton ? 'fin.' : 'Next'}
                    </Button>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
          <div className={styles['right']}>
            <div className={styles['annotation-container']}>
              <img
                src={annotationImage}
                className={cx(styles['annotation'], positioningClass, {
                  [styles['visible']]: showAnnotation,
                })}
              />
            </div>
            <div
              className={cx(styles['root-container'], {
                [styles['visible']]: doneTillSectionNumber >= 1,
              })}
            >
              <Root isEmbedded={true} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
