import {
  IAppState,
  AppActions,
  UPDATE_IS_CHROME_ON_STEROIDS_VISIBLE_VALUE,
  UPDATE_SHOW_AUDIBLE_TABS_ONLY_FLAG_VALUE,
} from 'src/types';

// FIXME: An initial state value has to provided from what it looks like. When the store, at the time
// of creation, is being seeded with an "initial state" then the state parameter should
// never be undefined. What would be the right way to type the createStore method?
const initialState: IAppState = {
  showAudibleTabsOnly: false,
  isChromeOnSteroidsVisible: false,
  platformInfo: {
    arch: 'x86-64',
    nacl_arch: 'x86-64',
    os: 'mac',
  },
  keyboardShortcuts: [],
};

export function rootReducer(
  state: IAppState = initialState,
  action: AppActions
): IAppState {
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
