import {
  CHANGE_SCHEDULE_FIELDS
} from '../constants/actionTypes'

export default (state = {}, action) => {
  switch (action.type) {
    case CHANGE_SCHEDULE_FIELDS:
      return {
        ...state,
        fields: {
          ...state.fields,
          ...action.payload
        }
      }
    default:
      return state
  }
}
