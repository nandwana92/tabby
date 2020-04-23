export interface IAppState {
  showAudibleTabsOnly: boolean;
  isChromeOnSteroidsVisible: boolean;
}

export interface ITabWithHighlightedText extends chrome.tabs.Tab {
  titleHighlighted?: string;
  urlHighlighted?: string;
}

/**
 * Types for Actions
 */

export const UPDATE_IS_CHROME_ON_STEROIDS_VISIBLE_VALUE =
  'UPDATE_IS_CHROME_ON_STEROIDS_VISIBLE_VALUE';

export const UPDATE_SHOW_AUDIBLE_TABS_ONLY_FLAG_VALUE =
  'UPDATE_SHOW_AUDIBLE_TABS_ONLY_FLAG_VALUE';

export type UpdateIsChromeOnSteroidsVisibleFlagValue = {
  type: typeof UPDATE_IS_CHROME_ON_STEROIDS_VISIBLE_VALUE;
  payload: boolean;
};

export type UpdateShowAudibleTabsOnlyFlagValue = {
  type: typeof UPDATE_SHOW_AUDIBLE_TABS_ONLY_FLAG_VALUE;
  payload: boolean;
};

export type TAppActions =
  | UpdateIsChromeOnSteroidsVisibleFlagValue
  | UpdateShowAudibleTabsOnlyFlagValue;
