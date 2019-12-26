export const ADD_ACCEPTED_FEATURE_ACTION = 'ADD_ACCEPTED_FEATURE_ACTION'
export const ADD_REJECTED_FEATURE_ACTION = 'ADD_REJECTED_FEATURE_ACTION'
export const TOGGLE_INFO = 'TOGGLE_INFO'
export const TOGGLE_LOCATION = 'TOGGLE_LOCATION'
export const LOADING = 'LOADING'
export const LOADING_TASK = 'LOADING_TASK'
export const TASK_ERROR = 'TASK_ERROR'
export const TOGGLE_REPORT = 'TOGGLE_REPORT'
export const TOGGLE_SATELITE_LAYER = 'TOGGLE_SATELITE'
export const TOGGLE_PROBE_LAYER = 'TOGGLE_PROBE'

export const addAcceptedFeature = (acceptedLength) => {
  return ({
    type: ADD_ACCEPTED_FEATURE_ACTION,
    payload: acceptedLength
  })
}

export const addRejectedFeature = (rejectedLength) => {
  return ({
    type: ADD_REJECTED_FEATURE_ACTION,
    payload: rejectedLength
  })
}

export const toggleInfo = () => ({
  type: TOGGLE_INFO
})

export const toggleLocation = () => ({
  type: TOGGLE_LOCATION
})

export const loading = (status) => ({
  type: LOADING,
  payload: status
})

export const loadingTask = (status) => ({
  type: LOADING_TASK,
  payload: status
})

export const toggleReport = () => ({
  type: TOGGLE_REPORT
})

export const toggleSateliteLayer = () => ({
  type: TOGGLE_SATELITE_LAYER
})

export const toggleProbeLayer = () => ({
  type: TOGGLE_PROBE_LAYER
})
