import React from 'react'
import { Layout, Menu, Modal, Icon } from 'antd'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { logout } from '../../actions/app'
import './index.less'

const { Header } = Layout

class CustomisedHeader extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.handleMenuItemOnClick = this.handleMenuItemOnClick.bind(this)
  }

  handleMenuItemOnClick(item) {
    switch (item.key) {
      case 'login':
        this.props.history.push('/login')
        break
      case 'admin':
        this.props.history.push('/admin')
        break
      case 'logout': {
        const handleAppLogOut = () => {
          this.props.handleAppLogOut()
          this.props.history.push('/login')
        }
        Modal.confirm({
          title: 'Logout',
          content: 'Are you sure you want to log out?',
          onOk() {
            handleAppLogOut()
          },
          onCancel() {
            // console.log('Cancel')
          },
        })
        break
      }
      default:
    }
  }

  render() {
    const { isLoggedIn } = this.props
    return (
      <Header className='app-header'>
        <div className='logo'>
        <Icon type='schedule' style={{ fontSize: '18px', margin: '0 9px' }} />
          排班系統
        </div>
        <Menu
          theme='dark'
          mode='horizontal'
          selectable={false}
          style={{ lineHeight: '64px' }}
          onClick={this.handleMenuItemOnClick}
        >
          { !isLoggedIn && <Menu.Item key='login'>登入</Menu.Item> }
          { isLoggedIn && <Menu.Item key='admin'>管理者</Menu.Item> }
          { isLoggedIn && <Menu.Item key='logout'>登出</Menu.Item> }
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
