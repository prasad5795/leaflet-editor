import * as actions from '../../actions/uiActions'

describe('actions', () => {
  it('should create an action to add Accepted Feature Length', () => {
    const expectedAction = {
      type: actions.ADD_ACCEPTED_FEATURE_ACTION,
      payload: 10
    }
    expect(actions.addAcceptedFeature(10)).toEqual(expectedAction)
  })
})

describe('actions', () => {
  it('should create an action to add Rejected Feature Length', () => {
    const expectedAction = {
      type: actions.ADD_REJECTED_FEATURE_ACTION,
      payload: 10
    }
    expect(actions.addRejectedFeature(10)).toEqual(expectedAction)
  })
})

describe('actions', () => {
  it('should create an action to toggle info', () => {
    const expectedAction = {
      type: actions.TOGGLE_INFO
    }
    expect(actions.toggleInfo()).toEqual(expectedAction)
  })
})

describe('actions', () => {
  it('should create an action to toggle location', () => {
    const expectedAction = {
      type: actions.TOGGLE_LOCATION
    }
    expect(actions.toggleLocation()).toEqual(expectedAction)
  })
})
