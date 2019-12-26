import reducer from '../../reducers/taskReducer'
import * as types from '../../actions/taskActions'

describe('task reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual({})
  })

  it('should handle task finished', () => {
    expect(
      reducer({}, {
        type: types.GET_TASK_FINISHED,
        payload: {
          id: '12345670',
          feature: { 'feature': 'object' }
        }
      })
    ).toEqual({
      id: '12345670',
      feature: { 'feature': 'object' }
    })
  })

  it('should handle next task error', () => {
    expect(
      reducer({}, {
        type: types.GET_TASK_ERROR,
        error: 'No More Tasks'
      })
    ).toEqual({ error: 'No More Tasks' })
  })

  it('should replace task with error in case of error', () => {
    expect(
      reducer({
        id: '12345670',
        feature: {
          'feature': 'object'
        }
      }, {
        type: types.GET_TASK_ERROR,
        error: 'No More Tasks'
      })
    ).toEqual({ error: 'No More Tasks' })
  })
})
