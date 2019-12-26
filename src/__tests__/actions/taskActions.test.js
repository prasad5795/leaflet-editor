import * as actions from '../../actions/taskActions'
import nock from 'nock'

let TASK = {
  feature: {
    geometry: {
      coordinates: [[51, 4]]
    }
  },
  id: '742358ae-4a60-11e9-8a96-0a58a9feac2a',
  branch: '00000000-0000-0000-0000-000000000000',
  version: 123456
}

describe('actions', () => {
  afterAll(() => {
    nock.cleanAll()
    nock.restore()
  })

  it('should create an action to get Validation Task', () => {
    const expectedAction = {
      type: actions.GET_VALIDATION_TASK
    }
    expect(actions.getValidationTask()).toEqual(expectedAction)
  })

  it('should create an action to Post Validation Task Result', () => {
    const expectedAction = {
      type: actions.POST_COMPLETE_VALIDATION_TASK,
      body: TASK
    }
    expect(actions.postCompletedValidationTask(TASK)).toEqual(expectedAction)
  })

  it('should create an action to get Realignment Task', () => {
    const expectedAction = {
      type: actions.GET_REALIGNMENT_TASK
    }
    expect(actions.getRealignmentTask()).toEqual(expectedAction)
  })

  it('should create an action to Post Realignment Task Result', () => {
    const expectedAction = {
      type: actions.POST_COMPLETE_REALIGNMENT_TASK,
      body: TASK
    }
    expect(actions.postCompletedRealignmentTask(TASK)).toEqual(expectedAction)
  })

  it('should create an action to get Edit Task', () => {
    const expectedAction = {
      type: actions.GET_EDIT_TASK
    }
    expect(actions.getEditTask()).toEqual(expectedAction)
  })

  it('should create an action to Post Edit Task Result', () => {
    const expectedAction = {
      type: actions.POST_COMPLETE_EDIT_TASK,
      body: TASK
    }
    expect(actions.postCompletedEditTask(TASK)).toEqual(expectedAction)
  })
  
  it('should create an action to Post Completeness Task Result', () => {
    const expectedAction = {
      type: actions.POST_COMPLETE_COMPLETENESS_TASK,
      body: TASK
    }
    expect(actions.postCompletedCompletenessTask(TASK)).toEqual(expectedAction)
  })

  it('should create an action to Get Completeness Task', () => {
    const expectedAction = {
      type: actions.GET_COMPLETENESS_TASK
    }
    
    expect(actions.getCompletenessTask()).toEqual(expectedAction)
  })

  it('should create an action to get a Filler(Kicker) Task', () => {
    const expectedAction = {
      type: actions.GET_FILL_TASK
    }
    expect(actions.getFillTask()).toEqual(expectedAction)
  })
  
  it('should create an action to Post Fill Task Result', () => {
    const expectedAction = {
      type: actions.POST_COMPLETE_FILL_TASK,
      body: TASK
    }
    expect(actions.postCompletedFillTask(TASK)).toEqual(expectedAction)
  })

  it('should create an action to get a Source Validation Task', () => {
    const expectedAction = {
      type: actions.GET_SOURCE_VALIDATION_TASK
    }
    expect(actions.getSourceValidationTask()).toEqual(expectedAction)
  })
  
  it('should create an action to Post Source Validation Task Result', () => {
    const expectedAction = {
      type: actions.POST_COMPLETE_SOURCE_VALIDATION_TASK,
      body: TASK
    }
    expect(actions.postCompletedSourceValidationTask(TASK)).toEqual(expectedAction)
  })

  it('should create an action to get a Deletion Task', () => {
    const expectedAction = {
      type: actions.GET_DELETION_TASK
    }
    expect(actions.getDeletionTask()).toEqual(expectedAction)
  })

  it('should create an action to Post Deletion Task Result', () => {
    const expectedAction = {
      type: actions.POST_COMPLETE_DELETION_TASK,
      body: TASK
    }
    expect(actions.postCompletedDeletionTask(TASK)).toEqual(expectedAction)
  })

  it('should create an action to get a Shift Task', () => {
    const expectedAction = {
      type: actions.GET_SHIFT_TASK
    }
    expect(actions.getShiftTask()).toEqual(expectedAction)
  })

  it('should create an action to Post Shift Task Result', () => {
    const expectedAction = {
      type: actions.POST_COMPLETION_SHIFT_TASK,
      body: TASK
    }
    expect(actions.postCompletedShiftTask(TASK)).toEqual(expectedAction)
  })

})
