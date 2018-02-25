import React from 'react'
import { Card } from 'antd'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { changeFormFields, login } from '../actions'
import Form from './Form'
import './index.less'

class Login extends React.Component {
  render() {
    const { isLoggedIn } = this.props
    if (isLoggedIn) {
      return <Redirect to={{ pathname: '/admin' }} />
    }
    return (
      <div className='login-page'>
        <Card>
          <Form
            onSubmit={this.props.handleFormOnSubmit}
            onFieldsChange={this.props.handleFormOnFieldsChange}
            formFieldValues={this.props.formFieldValues}
            isLoading={this.props.isLoading}
          />
        </Card>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  const {
    formFieldValues,
    isLoading,
  } = state.login
  const isLoggedIn = !!state.app.accessToken
  return {
    formFieldValues,
    isLoading,
    isLoggedIn,
  }
}

const mapDispatchToProps = dispatch => ({
  handleFormOnSubmit: formValues => dispatch(login(formValues)),
  handleFormOnFieldsChange: formFieldsChange => dispatch(changeFormFields(formFieldsChange)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Login)
