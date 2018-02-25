import * as ActionTypes from './actionTypes'

export const logout = () => (dispatch) => {
  dispatch({ type: ActionTypes.APP_LOGOUT })
}
