import { message } from 'antd'
import * as ActionTypes from '../constants/actionTypes'
import { login } from './app'

export const changeFormFields = formFieldsChange => ({
  type: ActionTypes.LOGIN_CHANGE,
  field: formFieldsChange,
})

export const sendLoginRequest = values => (dispatch) => {
  dispatch({ type: ActionTypes.LOGIN_LOADING })
  // fake login
  window.setTimeout(() => {
    message.success('You have logged in.')
    dispatch(login({ accessToken: values.email }))
    dispatch({ type: ActionTypes.LOGIN_SUCCESSFUL })
  }, 1000)
}
