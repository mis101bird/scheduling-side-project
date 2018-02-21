import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import Routes from './Routes'

if (process.env.NODE_ENV !== 'production') {
  console.log('===== Development =====') // eslint-disable-line
} else {
  console.log('===== Production =====') // eslint-disable-line
}

ReactDOM.render(
  <Routes />,
  document.getElementById('app'),
)

// Hot Module Replacement API
if (module.hot) {
  module.hot.accept('./Routes', () => {
    const NextRoutes = require('./Routes').default // eslint-disable-line
    ReactDOM.render(
      <AppContainer>
        <NextRoutes />
      </AppContainer>,
      document.getElementById('app'),
    )
  })
}
