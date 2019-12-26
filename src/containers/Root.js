import React from 'react'
import Router from './Router'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import appReducer from '../reducers'
import { composeWithDevTools } from 'redux-devtools-extension'
import createSagaMiddleware from 'redux-saga'
import { fork, all } from '@redux-saga/core/effects'
import Sagas from '../sideEffect'
import { createBrowserHistory } from 'history'
import { ConnectedRouter, routerMiddleware } from 'connected-react-router'
import application from '../utils/application'

const history = createBrowserHistory({
  basename: application.endpoints.base
})
const saga = function * rootSaga () {
  yield all([
    Sagas()
  ].map(fork)
  )
}
const sagaMiddleware = createSagaMiddleware()
const store = createStore(
  appReducer(history),
  {},
  composeWithDevTools(applyMiddleware(sagaMiddleware, routerMiddleware(history)))
)
sagaMiddleware.run(saga)

class Root extends React.Component {
  render () {
    return (
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <Router />
        </ConnectedRouter>
      </Provider>
    )
  }
}

export default Root
