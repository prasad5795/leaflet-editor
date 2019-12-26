import { takeEvery, put, all, call } from '@redux-saga/core/effects'
import { GET_EXISTING_GEOMETRY, GET_EXISTING_GEOMETRY_FINISHED, GET_EXISTING_GEOMETRY_ERROR, LOADING, LOADING_TASK } from '../actions'
import geometryService from '../services/geometryService'

export function * getExistingGeometrySaga (action) {
  try {
    yield put({
      type: LOADING_TASK,
      payload: true
    })
    const existingGeometry = yield call(
      geometryService,
      action
    )
    yield put({
      type: GET_EXISTING_GEOMETRY_FINISHED,
      payload: existingGeometry
    })
    yield put({
      type: LOADING,
      payload: false
    })
    yield put({
      type: LOADING_TASK,
      payload: false
    })
  } catch (e) {
    yield put({
      type: GET_EXISTING_GEOMETRY_ERROR,
      error: e.message
    })
    yield put({
      type: LOADING_TASK,
      payload: false
    })
  }
}

export default function * geometrySaga () {
  yield all([
    takeEvery(GET_EXISTING_GEOMETRY, getExistingGeometrySaga)
  ])
}
