import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { AppContainer } from 'react-hot-loader'
import App from './App'
import store from './Store.js';

if (process.env.NODE_ENV !== 'production') {
  console.log('===== Development mode =====')
} else {
  console.log('===== Production mode =====')
}

ReactDOM.render(
  <App store={store} />,
  document.getElementById('app')
);

// Hot Module Replacement API
if (module.hot) {
  module.hot.accept('./App', () => {
    const NextApp = require('./App').default;
    ReactDOM.render(
      <AppContainer>
        <NextApp store={store} />
      </AppContainer>,
      document.getElementById('App')
    );
  });
}