import {
  APP_LOGIN,
  APP_LOGOUT,
} from '../constants/actionTypes'

export default (state = {}, action) => {
  switch (action.type) {
    case APP_LOGIN:
      return {
        ...state,
        accessToken: action.accessToken,
      }
    case APP_LOGOUT:
      return {
        ...state,
        accessToken: null,
      }
    default:
      return state
  }
}
