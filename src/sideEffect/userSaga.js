import { takeEvery, call, all, put } from '@redux-saga/core/effects'
import { FETCH_USER, FETCH_USER_DONE, FETCH_USER_ERROR } from '../actions'
import userService from '../services/userService'

export function * fetchUserSaga (action) {
  try {
    const user = yield call(
      userService,
      action
    )
    yield put({
      type: FETCH_USER_DONE,
      payload: user
    })
  } catch (e) {
    yield put({
      type: FETCH_USER_ERROR,
      error: e
    })
  }
}

export default function * userSaga () {
  yield all([
    takeEvery(FETCH_USER, fetchUserSaga)
  ])
}