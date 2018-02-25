import { combineReducers } from 'redux'
import { reducer as app } from './pages/App'
import { reducer as home } from './pages/Home'
import { reducer as login } from './pages/Login'

export default combineReducers({
  app,
  home,
  login,
})
