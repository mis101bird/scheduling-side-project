import * as ActionTypes from '../constants/actionTypes'

export const login = values => (dispatch) => {
  window.localStorage.setItem('accessToken', values.accessToken)
  dispatch({ type: ActionTypes.APP_LOGIN_SET, accessToken: values.accessToken })
}

export const logout = () => (dispatch) => {
  window.localStorage.removeItem('accessToken')
  dispatch({ type: ActionTypes.APP_LOGOUT_SET })
}
