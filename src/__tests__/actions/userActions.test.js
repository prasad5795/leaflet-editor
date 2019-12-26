import * as actions from '../../actions/userActions'

describe('actions', () => {
  it('should fetch user details', () => {
    const expectedAction = {
      type: actions.FETCH_USER
    }
    expect(actions.fetchUser()).toEqual(expectedAction)
  })
})
