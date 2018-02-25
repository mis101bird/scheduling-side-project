import { message } from 'antd'
import * as ActionTypes from '../../constants/actionTypes'

export const changeFormFields = (formFieldsChange) => {
  return {
    type: ActionTypes.LOGIN_CHANGE,
    field: formFieldsChange,
  }
}

export const login = values => (dispatch) => {
  dispatch({ type: ActionTypes.LOGIN_LOADING })
  // fake login
  window.setTimeout(() => {
    message.success('You have logged in.')
    dispatch({
      type: ActionTypes.APP_LOGIN,
      email: values.email,
    })
    dispatch({ type: ActionTypes.LOGIN_SUCCESSFUL })
  }, 1000)
}
