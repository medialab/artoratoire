import React from 'react';
import {render} from 'react-dom';
import App from './App.js';

const mountNode = document.getElementById('app');

render(<App />, mountNode);

// Hot reload
if (module.hot) {
  // Whenever a new version of App.js is available
  module.hot.accept("./App", () => {
    // Require the new version and render it instead
    const NextApp = require('./App').default;
    render(<NextApp />, mountNode);
  });
}