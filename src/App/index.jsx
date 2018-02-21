import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import { view as Header } from '../components/Header'

// Pages
import Home from '../pages/Home'
import Login from '../pages/Login'
import Admin from '../pages/Admin'
import NotFound from '../pages/NotFound'

import './index.less'

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) => {
      const accessToken = !!localStorage.getItem('access_token')
      console.log(localStorage.getItem('access_token'))
      console.log('access_token', accessToken)
      return (
        accessToken
        ? <Component {...props} />
        : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
      )
    }}
  />
)

export default class App extends React.Component {
  render() {
    return (
      <div>
        <Header />
        <Switch>
          <Route exact path='/' component={Home} />
          <Route path='/login' component={Login} />
          <PrivateRoute path='/admin' component={Admin} />
          <Route component={NotFound} />
        </Switch>
        <h1 className='title'>Footer</h1>
      </div>
    )
  }
}
