import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { reducer as homeReducer } from './pages/Home'

const win = window

const reducer = combineReducers({
  home: homeReducer,
})

const middlewares = []
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

