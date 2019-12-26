import reducer from '../../reducers/existingGeometryReducer'
import * as types from '../../actions/geometryActions'

describe('geometry reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual({})
  })

  it('should handle new geometry', () => {
    expect(
      reducer({}, {
        type: types.GET_EXISTING_GEOMETRY_FINISHED,
        payload: {
          'object': 'new geom'
        }
      })
    ).toEqual({
      'object': 'new geom'
    })
  })
})
