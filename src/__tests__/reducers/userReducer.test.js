import reducer from '../../reducers/userReducer'
import * as types from '../../actions/userActions'

describe('user reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual({})
  })

  it('should handle user fetch finished', () => {
    expect(
      reducer({}, {
        type: types.FETCH_USER_DONE,
        payload: {
          id: 'test@tomtom.com',
          roles: ['role']
        }
      })
    ).toEqual({
      id: 'test@tomtom.com',
      roles: ['role'],
      duplicateButtonAllowed: false,
      correlationIdAllowed: false
    })
  })

  it('should determine that duplicate button is allowed', () => {
    expect(
      reducer({}, {
        type: types.FETCH_USER_DONE,
        payload: {
          id: 'test@tomtom.com',
          roles: ['role', 'ROLE_QTEAM']
        }
      })
    ).toEqual({
      id: 'test@tomtom.com',
      roles: ['role', 'ROLE_QTEAM'],
      duplicateButtonAllowed: true,
      correlationIdAllowed: true
    })
  })
})
