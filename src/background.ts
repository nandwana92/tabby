import { actionTypes, keyboardShortcuts } from './constants';
import { getActiveTab, sendMessageToActiveTab } from './utils';

chrome.commands.onCommand.addListener((command) => {
  switch (command) {
    case keyboardShortcuts.TOGGLE_VISIBILITY:
      getActiveTab().then((tab) => {
        chrome.tabs.sendMessage(tab.id, {
          type: actionTypes.TOGGLE_VISIBILITY,
        });
      });

    default:
      break;
  }
});

chrome.runtime.onMessage.addListener((request) => {
  const { type } = request;

  switch (type) {
    case actionTypes.TOGGLE_MUTE:
      const { tabId, muted } = request;

      chrome.tabs.update(
        tabId,
        {
          muted,
        },
        (tab) => {
          sendMessageToActiveTab({
            type: actionTypes.MUTE_TOGGLED,
            data: tab,
          });
        }
      );

      break;

    case actionTypes.GET_TABS_REQUEST:
      chrome.tabs.query({}, (tabs) => {
        sendMessageToActiveTab({
          type: actionTypes.GET_TABS_SUCCESS,
          data: tabs,
        });
      });

      break;
  }
});

chrome.tabs.onUpdated.addListener(
  (
    tabId: number,
    changeInfo: chrome.tabs.TabChangeInfo,
    tab: chrome.tabs.Tab
  ) => {
    sendMessageToActiveTab({
      type: actionTypes.TAB_UPDATED,
      data: {
        tabId,
        changeInfo,
        tab,
      },
    });
  }
);
