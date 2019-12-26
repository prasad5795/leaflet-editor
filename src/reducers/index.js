import { combineReducers } from 'redux'
import taskReducer from './taskReducer'
import uiReducer from './uiReducer'
import existingGeometryReducer from './existingGeometryReducer'
import userReducer from './userReducer'
import { connectRouter } from 'connected-react-router'

export default (history) =>
  combineReducers({
    task: taskReducer,
    ui: uiReducer,
    existingGeometry: existingGeometryReducer,
    user: userReducer,
    router: connectRouter(history)
  })
