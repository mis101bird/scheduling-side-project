import * as ActionTypes from '../constants/actionTypes'

export const editForm = formFieldsChange => ({
  type: ActionTypes.USERFORM_EDITFORM_CHANGE,
  field: formFieldsChange,
})

export const reset = () => ({
  type: ActionTypes.USERFORM_ENTER_RESET,
})

export const fetchItem = id => (dispatch) => {
  dispatch({ type: ActionTypes.USERFORM_FETCHITEM_LOAD })
  // fake login
  window.setTimeout(() => {
    const item = {
      id,
      first_name: 'KK',
      last_name: 'Chen',
      email: 'kk@bichenkk.com',
    }
    dispatch({
      type: ActionTypes.USERFORM_FETCHITEM_SUCCEED,
      item,
    })
    dispatch({
      type: ActionTypes.USERFORM_EDITFORM_CHANGE,
      field: {
        id: { name: 'id', value: item.id },
        first_name: { name: 'first_name', value: item.first_name },
        last_name: { name: 'last_name', value: item.last_name },
        email: { name: 'email', value: item.email },
      },
    })
  }, 1000)
}

export const createItem = values => (dispatch) => {
  dispatch({ type: ActionTypes.USERFORM_CREATEITEM_LOAD })
  // fake login
  window.setTimeout(() => {
    dispatch({ type: ActionTypes.USERFORM_CREATEITEM_SUCCEED })
    dispatch({ type: ActionTypes.USERFORM_ENTER_RESET })
  }, 1000)
}

export const editItem = values => (dispatch) => {
  dispatch({ type: ActionTypes.USERFORM_EDITITEM_LOAD })
  // fake login
  window.setTimeout(() => {
    dispatch({ type: ActionTypes.USERFORM_EDITITEM_SUCCEED })
  }, 1000)
}
