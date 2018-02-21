import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'

const win = window

const reducer = combineReducers({
  // reducer map
})

const middlewares = [thunk]
if (process.env.NODE_ENV !== 'production') {
  middlewares.push(require('redux-immutable-state-invariant').default()) // eslint-disable-line
  middlewares.push(require('redux-logger').default) // eslint-disable-line
}

const storeEnhancers = compose(
  applyMiddleware(...middlewares),
  (win && win.devToolsExtension) ? win.devToolsExtension() : f => f,
)

const initialState = {}

export default createStore(reducer, initialState, storeEnhancers)

