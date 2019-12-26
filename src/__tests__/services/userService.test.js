import userService from '../../services/userService'
import nock from 'nock'
import { FETCH_USER } from '../../actions'
import axios from 'axios'

const USER = {
  id: 'test@tomtom.com'
}

describe('User Service Test', () => {
  afterAll(() => {
    nock.cleanAll()
    nock.restore()
  })
  let getUser
  beforeEach(() => {
    getUser = jest.spyOn(axios, 'get')
  })
  afterEach(() => {
    getUser.mockRestore()
  })

  it('should return the user object executing fetch user', async () => {
    getUser.mockImplementation(() => Promise.resolve({ status: 200, data: USER }))

    await expect(userService({
      type: FETCH_USER
    })).resolves.toEqual(USER)
  })
})
