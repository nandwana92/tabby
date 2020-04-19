function getActiveTab(): Promise<chrome.tabs.Tab> {
  return new Promise((resolve) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      resolve(tabs[0]);
    });
  });
}

function sendMessageToActiveTab(action) {
  getActiveTab().then((tab) => {
    if (typeof tab !== 'undefined') {
      chrome.tabs.sendMessage(tab.id, action);
    } else {
      console.error('tab property is undefined');
    }
  });
}

export { getActiveTab, sendMessageToActiveTab };
