export interface IAppState {
  showAudibleTabsOnly: boolean;
  isChromeOnSteroidsVisible: boolean;
  searchInputValue: string;
  platformInfo: chrome.runtime.PlatformInfo;
  keyboardShortcuts: IShortcutItem[];
}

// This is not an exhaustive list. Values will be added as and when they get
// start being used.
export enum Key {
  META = 'META',
  ALT = 'ALT',
  SHIFT = 'SHIFT',
  SPACE = 'SPACE',
  A = 'A',
  B = 'B',
  C = 'C',
  D = 'D',
  E = 'E',
  F = 'F',
  G = 'G',
  H = 'H',
  I = 'I',
  J = 'J',
  K = 'K',
  L = 'L',
  M = 'M',
  N = 'N',
  O = 'O',
  P = 'P',
  Q = 'Q',
  R = 'R',
  S = 'S',
  T = 'T',
  U = 'U',
  V = 'V',
  W = 'W',
  X = 'X',
  Y = 'Y',
  Z = 'Z',
}

export interface RecentlyAudibleTab {
  tab: chrome.tabs.Tab;
  timeoutId: NodeJS.Timeout;
  timestamp: number;
}

export interface ISectionComponentProps {
  id: string;
  [x: string]: any;
}

export interface ISectionComponentWithProps {
  component: React.ComponentType<any>;
  props: ISectionComponentProps;
  manual?: boolean;
  annotationImage?: string;
  positioningClass?: string;
}

export interface IShortcutItem {
  label: string;
  shortcut: string;
}

export enum ModeTypes {
  DEFAULT = 'DEFAULT',
  CONSOLE = 'CONSOLE',
}

export enum AsyncStatus {
  INIT = 'INIT',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export enum ExtensionInstallationReason {
  INSTALL = 'install',
  UPDATE = 'update',
  CHROME_UPDATE = 'chrome_update',
  SHARED_MODULE_UPDATE = 'shared_module_update',
}

export interface WebsiteInfo {
  title: string;
  url: string;
  logoKey: string;
}

/**
 * Types for Actions
 */

export const UPDATE_IS_CHROME_ON_STEROIDS_VISIBLE_VALUE =
  'UPDATE_IS_CHROME_ON_STEROIDS_VISIBLE_VALUE';

export const UPDATE_SHOW_AUDIBLE_TABS_ONLY_FLAG_VALUE =
  'UPDATE_SHOW_AUDIBLE_TABS_ONLY_FLAG_VALUE';

export const UPDATE_SEARCH_INPUT_VALUE = 'UPDATE_SEARCH_INPUT_VALUE';

export type UpdateIsChromeOnSteroidsVisibleFlagValue = {
  type: typeof UPDATE_IS_CHROME_ON_STEROIDS_VISIBLE_VALUE;
  payload: boolean;
};

export type UpdateShowAudibleTabsOnlyFlagValue = {
  type: typeof UPDATE_SHOW_AUDIBLE_TABS_ONLY_FLAG_VALUE;
  payload: boolean;
};

export type UpdateSearchInputValue = {
  type: typeof UPDATE_SEARCH_INPUT_VALUE;
  payload: string;
};

export type AppActions =
  | UpdateIsChromeOnSteroidsVisibleFlagValue
  | UpdateShowAudibleTabsOnlyFlagValue
  | UpdateSearchInputValue;

/**
 * Types for Messages
 */

export const GET_TABS_REQUEST = 'GET_TABS_REQUEST';
export const GET_TABS_SUCCESS = 'GET_TABS_SUCCESS';
export const SET_FOCUSSED_WINDOW = 'SET_FOCUSSED_WINDOW';
export const FOCUSSED_WINDOW_CHANGED = 'FOCUSSED_WINDOW_CHANGED';
export const GET_PLATFORM_INFO_REQUEST = 'GET_PLATFORM_INFO_REQUEST';
export const GET_PLATFORM_INFO_SUCCESS = 'GET_PLATFORM_INFO_SUCCESS';
export const GET_ACTIVE_TAB_REQUEST = 'GET_ACTIVE_TAB_REQUEST';
export const GET_ACTIVE_TAB_SUCCESS = 'GET_ACTIVE_TAB_SUCCESS';
export const SET_ACTIVE_TAB = 'SET_ACTIVE_TAB';
export const ACTIVE_TAB_CHANGED = 'ACTIVE_TAB_CHANGED';
export const TAB_UPDATED = 'TAB_UPDATED';
export const TOGGLE_MUTE = 'TOGGLE_MUTE';
export const MUTE_TOGGLED = 'MUTE_TOGGLED';
export const TOGGLE_VISIBILITY = 'TOGGLE_VISIBILITY';
export const DISPATCH_TOGGLE_VISIBILITY = 'DISPATCH_TOGGLE_VISIBILITY';
export const OPEN_URLS_IN_BACKGROUND = 'OPEN_URLS_IN_BACKGROUND';

export type GetTabsRequestMessage = {
  type: typeof GET_TABS_REQUEST;
};

export type GetTabsSuccessMessage = {
  type: typeof GET_TABS_SUCCESS;
  data: {
    allTabs: chrome.tabs.Tab[];
    recentlyAudibleTabs: chrome.tabs.Tab[];
  };
};

export type SetFocussedWindowMessage = {
  type: typeof SET_FOCUSSED_WINDOW;
  data: number;
};

export type FocussedWindowChangedMessage = {
  type: typeof FOCUSSED_WINDOW_CHANGED;
  data: chrome.windows.Window;
};

export type GetPlatformInfoRequestMessage = {
  type: typeof GET_PLATFORM_INFO_REQUEST;
};

export type GetPlatformInfoSuccessMessage = {
  type: typeof GET_PLATFORM_INFO_SUCCESS;
  data: chrome.runtime.PlatformInfo;
};

export type GetActiveTabRequestMessage = {
  type: typeof GET_ACTIVE_TAB_REQUEST;
};

export type GetActiveTabSuccessMessage = {
  type: typeof GET_ACTIVE_TAB_SUCCESS;
  data: chrome.tabs.Tab;
};

export type SetActiveTabMessage = {
  type: typeof SET_ACTIVE_TAB;
  data: number;
};

export type ActiveTabChangedMessage = {
  type: typeof ACTIVE_TAB_CHANGED;
  data: chrome.tabs.Tab;
};

export type TabUpdatedMessage = {
  type: typeof TAB_UPDATED;
  data: {
    tabId: number;
    changeInfo: chrome.tabs.TabChangeInfo;
    tab: chrome.tabs.Tab;
  };
};

export type ToggleMuteMessage = {
  type: typeof TOGGLE_MUTE;
  data: {
    tabId: number;
    muted: boolean;
  };
};

export type MuteToggledMessage = {
  type: typeof MUTE_TOGGLED;
  data: chrome.tabs.Tab;
};

export type DispatchToggleVisibilityMessage = {
  type: typeof DISPATCH_TOGGLE_VISIBILITY;
};

export type ToggleVisibilityMessage = {
  type: typeof TOGGLE_VISIBILITY;
};

export type OpenUrlsInBackground = {
  type: typeof OPEN_URLS_IN_BACKGROUND;
  data: string[];
};

export type MessageTypes =
  | GetTabsRequestMessage
  | GetTabsSuccessMessage
  | SetFocussedWindowMessage
  | FocussedWindowChangedMessage
  | GetPlatformInfoRequestMessage
  | GetPlatformInfoSuccessMessage
  | GetActiveTabRequestMessage
  | GetActiveTabSuccessMessage
  | SetActiveTabMessage
  | ActiveTabChangedMessage
  | TabUpdatedMessage
  | ToggleMuteMessage
  | MuteToggledMessage
  | ToggleVisibilityMessage
  | DispatchToggleVisibilityMessage
  | OpenUrlsInBackground;
