import React from 'react'
import { connect } from 'react-redux'
import { Card } from 'antd'
import { Redirect } from 'react-router-dom'
import './index.less'

class Admin extends React.Component {
  render() {
    const { isLoggedIn } = this.props
    if (!isLoggedIn) {
      return <Redirect to={{ pathname: '/' }} />
    }
    return (
      <div className='admin-page'>
        <Card>
          <p>Welcome Back!</p>
        </Card>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  const isLoggedIn = !!state.app.accessToken
  return { isLoggedIn }
}

export default connect(mapStateToProps)(Admin)
