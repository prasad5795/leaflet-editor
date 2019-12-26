import { FETCH_USER_DONE } from '../actions'

const initialState = {}

const userReducer = (previousState = initialState, action) => {
  switch (action.type) {
  case FETCH_USER_DONE:
    return {
      ...action.payload,
      duplicateButtonAllowed: action.payload.roles.includes('ROLE_QTEAM'),
      correlationIdAllowed: action.payload.roles.includes('ROLE_QTEAM')
    }
  default:
    return previousState
  }
}

export default userReducer
