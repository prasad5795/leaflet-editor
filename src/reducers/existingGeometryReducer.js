import { GET_EXISTING_GEOMETRY_FINISHED, GET_EXISTING_GEOMETRY_ERROR } from '../actions'

const initialState = {}

const existingGeometryReducer = (previousState = initialState, action) => {
  switch (action.type) {
  case GET_EXISTING_GEOMETRY_FINISHED:
    return {
      ...action.payload
    }
  case GET_EXISTING_GEOMETRY_ERROR:
    return {
      error: action.error
    }
  default:
    return previousState
  }
}

export default existingGeometryReducer
