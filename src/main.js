import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import I18n from 'redux-i18n';

import App from './containers/App/App';
import configureStore from './store/configureStore';

import translations from './translations';

const mountNode = document.getElementById('app');

const store = configureStore();

/*TODO: Persisting the State to the Local Storage*/
function renderApplication(Application) {
  const block = (
    <Provider store={store}>
      <I18n translations={translations}>
        <Application />
      </I18n>
    </Provider>
  );

  render(block, mountNode);
}

renderApplication(App);

if (module.hot) {
  module.hot.accept('./containers/App/App', () => {
    const NextApp = require('./containers/App/App').default;
    renderApplication(NextApp);
  });
}
