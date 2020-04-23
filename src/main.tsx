import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import Root from 'src/components/Root/Root';
import { rootReducer } from 'src/reducers';

const store = createStore(rootReducer);

const chromeOnSteroidsReactRootElement = document.getElementById(
  'chrome-on-steroids'
);

ReactDOM.render(
  <Provider store={store}>
    <Root />
  </Provider>,
  chromeOnSteroidsReactRootElement
);
