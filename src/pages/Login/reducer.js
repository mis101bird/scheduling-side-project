import {
  LOGIN_CHANGE,
  LOGIN_LOADING,
  LOGIN_SUCCESSFUL,
  LOGIN_FAILED,
} from './actionTypes'

export default (state = {}, action) => {
  switch (action.type) {
    case LOGIN_CHANGE:
      return { ...state, formFieldValues: { ...state.formFieldValues, ...action.field }, isLoading: false }
    case LOGIN_LOADING:
      return { ...state, isLoading: true }
    case LOGIN_SUCCESSFUL:
      return { ...state, formFieldValues: {}, isLoading: false }
    case LOGIN_FAILED:
      return { ...state, isLoading: false }
    default:
      return state
  }
}
