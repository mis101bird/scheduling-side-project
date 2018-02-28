import {
  LOGIN_EDITFORM_CHANGE,
  LOGIN_LOGIN_LOAD,
  LOGIN_LOGIN_SUCCEED,
  LOGIN_LOGIN_FAIL,
} from '../constants/actionTypes'

export default (state = {}, action) => {
  switch (action.type) {
    case LOGIN_EDITFORM_CHANGE:
      return { ...state, formFieldValues: { ...state.formFieldValues, ...action.field }, isLoading: false }
    case LOGIN_LOGIN_LOAD:
      return { ...state, isLoading: true }
    case LOGIN_LOGIN_SUCCEED:
      return { ...state, formFieldValues: {}, isLoading: false }
    case LOGIN_LOGIN_FAIL:
      return { ...state, isLoading: false }
    default:
      return state
  }
}
