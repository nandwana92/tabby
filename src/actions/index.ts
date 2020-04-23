import {
  UPDATE_IS_CHROME_ON_STEROIDS_VISIBLE_VALUE,
  UPDATE_SHOW_AUDIBLE_TABS_ONLY_FLAG_VALUE,
  UpdateShowAudibleTabsOnlyFlagValue,
  UpdateIsChromeOnSteroidsVisibleFlagValue,
} from 'src/types';

export function updateIsChromeOnSteroidsVisibleFlagValue(
  value: boolean
): UpdateIsChromeOnSteroidsVisibleFlagValue {
  return {
    type: UPDATE_IS_CHROME_ON_STEROIDS_VISIBLE_VALUE,
    payload: value,
  };
}

export function updateShowAudibleTabsOnlyFlagValue(
  value: boolean
): UpdateShowAudibleTabsOnlyFlagValue {
  return {
    type: UPDATE_SHOW_AUDIBLE_TABS_ONLY_FLAG_VALUE,
    payload: value,
  };
}
