import {
  USERFORM_FETCHITEM_LOAD,
  USERFORM_FETCHITEM_SUCCEED,
  USERFORM_FETCHITEM_FAIL,
  USERFORM_EDITFORM_CHANGE,
  USERFORM_ENTER_RESET,
  USERFORM_CREATEITEM_LOAD,
  USERFORM_CREATEITEM_SUCCEED,
  USERFORM_CREATEITEM_FAIL,
  USERFORM_EDITITEM_LOAD,
  USERFORM_EDITITEM_SUCCEED,
  USERFORM_EDITITEM_FAIL,
} from '../constants/actionTypes'

export default (state = {}, action) => {
  switch (action.type) {
    case USERFORM_FETCHITEM_LOAD:
      return { ...state, isFetchItemLoading: true }
    case USERFORM_FETCHITEM_SUCCEED:
      return { ...state, isFetchItemLoading: false, item: action.item }
    case USERFORM_FETCHITEM_FAIL:
      return { ...state, isFetchItemLoading: false }
    case USERFORM_ENTER_RESET:
      return {}
    case USERFORM_EDITFORM_CHANGE:
      return { ...state, formFieldValues: { ...state.formFieldValues, ...action.field } }
    case USERFORM_CREATEITEM_LOAD:
      return { ...state, isCreateItemLoading: true, isCreateItemSuccess: false }
    case USERFORM_CREATEITEM_SUCCEED:
      return { ...state, isCreateItemLoading: false, isCreateItemSuccess: true }
    case USERFORM_CREATEITEM_FAIL:
      return { ...state, isCreateItemLoading: false }
    case USERFORM_EDITITEM_LOAD:
      return { ...state, isEditItemLoading: true, isEditItemSuccess: false }
    case USERFORM_EDITITEM_SUCCEED:
      return { ...state, isEditItemLoading: false, isEditItemSuccess: true }
    case USERFORM_EDITITEM_FAIL:
      return { ...state, isEditItemLoading: false }
    default:
      return state
  }
}
