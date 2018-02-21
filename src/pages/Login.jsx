import React from 'react'
import { Redirect } from 'react-router-dom'

export default class Login extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      redirectToReferrer: false,
    }
    this.login = this.login.bind(this)
  }

  login() {
    localStorage.setItem('access_token', '123')
    this.setState({ redirectToReferrer: true })
  }

  render() {
    const { from } = this.props.location.state || { from: { pathname: '/admin' } }
    const { redirectToReferrer } = this.state
    if (redirectToReferrer) {
      return (
        <Redirect to={from} />
      )
    }

    return (
      <div>
        <button onClick={this.login}>Log in</button>
      </div>
    )
  }
}
