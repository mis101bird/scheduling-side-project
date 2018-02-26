import * as ActionTypes from '../constants/actionTypes'

export const login = values => (dispatch) => {
  localStorage.setItem('accessToken', values.accessToken)
  dispatch({ type: ActionTypes.APP_LOGIN, accessToken: values.accessToken })
}

export const logout = () => (dispatch) => {
  localStorage.removeItem('accessToken')
  dispatch({ type: ActionTypes.APP_LOGOUT })
}
