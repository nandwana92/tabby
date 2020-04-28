import {
  ActionTypes,
  KeyboardShortcuts,
  contentScriptInjectedPath,
} from 'src/constants';
import { sendMessageToActiveTab, getActiveTab } from 'src/backgroundUtils';

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
        type: ActionTypes.TOGGLE_VISIBILITY,
      });

      injectContentScriptInActiveTab();

      break;
    }
    case KeyboardShortcuts.JUMP_BACK_TO_PREVIOUS_TAB: {
      const { id: tabId, windowId } = lastActiveTab;

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
  chrome.tabs.executeScript({
    file: contentScriptInjectedPath,
  });
}

chrome.runtime.onMessage.addListener(
  (request, sender: chrome.runtime.MessageSender) => {
    const { type } = request;

    switch (type) {
      case ActionTypes.TOGGLE_MUTE: {
        const { tabId, muted } = request;

        chrome.tabs.update(
          tabId,
          {
            muted,
          },
          (tab) => {
            sendMessageToActiveTab({
              type: ActionTypes.MUTE_TOGGLED,
              data: tab,
            });
          }
        );

        break;
      }

      case ActionTypes.DISPATCH_TOGGLE_VISIBILITY: {
        const senderTabId = sender.tab.id;

        chrome.tabs.executeScript(senderTabId, {
          file: contentScriptInjectedPath,
        });
      }

      case ActionTypes.GET_PLATFORM_INFO_REQUEST: {
        const senderTabId = sender.tab.id;

        chrome.runtime.getPlatformInfo((platformInfo) => {
          chrome.tabs.sendMessage(senderTabId, {
            type: ActionTypes.GET_PLATFORM_INFO_SUCCESS,
            data: platformInfo,
          });
        });

        break;
      }

      case ActionTypes.SET_FOCUSSED_WINDOW: {
        const { windowId } = request;

        chrome.windows.update(
          windowId,
          {
            focused: true,
          },
          (window) => {
            sendMessageToActiveTab({
              type: ActionTypes.FOCUSSED_WINDOW_CHANGED,
              data: window,
            });
          }
        );

        break;
      }

      case ActionTypes.SET_ACTIVE_TAB: {
        const { tabId } = request;

        chrome.tabs.update(
          tabId,
          {
            active: true,
          },
          (tab) => {
            sendMessageToActiveTab({
              type: ActionTypes.ACTIVE_TAB_CHANGED,
              data: tab,
            });
          }
        );

        break;
      }

      case ActionTypes.GET_TABS_REQUEST: {
        chrome.tabs.query({}, (tabs) => {
          sendMessageToActiveTab({
            type: ActionTypes.GET_TABS_SUCCESS,
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
      type: ActionTypes.TAB_UPDATED,
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
      const { windowId: lastFocussedRealWindowId } = scopedCurrentlyActiveTab;
      const { windowId: currentlyFocussedRealWindowId } = tab;

      if (lastFocussedRealWindowId === currentlyFocussedRealWindowId) {
        lastActiveTab = currentlyActiveTab;
        currentlyActiveTab = tab;
      }
    }
  });
});
