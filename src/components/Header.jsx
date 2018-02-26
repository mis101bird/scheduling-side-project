import React from 'react'
import { Layout, Menu } from 'antd'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { logout } from '../actions/app'

const { Header } = Layout

class CustomisedHeader extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.handleMenuItemOnClick = this.handleMenuItemOnClick.bind(this)
  }

  handleMenuItemOnClick(item) {
    switch (item.key) {
      case 'home':
        this.props.history.push('/')
        break
      case 'login':
        this.props.history.push('/login')
        break
      case 'dashboard':
        this.props.history.push('/admin/dashboard')
        break
      case 'profile':
        this.props.history.push('/admin/profile')
        break
      case 'logout':
        this.props.handleAppLogOut()
        break
      default:
    }
  }

  render() {
    const { isLoggedIn } = this.props
    return (
      <Header>
        <Menu
          theme='dark'
          mode='horizontal'
          selectable={false}
          style={{ lineHeight: '64px' }}
          onClick={this.handleMenuItemOnClick}
        >
          <Menu.Item key='home'>Home</Menu.Item>
          { !isLoggedIn && <Menu.Item key='login'>Login</Menu.Item> }
          { isLoggedIn && <Menu.Item key='dashboard'>Dashboard</Menu.Item> }
          { isLoggedIn && <Menu.Item key='profile'>Profile</Menu.Item> }
          { isLoggedIn && <Menu.Item key='logout'>Logout</Menu.Item> }
        </Menu>
      </Header>
    )
  }
}

const mapStateToProps = (state) => {
  const isLoggedIn = !!state.app.accessToken
  return { isLoggedIn }
}

const mapDispatchToProps = dispatch => ({
  handleAppLogOut: () => dispatch(logout()),
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CustomisedHeader))
