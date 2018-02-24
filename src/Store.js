import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import { reducer as home } from './pages/Home'

const win = window

export default () => {
  const reducer = combineReducers({
    home,
  })
  const initialState = {}

  const middlewares = []
  if (process.env.NODE_ENV !== 'production') {
    middlewares.push(require('redux-immutable-state-invariant').default()) // eslint-disable-line
    middlewares.push(require('redux-logger').default) // eslint-disable-line
  }

  const storeEnhancers = compose(
    applyMiddleware(...middlewares),
    (win && win.devToolsExtension) ? win.devToolsExtension() : f => f,
  )

  const store = createStore(reducer, initialState, storeEnhancers)
  
  if (module.hot) {
    module.hot.accept(() => {
      const nextRootReducer = combineReducers({
        home,
      })
      const finalReducer = { ...nextRootReducer }
      store.replaceReducer(finalReducer)
    })
  }
  return store
}
