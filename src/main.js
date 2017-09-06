import React from 'react';
import {render} from 'react-dom';
import App from './App.js';

const mountNode = document.getElementById('app');

render(<App />, mountNode);

// Are we in development mode?
if (module.hot) {
  // Whenever a new version of App.js is available
  module.hot.accept('./App', function () {
    // Require the new version and render it instead
    NextApp = require('./App').default;
    render(<NextApp />, mountNode);
  });
}