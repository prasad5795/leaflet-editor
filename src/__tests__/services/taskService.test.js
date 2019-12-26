import nock from 'nock'
import axios from 'axios'
import { getTask, postCompleteTask } from '../../services/taskService'
import NoTaskError from '../../errors/NoTaskError'
import UnableToFetchTaskError from '../../errors/UnableToFetchTaskError'
import baseTaskService from '../../services/taskService'

const TASK_ID = 100
const TEST_TASK = { id: TASK_ID, variables: { feature: 'LEAD' } }
const RECEIVED_TASK = {
  id: TASK_ID,
    feature: 'LEAD',
}
const TASK_PROVIDER_ERROR_404 = { response: { status: 404 } }
const TASK_PROVIDER_ERROR_500 = { response: { status: 500 } }
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
const PATH = '/tori'
const PATH_WITH_GROUP = `${PATH}/validator/group/test`
const GET_TEST_TASK = 'GET_ValidateFeature_TASK'
const POST_COMPLETE_TEST_TASK = 'POST_COMPLETE_ValidateFeature_TASK'

const FETCH_ENDPOINT = 'https://tori-staging.maps-pu-core-dev.amiefarm.com/tori-task-provider/ValidateFeature/tasks'
const COMPLETE_ENDPOINT = 'https://tori-staging.maps-pu-core-dev.amiefarm.com/tori-task-provider/tasks'

describe('Task Service getTask Test', () => {
  afterAll(() => {
    nock.cleanAll()
    nock.restore()
  })
  
  let mockGet
  
  beforeEach(() => {
    mockGet = jest.spyOn(axios, 'get')
  })

  afterEach(() => {
    mockGet.mockRestore()
  })

  it('should return the task object executing get task and receiving the task list', async () => {
    mockGet.mockImplementation(() => Promise.resolve({ data: TEST_TASK }))
    await expect(getTask(FETCH_ENDPOINT, PATH, USER)).resolves.toEqual(RECEIVED_TASK)
  })

  it('should return error executing get task when receiving an empty list', async () => {
    mockGet.mockImplementation(() => Promise.reject(TASK_PROVIDER_ERROR_404))
    await expect(getTask(FETCH_ENDPOINT, PATH, USER)).rejects.toThrow(NoTaskError)
  })

  it('should return an error when attempting to retrieve a task in case the backend returns an HTTP 500 status code', async () => {
    mockGet.mockImplementation(() => Promise.reject(TASK_PROVIDER_ERROR_500))

    await expect(getTask(FETCH_ENDPOINT, PATH, USER)).rejects.toThrow(UnableToFetchTaskError)
  })

  it('should include the group parameter when present', async () => {
    mockGet.mockImplementation((url, options) => {
      if (options.params.get('group') === 'test') {
        return Promise.resolve({ data: TEST_TASK })
      } else {
        return Promise.reject(options.params)
      }
    })

    await expect(getTask(FETCH_ENDPOINT, PATH_WITH_GROUP, USER)).resolves.toEqual(RECEIVED_TASK)
  })
})
  
describe('Task Service postCompletedTask Test', () => {
  afterAll(() => {
    nock.cleanAll()
    nock.restore()
  })
  
  let mockPost

  beforeEach(() => {
    mockPost = jest.spyOn(axios, 'post')
  })

  afterEach(() => {
    mockPost.mockRestore()
  })

  it('should include post the task completion', async () => {
    const taskId = 'anId'
    const taskBody = { value: 'theBody', id: taskId }
    const expectedBody = { value: 'theBody' }
    mockPost.mockImplementation((url, body, options) => {
      const bodyEquals = JSON.stringify(body) === JSON.stringify(expectedBody)
      if (COMPLETE_ENDPOINT + `/${taskId}/done` === url && bodyEquals) {
        return Promise.resolve(true)
      } else {
        return Promise.reject(false)
      }
    })

    await expect(postCompleteTask(COMPLETE_ENDPOINT, { body: taskBody }, USER)).resolves.toEqual(true)
  })
})

describe('taskService', () => {
  afterAll(() => {
    nock.cleanAll()
    nock.restore()
  })
  
  let mockPost
  let mockGet
  let taskService

  beforeEach(() => {
    mockPost = jest.spyOn(axios, 'post')
    mockGet = jest.spyOn(axios, 'get')
    taskService = baseTaskService('ValidateFeature')
  })

  afterEach(() => {
    mockPost.mockRestore()
    mockGet.mockRestore()
  })

  it('should fetch task on GET action', async () => {
    mockGet.mockImplementation((url) => {
      if (FETCH_ENDPOINT === url) {
        return Promise.resolve({ data: TEST_TASK })
      } else {
        return Promise.reject(false)
      }
    })

    await expect(taskService({ type: GET_TEST_TASK }, '', USER)).resolves.toEqual(RECEIVED_TASK)
  })

  it('should complete task on POST action', async () => {
    const taskId = 'anId'
    const taskBody = { value: 'theBody', id: taskId }
    const expectedBody = { value: 'theBody' }
    mockPost.mockImplementation((url, body, options) => {
      const bodyEquals = JSON.stringify(body) === JSON.stringify(expectedBody)
      if ((COMPLETE_ENDPOINT + `/${taskId}/done`) === url && bodyEquals) {
        return Promise.resolve(true)
      } else {
        return Promise.reject(false)
      }
    })

    await expect(taskService({ type: POST_COMPLETE_TEST_TASK, body: taskBody }, '', USER)).resolves.toEqual(true)
  })

  it('should reject invalid types', () => {
    expect(() => { baseTaskService('JUNK') }).toThrow(Error)
  })
})