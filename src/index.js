import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import App from './App'

if (process.env.NODE_ENV !== 'production') {
  console.log('===== Development =====') // eslint-disable-line
} else {
  console.log('===== Production =====') // eslint-disable-line
}

ReactDOM.render(
  <App />,
  document.getElementById('app'),
)

// Hot Module Replacement API
if (module.hot) {
  module.hot.accept('./App', () => {
    const NextApp = require('./App').default // eslint-disable-line
    ReactDOM.render(
      <AppContainer>
        <NextApp />
      </AppContainer>,
      document.getElementById('app'),
    )
  })
}
