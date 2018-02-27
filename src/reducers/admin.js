import {
  ADMIN_OPENCHANGE_SUBMENU,
} from '../constants/actionTypes'

export default (state = {}, action) => {
  switch (action.type) {
    case ADMIN_OPENCHANGE_SUBMENU:
      return {
        ...state,
        openKeys: action.openKeys,
      }
    default:
      return state
  }
}
