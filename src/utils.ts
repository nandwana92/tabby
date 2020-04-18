function getActiveTab(): Promise<chrome.tabs.Tab> {
  return new Promise((resolve) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      resolve(tabs[0]);
    });
  });
}

function sendMessageToActiveTab(action) {
  getActiveTab().then((tab) => {
    chrome.tabs.sendMessage(tab.id, action);
  });
}

export { getActiveTab, sendMessageToActiveTab };
