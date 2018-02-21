import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './Store'
import App from './pages/App'

const Routes = () => (
  <Provider store={store}>
    <BrowserRouter>
      <Switch>
        <Route exact path='/' component={App} />
        <Route path='/login' component={App} />
      </Switch>
    </BrowserRouter>
  </Provider>
)

export default Routes
