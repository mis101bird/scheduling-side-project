import { INCREMENT, DECREMENT } from './actionTypes'

export default (state = {}, action) => {
  switch (action.type) {
    case INCREMENT:
      return { ...state, value: (state.value || 0) + 1 }
    case DECREMENT:
      return { ...state, value: (state.value || 0) - 1 }
    default:
      return state
  }
}
