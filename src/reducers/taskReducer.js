import { GET_TASK_FINISHED, GET_TASK_ERROR } from '../actions/taskActions'

const initialState = {}

const taskReducer = (previousState = initialState, action) => {
  switch (action.type) {
  case GET_TASK_FINISHED:
    return {
      ...action.payload
    }
  case GET_TASK_ERROR:
    return {
      error: action.error
    }
  default:
    return { ...previousState }
  }
}

export default taskReducer
