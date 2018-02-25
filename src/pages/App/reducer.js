import {
  APP_LOGIN,
  APP_LOGOUT,
} from '../../constants/actionTypes'

export default (state = {}, action) => {
  switch (action.type) {
    case APP_LOGIN:
      localStorage.setItem('accessToken', action.email)
      return {
        ...state,
        accessToken: action.email,
      }
    case APP_LOGOUT:
      localStorage.removeItem('accessToken')
      return {
        ...state,
        accessToken: null,
      }
    default:
      return state
  }
}
