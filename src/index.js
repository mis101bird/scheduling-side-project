import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { view as App } from './pages/App'
import store from './store'

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
  module.hot.accept('./pages/App', () => {
    const NextApp = require('./pages/App/view/index').default // eslint-disable-line
    ReactDOM.render(
      <Provider store={store}>
        <NextApp />
      </Provider>,
      document.getElementById('app'),
    )
  })
}
