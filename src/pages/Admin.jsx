import React from 'react'
import { Redirect } from 'react-router-dom'

export default class Admin extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      redirectToReferrer: false,
    }
    this.logout = this.logout.bind(this)
  }

  logout() {
    localStorage.removeItem('access_token')
    this.setState({ redirectToReferrer: true })
  }

  render() {
    const { redirectToReferrer } = this.state
    if (redirectToReferrer) {
      return (
        <Redirect to={{ pathname: '/login' }} />
      )
    }

    return (
      <div>
        <button onClick={this.logout}>Log out</button>
      </div>
    )
  }
}
