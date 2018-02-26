import React from 'react'
import { connect } from 'react-redux'
import { Switch, Route, Redirect } from 'react-router-dom'
import Dashboard from '../Dashboard'
import Profile from '../Profile'

class Admin extends React.Component {
  render() {
    const { isLoggedIn, match } = this.props
    if (!isLoggedIn) {
      return <Redirect to={{ pathname: '/' }} />
    }
    return (
      <div className='admin-page'>
        <Switch>
          <Route exact path={`${match.url}/`} component={() => <Redirect to={`${match.url}/dashboard`} />} />
          <Route path={`${match.url}/dashboard`} component={Dashboard} />
          <Route path={`${match.url}/profile`} component={Profile} />
        </Switch>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  const isLoggedIn = !!state.app.accessToken
  return { isLoggedIn }
}

export default connect(mapStateToProps)(Admin)
