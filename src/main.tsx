import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import Root from 'src/components/Root/Root';
import { ActionTypes } from 'src/constants';
import { rootReducer } from 'src/reducers';
import { IAppState, AppActions } from 'src/types';
import { getInitialReduxState } from 'src/utils';

class Main {
  constructor() {
    this.registerListeners();
    this.getPlatformInfo();
  }

  private getPlatformInfo() {
    chrome.runtime.sendMessage({ type: ActionTypes.GET_PLATFORM_INFO_REQUEST });
  }

  private mountReact(platformInfo: chrome.runtime.PlatformInfo) {
    const chromeOnSteroidsReactRootElement = document.getElementById(
      'chrome-on-steroids'
    );

    const store = createStore<IAppState, AppActions, {}, never>(
      rootReducer,
      getInitialReduxState(platformInfo)
    );

    ReactDOM.render(
      <Provider store={store}>
        <Root />
      </Provider>,
      chromeOnSteroidsReactRootElement
    );
  }

  private registerListeners() {
    chrome.runtime.onMessage.addListener((request) => {
      const { type } = request;

      switch (type) {
        case ActionTypes.GET_PLATFORM_INFO_SUCCESS: {
          const { data: platformInfo } = request;
          this.mountReact(platformInfo);

          break;
        }
      }
    });
  }
}

// tslint:disable-next-line: no-unused-expression
new Main();
