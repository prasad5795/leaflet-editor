import { call, put } from 'redux-saga/effects'
import { FETCH_USER, FETCH_USER_DONE } from '../../actions'
import { fetchUserSaga } from '../../sideEffect/userSaga'
import userService from '../../services/userService'
import { cloneableGenerator } from '@redux-saga/testing-utils'

let USER = {
  id: 'test@tomtom.com'
}

describe('fetchUserSaga', () => {
  let generator = null
  let successClone = null

  beforeAll(() => {
    generator = cloneableGenerator(fetchUserSaga)({ type: FETCH_USER })
  })

  it('clones the generator', () => {
    successClone = generator.clone()
  })

  it('should call userService', () => {
    const expected = call(userService, { type: FETCH_USER })
    const actual = successClone.next(USER)
    expect(actual.value).toEqual(expected)
  })

  it('should put user fetch to done', () => {
    const expected = put({
      type: FETCH_USER_DONE,
      payload: USER
    })
    const actual = successClone.next(USER)
    expect(actual.value).toEqual(expected)
  })
})