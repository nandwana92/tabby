export enum actionTypes {
  TOGGLE_VISIBILITY = 'TOGGLE_VISIBILITY',
  GET_TABS_REQUEST = 'GET_TABS_REQUEST',
  GET_TABS_SUCCESS = 'GET_TABS_SUCCESS',
  TAB_UPDATED = 'TAB_UPDATED',
  TOGGLE_MUTE = 'TOGGLE_MUTE',
  MUTE_TOGGLED = 'MUTE_TOGGLED',
}

export const iconUrls = {
  search: chrome.runtime.getURL('images/loupe.svg'),
  mute: chrome.runtime.getURL('images/mute.svg'),
  volume: chrome.runtime.getURL('images/volume.svg'),
};

export enum keyboardShortcuts {
  TOGGLE_VISIBILITY = 'toggle-visibility',
}

export const AUDIBLE_TABS_POLL_FREQUENCY_IN_MS = 1000;
export const iFrameURL = chrome.runtime.getURL('tez.html');
