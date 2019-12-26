import { all } from '@redux-saga/core/effects'
import geometrySaga from './geometrySaga'
import userSaga from './userSaga'
import taskSaga from './taskSaga'

export default () =>
  function * admin () {
    yield all([
      userSaga(),
      geometrySaga(),
      taskSaga()
    ])
  }
