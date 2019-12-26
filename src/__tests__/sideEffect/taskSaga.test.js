import { call, put, select, delay } from 'redux-saga/effects'
import { cloneableGenerator } from '@redux-saga/testing-utils'
import { getPath, getUser, postCompletedTaskSaga, getTaskSaga } from '../../sideEffect/taskSaga'
import { GET_EXISTING_GEOMETRY, GET_TASK_FINISHED, TASK_ERROR, LOADING, GET_TASK_ERROR, POST_TASK_ERROR, POST_TASK_FINISHED } from '../../actions'
import UnableToFetchTaskError from '../../errors/UnableToFetchTaskError'
import taskService from '../../services/taskService'


jest.mock('../../services/taskService')
const mockTaskService = jest.fn()
taskService.mockImplementation(() => mockTaskService)

const PATH = '/test'

const GET_TEST_TASK = 'GET_correction_TASK'
const TEST_ACTION = {
  type: GET_TEST_TASK
}

const POST_COMPLETE_TEST_TASK = 'POST_COMPLETE_correction_TASK'
const TEST_COMPLETE_ACTION = {
  type: POST_COMPLETE_TEST_TASK
}

const TASK = {
  feature: {
    geometry: {
      coordinates: [[51, 4]]
    }
  }
}
const USER = {
  id: 'test@tomtom.com',
  roles: [
    'ROLE_USER'
  ],
  authorization: {
    jwtAccessToken: '1.2.3',
    jwtDataToken: '4.5.6'
  }
}

describe('getTaskSaga', () => {
    let generator = null
    let successClone = null
    let failureClone = null
  
    beforeAll(() => {
      generator = cloneableGenerator(getTaskSaga)(TEST_ACTION)
    })
  
    it('clones the generator', () => {
      successClone = generator.clone()
      failureClone = generator.clone()
    })

    it('should retrieve path from state', () => {
      const expected = select(getPath)
      const actual = successClone.next()
      expect(actual.value).toEqual(expected)
    })

    it('should retrieve user from state', () => {
      const expected = select(getUser)
      // return expected response from previous succesClone
      const actual = successClone.next(PATH)
      expect(actual.value).toEqual(expected)
    })
  
    it('should call taskService', () => {
      const expected = call(mockTaskService, TEST_ACTION, PATH, USER)
      // return expected response from previous succesClone
      const actual = successClone.next(USER)
      expect(actual.value).toEqual(expected)
    })
  
    it('should put task_error to false', () => {
      const expected = put({
        type: TASK_ERROR,
        payload: false
      })
      const actual = successClone.next(TASK)
      expect(actual.value).toEqual(expected)
    })
  
    it('should put get existing geometry', () => {
      const expected = put({
        type: GET_EXISTING_GEOMETRY,
        payload: TASK
      })
      const actual = successClone.next(TASK)
      expect(actual.value).toEqual(expected)
    })
  
    it('should put get next TASK finished', () => {
      const expected = put({
        type: GET_TASK_FINISHED,
        payload: TASK
      })
      const actual = successClone.next(TASK)
      expect(actual.value).toEqual(expected)
    })
  
    it('should put get_next_task_error and try 10 times', () => {
      let expected = select(getPath)
      let actual = failureClone.next()
      expect(actual.value).toEqual(expected)
      
      expected = select(getUser)
      actual = failureClone.next(PATH)
      expect(actual.value).toEqual(expected)
  
      let retry = 10
      while (retry > 0) {
        let expected = call(mockTaskService, TEST_ACTION, PATH, USER)
        let actual = failureClone.next(USER)
        expect(actual.value).toEqual(expected)
  
        const errorEffect = failureClone.throw(new UnableToFetchTaskError())
        expected = put({
          type: LOADING,
          payload: true
        })
        expect(errorEffect.value).toEqual(expected)
  
        expected = put({
          type: GET_TASK_ERROR,
          error: new UnableToFetchTaskError().message
        })
        actual = failureClone.next()
        expect(actual.value).toEqual(expected)
  
        expected = put({
          type: TASK_ERROR,
          payload: new UnableToFetchTaskError().message
        })
        actual = failureClone.next()
        expect(actual.value).toEqual(expected)
  
        expected = delay(1000)
        actual = failureClone.next()
        expect(actual.value).toEqual(expected)
  
        retry -= 1
      }
    })
  })

  
describe('postCompletedTaskSaga', () => {
  let generator = null
  let successClone = null
  let failureClone = null
  let taskService = null

  beforeAll(() => {
    taskService = jest.fn()
    generator = cloneableGenerator(postCompletedTaskSaga)(TEST_COMPLETE_ACTION)
  })

  it('should retrieve path from state', () => {
    const expected = select(getPath)
    const actual = generator.next()
    expect(actual.value).toEqual(expected)
  })

  it('should retrieve user from state', () => {
    const expected = select(getUser)
    const actual = generator.next(PATH)
    expect(actual.value).toEqual(expected)
  })
  
  it(`${PATH} should put getTask`, () => {
    const expected = put(TEST_ACTION)
    const actual = generator.next(USER)
    expect(actual.value).toEqual(expected)
  })

  it(`${PATH} should call taskService`, () => {
    const expected = call(mockTaskService, TEST_COMPLETE_ACTION, PATH, USER)
    const actual = generator.next()
    expect(actual.value).toEqual(expected)
  })

  it('clones the generator', () => {
    successClone = generator.clone()
    failureClone = generator.clone()
  })

  it('should put postFinishedTask', () => {
    const expected = put({ type: POST_TASK_FINISHED })
    const actual = successClone.next()
    expect(actual.value).toEqual(expected)
  })

  it('should put getTask after error', () => {
    const expected = put({ type: GET_TEST_TASK })
    const actual = failureClone.throw('complete task error')
    expect(actual.value).toEqual(expected)
  })

  it('should put postFinishedTaskError', () => {
    const expected = put({ type: POST_TASK_ERROR })
    const actual = failureClone.next('complete task error')
    expect(actual.value).toEqual(expected)
  })
})