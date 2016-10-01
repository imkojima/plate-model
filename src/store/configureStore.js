/* global __DEVELOPMENT__ */
import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import apiMiddleware from '../middleware/api'
import createLogger from 'redux-logger'
import rootReducer from '../reducers'

/*
const logger = createLogger({
  level: 'info',
  collapsed: false,
  logger: console,
  predicate: (getState, action) => true
})
*/

const createStoreWithMiddleware = applyMiddleware(
  thunkMiddleware,
  apiMiddleware,
  createLogger
)(createStore)

export default function configureStore(initialState) {
  const middlewares = [ thunkMiddleware, apiMiddleware ]
  if (__DEVELOPMENT__) {
    middlewares.push(createLogger())
  }

  const store = createStoreWithMiddleware(rootReducer, initialState)
  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers')
      store.replaceReducer(nextRootReducer)
    })
  }
  return store
}
