import { actionTypes, keyboardShortcuts } from './constants';
import { getActiveTab, sendMessageToActiveTab } from './backgroundUtils';

chrome.commands.onCommand.addListener((command) => {
  switch (command) {
    case keyboardShortcuts.TOGGLE_VISIBILITY: {
      sendMessageToActiveTab({
        type: actionTypes.TOGGLE_VISIBILITY,
      });

      break;
    }

    default:
      break;
  }
});

chrome.runtime.onMessage.addListener(
  (request, sender: chrome.runtime.MessageSender) => {
    const { type } = request;

    switch (type) {
      case actionTypes.TOGGLE_MUTE: {
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
      }

      case actionTypes.DISPATCH_TOGGLE_VISIBILITY: {
        sendMessageToActiveTab({
          type: actionTypes.TOGGLE_VISIBILITY,
        });
      }

      case actionTypes.GET_ACTIVE_TAB_REQUEST: {
        if (sender.tab) {
          sendMessageToActiveTab({
            type: actionTypes.GET_ACTIVE_TAB_SUCCESS,
            data: sender.tab,
          });
        } else {
          throw new Error('Sender is not a tab');
        }

        break;
      }

      case actionTypes.SET_FOCUSSED_WINDOW: {
        const { windowId } = request;

        chrome.windows.update(
          windowId,
          {
            focused: true,
          },
          (window) => {
            sendMessageToActiveTab({
              type: actionTypes.FOCUSSED_WINDOW_CHANGED,
              data: window,
            });
          }
        );

        break;
      }

      case actionTypes.SET_ACTIVE_TAB: {
        const { tabId } = request;

        chrome.tabs.update(
          tabId,
          {
            active: true,
          },
          (tab) => {
            sendMessageToActiveTab({
              type: actionTypes.ACTIVE_TAB_CHANGED,
              data: tab,
            });
          }
        );

        break;
      }

      case actionTypes.GET_TABS_REQUEST: {
        chrome.tabs.query({}, (tabs) => {
          sendMessageToActiveTab({
            type: actionTypes.GET_TABS_SUCCESS,
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
      type: actionTypes.TAB_UPDATED,
      data: {
        tabId,
        changeInfo,
        tab,
      },
    });
  }
);
