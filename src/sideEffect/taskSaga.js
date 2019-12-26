import { put, delay, select, call, takeEvery, all } from '@redux-saga/core/effects'

import {
  LOADING, 
  GET_EXISTING_GEOMETRY,
  TASK_ERROR,
  GET_TASK_FINISHED, 
  GET_TASK_ERROR,
  POST_TASK_FINISHED,
  POST_TASK_ERROR
} from '../actions'

import baseTaskService from '../services/taskService'

export const getPath = state => state.router.location.pathname

export const getUser = state => state.user

const matchPostCompleteTask = (action) => action.type.match(/POST_COMPLETE_(.*)_TASK/)
const matchGetTask = (action) => action.type.match(/GET_(.*)_TASK/)

export function * postCompletedTaskSaga (action) {
  const type = matchPostCompleteTask(action)[1]
  const fetchType = `GET_${type}_TASK`
  const path = yield select(getPath)
  const user = yield select(getUser)
  const taskService = baseTaskService(type)

  try {
    yield put({
      type: fetchType
    })
    yield call(
      taskService,
      action,
      path,
      user
    )
    yield put({
      type: POST_TASK_FINISHED
    })
  } catch (e) {
    yield put({
      type: fetchType
    })
    
    yield put({
      type: POST_TASK_ERROR,
      error: e.message
    })
  }
}

export function * getTaskSaga (action) {
  const type = matchGetTask(action)[1]
  const path = yield select(getPath)
  const user = yield select(getUser)
  const taskService = baseTaskService(type)

  let error = true
  let retry = 10
  while (error && retry > 0) {
    try {
      let task = yield call(
        taskService,
        action,
        path,
        user
      )
      yield put({
        type: TASK_ERROR,
        payload: false
      })
      yield put({
        type: GET_EXISTING_GEOMETRY,
        payload: task
      })
      yield put({
        type: GET_TASK_FINISHED,
        payload: task
      })
      error = false
    } catch (e) {
      error = true
      yield put({
        type: LOADING,
        payload: true
      })
      yield put({
        type: GET_TASK_ERROR,
        error: e.message
      })
      yield put({
        type: TASK_ERROR,
        payload: e.message
      })
      yield delay(1000)
    }
    retry -= 1
  }
  if (retry === 0) {
    yield put({
      type: LOADING,
      payload: false
    })
  }
}

export default function * taskSaga () {
  yield all([
    takeEvery(matchGetTask, getTaskSaga),
    takeEvery(matchPostCompleteTask, postCompletedTaskSaga)
  ])
}
