import * as ActionTypes from '../constants/actionTypes'

export const changeFormFields = formFieldsChange => ({
  type: ActionTypes.USERFORM_EDITFORM_CHANGE,
  field: formFieldsChange,
})
