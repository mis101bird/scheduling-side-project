import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import App from './App'
import configureStore from './store'

const store = configureStore()

if (process.env.NODE_ENV !== 'production') {
  console.log('===== Development =====') // eslint-disable-line
} else {
  console.log('===== Production =====') // eslint-disable-line
}

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app'),
)

// Hot Module Replacement API
if (module.hot) {
  module.hot.accept('./App', () => {
    const NextApp = require('./App').default // eslint-disable-line
    ReactDOM.render(
      <Provider store={store}>
        <NextApp />
      </Provider>,
      document.getElementById('app'),
    )
  })
}
