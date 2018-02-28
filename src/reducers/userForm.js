import {
  USERFORM_FETCHUSER_LOAD,
  USERFORM_FETCHUSER_SUCCEED,
  USERFORM_FETCHUSER_FAIL,
  USERFORM_EDITFORM_CHANGE,
  USERFORM_CREATEUSER_LOAD,
  USERFORM_CREATEUSER_SUCCEED,
  USERFORM_CREATEUSER_FAIL,
  USERFORM_EDITUSER_LOAD,
  USERFORM_EDITUSER_SUCCEED,
  USERFORM_EDITUSER_FAIL,
} from '../constants/actionTypes'

export default (state = {}, action) => {
  switch (action.type) {
    case USERFORM_FETCHUSER_LOAD:
      return { ...state, isFetchUserLoading: true }
    case USERFORM_FETCHUSER_SUCCEED:
      return { ...state, isFetchUserLoading: false }
    case USERFORM_FETCHUSER_FAIL:
      return { ...state, isFetchUserLoading: false }
    case USERFORM_EDITFORM_CHANGE:
      return { ...state, formFieldValues: { ...state.formFieldValues, ...action.field } }
    case USERFORM_CREATEUSER_LOAD:
      return { ...state, isCreateUserLoading: true }
    case USERFORM_CREATEUSER_SUCCEED:
      return { ...state, isCreateUserLoading: false }
    case USERFORM_CREATEUSER_FAIL:
      return { ...state, isCreateUserLoading: false }
    case USERFORM_EDITUSER_LOAD:
      return { ...state, isEditUserLoading: true }
    case USERFORM_EDITUSER_SUCCEED:
      return { ...state, isEditUserLoading: false }
    case USERFORM_EDITUSER_FAIL:
      return { ...state, isEditUserLoading: false }
    default:
      return state
  }
}
