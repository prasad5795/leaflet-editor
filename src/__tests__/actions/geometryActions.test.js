import * as actions from '../../actions/geometryActions'

describe('actions', () => {
  it('should create an action to get Existing Geometry', () => {
    const payload = [51, 4]
    const expectedAction = {
      type: actions.GET_EXISTING_GEOMETRY,
      payload
    }
    expect(actions.getExistingGeometry(payload)).toEqual(expectedAction)
  })
})
