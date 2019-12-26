import {
  TYPE_VALIDATION,
  TYPE_COMPLETENESS,
  TYPE_REALIGNMENT,
  TYPE_EDIT,
  TYPE_FILL,
  TYPE_SOURCE_VALIDATION,
  TYPE_DELETION,
  TYPE_SHIFT
} from '../services/taskService'

export const GET_VALIDATION_TASK = `GET_${TYPE_VALIDATION}_TASK`
export const GET_COMPLETENESS_TASK = `GET_${TYPE_COMPLETENESS}_TASK`
export const GET_REALIGNMENT_TASK = `GET_${TYPE_REALIGNMENT}_TASK`
export const GET_EDIT_TASK = `GET_${TYPE_EDIT}_TASK`
export const GET_FILL_TASK = `GET_${TYPE_FILL}_TASK`
export const GET_SOURCE_VALIDATION_TASK = `GET_${TYPE_SOURCE_VALIDATION}_TASK`
export const GET_DELETION_TASK = `GET_${TYPE_DELETION}_TASK`
export const GET_SHIFT_TASK = `GET_${TYPE_SHIFT}_TASK`

export const POST_COMPLETE_VALIDATION_TASK = `POST_COMPLETE_${TYPE_VALIDATION}_TASK`
export const POST_COMPLETE_REALIGNMENT_TASK = `POST_COMPLETE_${TYPE_REALIGNMENT}_TASK`
export const POST_COMPLETE_EDIT_TASK = `POST_COMPLETE_${TYPE_EDIT}_TASK`
export const POST_COMPLETE_COMPLETENESS_TASK = `POST_COMPLETE_${TYPE_COMPLETENESS}_TASK`
export const POST_COMPLETE_FILL_TASK = `POST_COMPLETE_${TYPE_FILL}_TASK`
export const POST_COMPLETE_SOURCE_VALIDATION_TASK = `POST_COMPLETE_${TYPE_SOURCE_VALIDATION}_TASK`
export const POST_COMPLETE_DELETION_TASK = `POST_COMPLETE_${TYPE_DELETION}_TASK`
export const POST_COMPLETION_SHIFT_TASK = `POST_COMPLETE_${TYPE_SHIFT}_TASK`

export const GET_TASK_ERROR = 'GET_TASK_ERROR'
export const GET_TASK_FINISHED = 'GET_TASK_FINISHED'

export const POST_TASK_FINISHED = 'POST_TASK_FINISHED'
export const POST_TASK_ERROR = 'POST_TASK_ERROR'

export const getCompletenessTask = () => ({
  type: GET_COMPLETENESS_TASK
})

export const postCompletedCompletenessTask = (task) => ({
  type: POST_COMPLETE_COMPLETENESS_TASK,
  body: task
})

export const getValidationTask = () => ({
  type: GET_VALIDATION_TASK
})

export const postCompletedValidationTask = (task) => ({
  type: POST_COMPLETE_VALIDATION_TASK,
  body: task
})

export const getRealignmentTask = () => ({
  type: GET_REALIGNMENT_TASK
})

export const postCompletedRealignmentTask = (task) => ({
  type: POST_COMPLETE_REALIGNMENT_TASK,
  body: task
})

export const getEditTask = () => ({
  type: GET_EDIT_TASK
})

export const postCompletedEditTask = (task) => ({
  type: POST_COMPLETE_EDIT_TASK,
  body: task
})

export const getFillTask = () => ({
  type: GET_FILL_TASK
})

export const postCompletedFillTask = (task) => ({
  type: POST_COMPLETE_FILL_TASK,
  body: task
})

export const getSourceValidationTask = () => ({
  type: GET_SOURCE_VALIDATION_TASK
})

export const postCompletedSourceValidationTask = (task) => ({
  type: POST_COMPLETE_SOURCE_VALIDATION_TASK,
  body: task
})

export const getDeletionTask = () => ({
  type: GET_DELETION_TASK
})

export const postCompletedDeletionTask = (task) => ({
  type: POST_COMPLETE_DELETION_TASK,
  body: task
})

export const getShiftTask = () => ({
  type: GET_SHIFT_TASK
})

export const postCompletedShiftTask = (task) => ({
  type: POST_COMPLETION_SHIFT_TASK,
  body: task
})
