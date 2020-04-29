import Fuse from 'fuse.js';
import set from 'lodash/set';

import { ActionTypes } from 'src/constants';
import {
  Keys,
  keyLabels,
  partialHostnameToFilenameMapping,
} from 'src/constants';
import { IAppState } from 'src/types';

function getFilenameFromURL(url: string): string {
  const urlInstance = new URL(url);
  const hostname = urlInstance.hostname;

  // Part of the hostname is mapped against the corresponding filename. The
  // subdomain part of the hostname is being ignore for matching. There can some false
  // matches as well and isn't exactly very optimised way to do this. This is a very
  // naïve approach but works well for this simple use case.

  for (const key in partialHostnameToFilenameMapping) {
    if (partialHostnameToFilenameMapping.hasOwnProperty(key)) {
      const filename = partialHostnameToFilenameMapping[key];

      if (hostname.includes(key)) {
        return filename;
      }
    }
  }

  return 'default';
}

function getWebsiteIconPathFromFilename(filename: string): string {
  return chrome.runtime.getURL(`images/apps/${filename}.svg`);
}

function handleToggleMuteButtonClick(tab: chrome.tabs.Tab) {
  if (tab) {
    const { audible } = tab;

    if (!audible) {
      return;
    }

    const { muted } = tab.mutedInfo;
    const updatedMutedValue = !muted;

    updateMutedState(tab.id, updatedMutedValue);
  }
}

function updateMutedState(tabId: number, muted: boolean) {
  chrome.runtime.sendMessage({
    type: ActionTypes.TOGGLE_MUTE,
    tabId,
    muted,
  });
}

function jumpToTab(tabId: number, windowId: number) {
  setFocussedWindow(windowId);
  setActiveTab(tabId);
}

function setFocussedWindow(windowId: number) {
  chrome.runtime.sendMessage({
    type: ActionTypes.SET_FOCUSSED_WINDOW,
    windowId,
  });
}

function setActiveTab(tabId: number) {
  chrome.runtime.sendMessage({
    type: ActionTypes.SET_ACTIVE_TAB,
    tabId,
  });
}

function dispatchToggleVisibilityAction() {
  chrome.runtime.sendMessage({
    type: ActionTypes.DISPATCH_TOGGLE_VISIBILITY,
  });
}

function transformIntoFuseResultLikeShape<T>(items: T[]): Fuse.FuseResult<T>[] {
  return items.map((item) => ({
    item,
    refIndex: -1,
  }));
}

function getHighlightedHTMLStrings<T>(
  fuseResult: Fuse.FuseResult<T>,
  className: string = 'highlight'
): Record<string, string> {
  const matches: readonly Fuse.FuseResultMatch[] | undefined =
    fuseResult.matches;
  const result = {};

  if (typeof matches === 'undefined') {
    return result;
  }

  matches.forEach((match) => {
    const { key, value, indices: regions } = match;
    let htmlString = '';
    let nextUnhighlightedRegionStartingIndex = 0;

    regions.forEach((region) => {
      const lastRegionNextIndex = region[1] + 1;

      htmlString += [
        value.substring(nextUnhighlightedRegionStartingIndex, region[0]),
        `<span class="${className}">`,
        value.substring(region[0], lastRegionNextIndex),
        '</span>',
      ].join('');

      nextUnhighlightedRegionStartingIndex = lastRegionNextIndex;
    });

    htmlString += value.substring(nextUnhighlightedRegionStartingIndex);

    result[key] = htmlString;
  });

  return result;
}

function getInitialReduxState(platformInfo): IAppState {
  const { os } = platformInfo;

  const keyboardShortcuts = [
    {
      label: `Toggle Tez's visibility`,
      shortcut: `<kbd>${
        keyLabels[Keys.COMMAND][os]
      }</kbd>+<kbd>Shift</kbd>+<kbd>Space</kbd>`,
    },
    {
      label: `Jump back to previous tab`,
      shortcut: `<kbd>${
        keyLabels[Keys.COMMAND][os]
      }</kbd>+<kbd>Shift</kbd>+<kbd>U</kbd>`,
    },
    {
      label: `Toggle <i>Audible Tabs Only</i> switch`,
      shortcut: `<kbd>${keyLabels[Keys.COMMAND][os]}</kbd>+<kbd>S</kbd>`,
    },
    {
      label: `Jump to nth tab in the results`,
      shortcut: `<kbd>Shift</kbd>+<kbd>[1-9]</kbd>`,
    },
    {
      label: `Toggle mute for nth tab in the results`,
      shortcut: `<kbd>${keyLabels[Keys.OPTION][os]}</kbd>+<kbd>[1-9]</kbd>`,
    },
  ];

  return {
    showAudibleTabsOnly: false,
    isChromeOnSteroidsVisible: false,
    platformInfo,
    keyboardShortcuts,
  };
}

export {
  getFilenameFromURL,
  getWebsiteIconPathFromFilename,
  handleToggleMuteButtonClick,
  dispatchToggleVisibilityAction,
  jumpToTab,
  transformIntoFuseResultLikeShape,
  getInitialReduxState,
  getHighlightedHTMLStrings,
};
