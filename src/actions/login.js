import { message } from 'antd'
import * as ActionTypes from '../constants/actionTypes'
import { login } from './app'

export const changeFormFields = formFieldsChange => ({
  type: ActionTypes.LOGIN_EDITFORM_CHANGE,
  field: formFieldsChange,
})

export const sendLoginRequest = values => (dispatch) => {
  dispatch({ type: ActionTypes.LOGIN_LOGIN_LOAD })
  // fake login
  window.setTimeout(() => {
    message.success('You have logged in.')
    dispatch(login({ accessToken: values.email }))
    dispatch({ type: ActionTypes.LOGIN_LOGIN_SUCCEED })
  }, 1000)
}
