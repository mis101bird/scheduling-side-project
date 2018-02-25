import * as ActionTypes from '../../constants/actionTypes'

export const logout = () => (dispatch) => {
  dispatch({ type: ActionTypes.APP_LOGOUT })
}
