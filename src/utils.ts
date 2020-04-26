import Fuse from 'fuse.js';
import set from 'lodash/set';

import { actionTypes } from 'src/constants';
import { partialHostnameToFilenameMapping } from 'src/constants';
import { ITabWithHighlightedText } from 'src/types';

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

function generateHighlightedText(
  inputText: string,
  regions: ReadonlyArray<Fuse.RangeTuple> = [],
  highlightClassName: string
) {
  let content = '';
  let nextUnhighlightedRegionStartingIndex = 0;

  regions.forEach((region) => {
    const lastRegionNextIndex = region[1] + 1;

    content += [
      inputText.substring(nextUnhighlightedRegionStartingIndex, region[0]),
      `<span class="${highlightClassName}">`,
      inputText.substring(region[0], lastRegionNextIndex),
      '</span>',
    ].join('');

    nextUnhighlightedRegionStartingIndex = lastRegionNextIndex;
  });

  content += inputText.substring(nextUnhighlightedRegionStartingIndex);

  return content;
}

function highlight(
  fuseSearchResults: Fuse.FuseResult<chrome.tabs.Tab>[],
  highlightClassName: string
): ITabWithHighlightedText[] {
  return fuseSearchResults
    .filter(({ matches }) => matches.length > 0)
    .map(({ item, matches }) => {
      const itemShallowCopy: ITabWithHighlightedText = {
        ...item,
      };

      matches.forEach((match) => {
        set(
          itemShallowCopy,
          `${match.key}Highlighted`,
          generateHighlightedText(
            match.value,
            match.indices,
            highlightClassName
          )
        );
      });

      return itemShallowCopy;
    });
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
    type: actionTypes.TOGGLE_MUTE,
    tabId,
    muted,
  });
}

function handleGoToTabButtonClick(tab: chrome.tabs.Tab) {
  dispatchToggleVisibilityAction();
  setFocussedWindow(tab.windowId);
  setActiveTab(tab.id);
}

function setFocussedWindow(windowId) {
  chrome.runtime.sendMessage({
    type: actionTypes.SET_FOCUSSED_WINDOW,
    windowId,
  });
}

function setActiveTab(tabId) {
  chrome.runtime.sendMessage({
    type: actionTypes.SET_ACTIVE_TAB,
    tabId,
  });
}

function dispatchToggleVisibilityAction() {
  chrome.runtime.sendMessage({
    type: actionTypes.DISPATCH_TOGGLE_VISIBILITY,
  });
}

export {
  getFilenameFromURL,
  getWebsiteIconPathFromFilename,
  highlight,
  handleToggleMuteButtonClick,
  handleGoToTabButtonClick,
};
