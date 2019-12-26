import { ADD_ACCEPTED_FEATURE_ACTION, ADD_REJECTED_FEATURE_ACTION, TOGGLE_INFO, TOGGLE_LOCATION, LOADING, TASK_ERROR, LOADING_TASK, TOGGLE_REPORT,TOGGLE_SATELITE_LAYER,TOGGLE_PROBE_LAYER } from '../actions/uiActions'
import { POST_COMPLETE_COMPLETENESS_TASK } from '../actions'

const initialState = {
  accepted: 0,
  rejected: 0,
  processed: 0,
  toggleInfo: false,
  toggleLocation: false,
  toggleReport: false,
  taskError: false,
  loading: true,
  loadingTask: false,
  keyboardLock: false,
  sateliteLayerState: true,
  probeLayerState: false,
}

const uiReducer = (previousState = initialState, action) => {
  switch (action.type) {
  case POST_COMPLETE_COMPLETENESS_TASK:
    return {
      ...previousState
    }
  case ADD_ACCEPTED_FEATURE_ACTION:
    return {
      ...previousState,
      accepted: previousState.accepted + action.payload,
      processed: previousState.processed + 1
    }
  case ADD_REJECTED_FEATURE_ACTION:
    return {
      ...previousState,
      rejected: previousState.rejected + action.payload,
      processed: previousState.processed + 1
    }
  case TOGGLE_INFO:
    return {
      ...previousState,
      toggleInfo: !previousState.toggleInfo,
      keyboardLock: !previousState.toggleInfo
    }
  case TOGGLE_LOCATION:
    return {
      ...previousState,
      toggleLocation: !previousState.toggleLocation
    }
  case TOGGLE_REPORT:
    return {
      ...previousState,
      toggleReport: !previousState.toggleReport,
      keyboardLock: !previousState.toggleReport
    }
  case LOADING:
    return {
      ...previousState,
      loading: action.payload
    }
  case LOADING_TASK:
    return {
      ...previousState,
      loadingTask: action.payload
    }
  case TASK_ERROR:
    return {
      ...previousState,
      taskError: action.payload
    }
  case TOGGLE_SATELITE_LAYER:
    return {
      ...previousState,
      sateliteLayerState: !previousState.sateliteLayerState,
      probeLayerState: !previousState.probeLayerState
    }
  case TOGGLE_PROBE_LAYER:
    return {
      ...previousState,
      probeLayerState: !previousState.probeLayerState
    }
  default:
    return previousState
  }
}

export default uiReducer
