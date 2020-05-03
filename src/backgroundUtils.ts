import { MessageTypes } from 'src/types';

function getActiveTab(): Promise<chrome.tabs.Tab> {
  return new Promise((resolve) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      resolve(tabs[0]);
    });
  });
}

function getTabById(tabId: number): Promise<chrome.tabs.Tab> {
  return new Promise((resolve) => {
    chrome.tabs.get(tabId, (tab) => {
      resolve(tab);
    });
  });
}

function sendMessageToActiveTab(action: MessageTypes) {
  getActiveTab().then((tab) => {
    const tabId = tab.id;

    if (typeof tabId === 'undefined') {
      return;
    }

    chrome.tabs.sendMessage(tabId, action);
  });
}

export { getActiveTab, getTabById, sendMessageToActiveTab };
