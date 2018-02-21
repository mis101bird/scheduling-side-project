import { createStore, combineReducers, applyMiddleware, compose } from 'redux'

const win = window

const reducer = combineReducers({
  // reducer map
})

const middlewares = []
if (process.env.NODE_ENV !== 'production') {
  // middlewares.push(require('redux-immutable-state-invariant')())
}

// const storeEnhancers = compose(
//   applyMiddleware(...middlewares),
//   (win && win.devToolsExtension) ? win.devToolsExtension() : f => f,
// )

const initialState = {}

export default createStore(reducer, initialState)

