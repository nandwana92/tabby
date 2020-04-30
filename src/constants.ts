import { ModeTypes } from 'src/types';

export enum ActionTypes {
  TOGGLE_VISIBILITY = 'TOGGLE_VISIBILITY',
  GET_TABS_REQUEST = 'GET_TABS_REQUEST',
  GET_TABS_SUCCESS = 'GET_TABS_SUCCESS',
  SET_FOCUSSED_WINDOW = 'SET_FOCUSSED_WINDOW',
  FOCUSSED_WINDOW_CHANGED = 'FOCUSSED_WINDOW_CHANGED',
  GET_PLATFORM_INFO_REQUEST = 'GET_PLATFORM_INFO_REQUEST',
  GET_PLATFORM_INFO_SUCCESS = 'GET_PLATFORM_INFO_SUCCESS',
  GET_ACTIVE_TAB_REQUEST = 'GET_ACTIVE_TAB_REQUEST',
  GET_ACTIVE_TAB_SUCCESS = 'GET_ACTIVE_TAB_SUCCESS',
  SET_ACTIVE_TAB = 'SET_ACTIVE_TAB',
  ACTIVE_TAB_CHANGED = 'ACTIVE_TAB_CHANGED',
  TAB_UPDATED = 'TAB_UPDATED',
  TOGGLE_MUTE = 'TOGGLE_MUTE',
  MUTE_TOGGLED = 'MUTE_TOGGLED',
  DISPATCH_TOGGLE_VISIBILITY = 'DISPATCH_TOGGLE_VISIBILITY',
}

export const iconUrls = {
  search: chrome.runtime.getURL('images/loupe.svg'),
  mute: chrome.runtime.getURL('images/mute.svg'),
  fourOFour: chrome.runtime.getURL('images/404.svg'),
  keyboard: chrome.runtime.getURL('images/keyboard.svg'),
  noResultsFound: chrome.runtime.getURL('images/desert.svg'),
  volume: chrome.runtime.getURL('images/volume.svg'),
};

export enum KeyboardShortcuts {
  TOGGLE_VISIBILITY = 'toggle-visibility',
  JUMP_BACK_TO_PREVIOUS_TAB = 'jump-back-to-previous-tab',
}

export const AUDIBLE_TABS_POLL_FREQUENCY_IN_MS = 1000;
export const contentScriptInjectedPath = 'dist/contentScriptInjected.js';
export const iFrameURL = chrome.runtime.getURL('tez.html');
export const showOnlyAudibleTabsLabel = 'Audible tabs only';
export const showOnlyAudibleTabsIdentifer = 'show-audible-tabs-only';
export const consoleCommands = ['show-keyboard-shortcuts'];
export const defaultFilename = 'default';

export enum OS {
  MAC = 'mac',
  WIN = 'win',
  ANDROID = 'android',
  CROS = 'cros',
  LINUX = 'linux',
  OPENBSD = 'openbsd',
}

export enum Keys {
  CTRL = 'Control',
  OPTION = 'Option',
  COMMAND = 'Command',
  DELETE = 'Delete',
  RETURN = 'Return',
}

export const mousetrapKeyMappings: Record<string, Record<string, string>> = {
  [Keys.OPTION]: {
    [OS.MAC]: 'option',
    [OS.WIN]: 'alt',
    [OS.LINUX]: 'alt',
  },
};

export const keyLabels: Record<string, Record<string, string>> = {
  [Keys.COMMAND]: {
    [OS.MAC]: '⌘',
    [OS.WIN]: 'Ctrl',
    [OS.LINUX]: 'Ctrl',
  },
  [Keys.OPTION]: {
    [OS.MAC]: '⌥',
    [OS.WIN]: 'Alt',
    [OS.LINUX]: 'Alt',
  },
};

export const noResultsContent = {
  [ModeTypes.DEFAULT]: {
    text: 'no matching tabs found',
    iconUrl: iconUrls.noResultsFound,
  },
  [ModeTypes.CONSOLE]: {
    text: 'invalid command',
    iconUrl: iconUrls.fourOFour,
  },
};

export const partialHostnameToFilenameMapping: Record<string, string> = {
  'airbnb.com': 'airbnb',
  'behance.net': 'behance',
  'dailymotion.com': 'dailymotion',
  'deviantart.com': 'deviantart',
  'dribbble.com': 'dribbble',
  'ello.co': 'ello',
  'etsy.com': 'etsy',
  'facebook.com': 'facebook',
  'flickr.com': 'flickr',
  'foursquare.com': 'foursquare',
  'instagram.com': 'instagram',
  'music.apple.com': 'itunes',
  'kickstarter.com': 'kickstarter',
  'kik.com': 'kik',
  'last.fm': 'lastfm',
  'badoo.com': 'badoo',
  'linkedin.com': 'linkedin',
  'medium.com': 'medium',
  'meetup.com': 'meetup',
  'messenger.com': 'messenger',
  'myspace.com': 'myspace',
  'pscp.tv': 'periscope',
  'pinterest.com': 'pinterest',
  'quora.com': 'quora',
  'reddit.com': 'reddit',
  'skype.com': 'skype',
  'snapchat.com': 'snapchat',
  'soundcloud.com': 'soundcloud',
  'spotify.com': 'spotify',
  'tinder.com': 'tinder',
  tripadvisor: 'tripadvisor',
  'tumblr.com': 'tumblr',
  'twitter.com': 'twitter',
  'uber.com': 'uber',
  'vimeo.com': 'vimeo',
  'vk.com': 'vk',
  'whatsapp.com': 'whatsapp',
  'yelp.com': 'yelp',
  'youtube.com': 'youtube',
};
