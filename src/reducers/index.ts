import {
  IAppState,
  TAppActions,
  UPDATE_IS_CHROME_ON_STEROIDS_VISIBLE_VALUE,
  UPDATE_SHOW_AUDIBLE_TABS_ONLY_FLAG_VALUE,
} from 'src/types';

export function rootReducer(state, action: TAppActions): IAppState {
  switch (action.type) {
    case UPDATE_SHOW_AUDIBLE_TABS_ONLY_FLAG_VALUE:
      const { payload: showAudibleTabsOnly } = action;

      return {
        ...state,
        showAudibleTabsOnly,
      };

    case UPDATE_IS_CHROME_ON_STEROIDS_VISIBLE_VALUE:
      const { payload: isChromeOnSteroidsVisible } = action;

      return {
        ...state,
        isChromeOnSteroidsVisible,
      };

    default:
      return state;
  }
}
