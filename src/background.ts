import {
  KeyboardShortcuts,
  iframeUrl,
  howToUsePageUrl,
  contentScriptInjectedPath,
} from 'src/constants';
import {
  sendMessageToActiveTab,
  getActiveTab,
  getTabById,
} from 'src/backgroundUtils';
import {
  GET_TABS_REQUEST,
  GET_TABS_SUCCESS,
  SET_FOCUSSED_WINDOW,
  FOCUSSED_WINDOW_CHANGED,
  GET_PLATFORM_INFO_REQUEST,
  GET_PLATFORM_INFO_SUCCESS,
  SET_ACTIVE_TAB,
  ACTIVE_TAB_CHANGED,
  TAB_UPDATED,
  TOGGLE_MUTE,
  MUTE_TOGGLED,
  TOGGLE_VISIBILITY,
  DISPATCH_TOGGLE_VISIBILITY,
  OPEN_URLS_IN_BACKGROUND,
  ExtensionInstallationReason,
} from 'src/types';

let lastActiveTab: chrome.tabs.Tab | null = null;
let currentlyActiveTab: chrome.tabs.Tab | null = null;
let lastFocussedWindowId: number | null = null;
let currentlyFocussedWindowId: number | null = null;
let lastFocussedRealWindowId: number | null = null;
let currentlyFocussedRealWindowId: number | null = null;

chrome.commands.onCommand.addListener((command) => {
  switch (command) {
    case KeyboardShortcuts.TOGGLE_VISIBILITY: {
      sendMessageToActiveTab({
        type: TOGGLE_VISIBILITY,
      });

      injectContentScriptInActiveTab();

      break;
    }

    case KeyboardShortcuts.JUMP_BACK_TO_PREVIOUS_TAB: {
      if (lastActiveTab === null) {
        break;
      }

      const { id: tabId, windowId } = lastActiveTab;

      if (typeof tabId === 'undefined') {
        break;
      }

      chrome.tabs.update(tabId, {
        active: true,
      });

      chrome.windows.update(windowId, {
        focused: true,
      });

      break;
    }

    default:
      break;
  }
});

function injectContentScriptInActiveTab() {
  getActiveTab().then((tab) => {
    injectContentScriptInTab(tab);
  });
}

function injectContentScriptInTab(tab: chrome.tabs.Tab) {
  const { id, url } = tab;

  if (typeof id === 'undefined') {
    return;
  }

  if (typeof url === 'string' && url.length > 0) {
    const urlInstance = new URL(url);
    const originPlusPathname = urlInstance.origin + urlInstance.pathname;

    if (originPlusPathname === iframeUrl) {
      // Close this tab.
      chrome.tabs.remove(id);

      return;
    } else if (originPlusPathname === howToUsePageUrl) {
      return;
    }
  }

  // Chrome doesn't allow injecting scripts in certain pages. chrome://*, Chrome
  // Web Store are blocked.

  chrome.tabs.executeScript(
    id,
    {
      file: contentScriptInjectedPath,
    },
    () => {
      // If executing executeScript throws an error is there a way to catch in a
      // try-catch? Doesn't seem to work because of its async nature seems like.

      const error = chrome.runtime.lastError;

      // If there was an error thrown by this script, it's assumed that it's
      // because of an attemp to inject script on an disallowed tab.
      if (typeof error !== 'undefined') {
        const { index } = tab;

        chrome.tabs.create({
          url: iframeUrl,
          index,
        });
      }
    }
  );
}

chrome.runtime.onMessage.addListener(
  (request, sender: chrome.runtime.MessageSender, sendResponse) => {
    const { type, data } = request;

    switch (type) {
      case TOGGLE_MUTE: {
        const { tabId, muted } = data;

        chrome.tabs.update(
          tabId,
          {
            muted,
          },
          (tab) => {
            if (typeof tab === 'undefined') {
              return;
            }

            sendMessageToActiveTab({
              type: MUTE_TOGGLED,
              data: tab,
            });
          }
        );

        break;
      }

      case OPEN_URLS_IN_BACKGROUND: {
        const { data: listOfUrls } = request;

        sendResponse(openUrlsInNewTabsInBackground(listOfUrls));

        break;
      }

      case DISPATCH_TOGGLE_VISIBILITY: {
        const senderTabId = sender.tab?.id;

        if (typeof senderTabId === 'undefined') {
          break;
        }

        getTabById(senderTabId).then((tab) => {
          injectContentScriptInTab(tab);
        });

        break;
      }

      case GET_PLATFORM_INFO_REQUEST: {
        const senderTabId = sender.tab?.id;

        if (typeof senderTabId === 'undefined') {
          break;
        }

        chrome.runtime.getPlatformInfo((platformInfo) => {
          chrome.tabs.sendMessage(senderTabId, {
            type: GET_PLATFORM_INFO_SUCCESS,
            data: platformInfo,
          });
        });

        break;
      }

      case SET_FOCUSSED_WINDOW: {
        const { data: windowId } = request;

        chrome.windows.update(
          windowId,
          {
            focused: true,
          },
          (window) => {
            sendMessageToActiveTab({
              type: FOCUSSED_WINDOW_CHANGED,
              data: window,
            });
          }
        );

        break;
      }

      case SET_ACTIVE_TAB: {
        const { data: tabId } = request;

        chrome.tabs.update(
          tabId,
          {
            active: true,
          },
          (tab) => {
            if (typeof tab === 'undefined') {
              return;
            }

            sendMessageToActiveTab({
              type: ACTIVE_TAB_CHANGED,
              data: tab,
            });
          }
        );

        break;
      }

      case GET_TABS_REQUEST: {
        chrome.tabs.query({}, (tabs) => {
          sendMessageToActiveTab({
            type: GET_TABS_SUCCESS,
            data: tabs,
          });
        });

        break;
      }

      default:
        break;
    }
  }
);

chrome.tabs.onUpdated.addListener(
  (
    tabId: number,
    changeInfo: chrome.tabs.TabChangeInfo,
    tab: chrome.tabs.Tab
  ) => {
    sendMessageToActiveTab({
      type: TAB_UPDATED,
      data: {
        tabId,
        changeInfo,
        tab,
      },
    });
  }
);

function updateLastActiveTab(tab: chrome.tabs.Tab) {
  if (lastActiveTab === null) {
    lastActiveTab = currentlyActiveTab = tab;
  } else {
    lastActiveTab = currentlyActiveTab;
    currentlyActiveTab = tab;
  }
}

function updateLastFocussedWindowId(windowId: number) {
  if (lastFocussedWindowId === null) {
    lastFocussedWindowId = currentlyFocussedWindowId = windowId;
  } else {
    lastFocussedWindowId = currentlyFocussedWindowId;
    currentlyFocussedWindowId = windowId;
  }
}

chrome.windows.onFocusChanged.addListener((windowId: number) => {
  if (windowId !== chrome.windows.WINDOW_ID_NONE) {
    getActiveTab().then((tab) => {
      if (currentlyFocussedWindowId !== chrome.windows.WINDOW_ID_NONE) {
        if (lastFocussedRealWindowId === null) {
          lastFocussedRealWindowId = currentlyFocussedRealWindowId = windowId;
        } else {
          lastFocussedRealWindowId = currentlyFocussedRealWindowId;
          currentlyFocussedRealWindowId = windowId;
        }

        updateLastActiveTab(tab);
      } else {
        if (tab.windowId !== lastFocussedWindowId) {
          if (lastActiveTab === null) {
            lastActiveTab = currentlyActiveTab = tab;
          } else {
            lastActiveTab = currentlyActiveTab;
            currentlyActiveTab = tab;
          }
        }
      }

      updateLastFocussedWindowId(windowId);
    });
  } else {
    updateLastFocussedWindowId(windowId);
  }
});

chrome.tabs.onActivated.addListener((activeInfo) => {
  const scopedCurrentlyActiveTab = currentlyActiveTab;

  chrome.tabs.get(activeInfo.tabId, (tab) => {
    if (lastActiveTab === null) {
      lastActiveTab = currentlyActiveTab = tab;
    } else {
      const { windowId: lastFocussedRealWindowId } = scopedCurrentlyActiveTab!;
      const { windowId: currentlyFocussedRealWindowId } = tab;

      if (lastFocussedRealWindowId === currentlyFocussedRealWindowId) {
        lastActiveTab = currentlyActiveTab;
        currentlyActiveTab = tab;
      }
    }
  });
});

chrome.runtime.onInstalled.addListener((details) => {
  const { reason } = details;

  // As this is the first time the script has executed post install, there won't
  // be any information around current tab, window, etc. This needs to be set so
  // that the user can be showcased to previous tab feature. Would this feature
  // work if I take out a tab from a window and create another window? Probably not.

  if (reason === ExtensionInstallationReason.INSTALL) {
    chrome.tabs.create({
      url: howToUsePageUrl,
    });
  }
});

function openUrlsInNewTabsInBackground(listOfUrls: string[]) {
  const tabCreationPromises: Promise<chrome.tabs.Tab>[] = [];

  for (const url of listOfUrls) {
    tabCreationPromises.push(
      new Promise((resolve, reject) => {
        chrome.tabs.create(
          {
            url,
            active: false,
          },
          (tab) => {
            resolve(tab);
          }
        );
      })
    );
  }

  return tabCreationPromises;
}
