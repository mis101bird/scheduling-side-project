import { createStore, applyMiddleware, compose } from 'redux'
import thunkMiddleware from 'redux-thunk'
import reducer from './reducers'
import moment from 'moment'
import _ from 'lodash'
import homeStore from '../mock/store/easyHome'

const win = window

// For test
const mockInitialState = {
  app: {
    accessToken: window.localStorage.getItem('accessToken'),
  },
  home: {
    fields: homeStore
  }
}

/**
 * fullTimeRes: { name, ..., [yyyy/mm/dd]: { includes: [], excludes: [], preferIncludes: [], preferExcludes: [] } }
 */
const configureStore = () => {
  const initialState = {
    app: {
      accessToken: window.localStorage.getItem('accessToken'),
    },
    home: {
      fields: {
        holidays: [],
        scheduleTimes: [],
        humanResDefs: [],
        fullTimeRes: [],
        partTimeRes: [],
        scheduleClassDefs: []
      }
    }
  }

  const middlewares = [thunkMiddleware]
  if (process.env.NODE_ENV !== 'production') {
    middlewares.push(require('redux-immutable-state-invariant').default()) // eslint-disable-line
    middlewares.push(require('redux-logger').default) // eslint-disable-line
  }

  const storeEnhancers = compose(
    applyMiddleware(...middlewares),
    (win && win.devToolsExtension) ? win.devToolsExtension() : f => f,
  )

  const store = createStore(reducer, process.env.MOCK == 1 ? mockInitialState : initialState, storeEnhancers)

  if (module.hot) {
    module.hot.accept('./reducers', () => {
      const nextReducer = require('./reducers').default // eslint-disable-line
      store.replaceReducer(nextReducer)
    })
  }
  return store
}

export default configureStore()
