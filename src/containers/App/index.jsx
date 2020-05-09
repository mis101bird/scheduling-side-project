import React from 'react'
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'
import Home from '../Home'
import Login from '../Login'
import NotFound from '../NotFound'
import Dashboard from '../Dashboard'
import UserList from '../UserList'
import UserForm from '../UserForm'
import PrivateRoute from '../../components/PrivateRoute'
import './index.less'

export default class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route path='/' component={Home} />
          <Route component={NotFound} />
        </Switch>
      </BrowserRouter>
    )
  }
}
