import { takeEvery, put, all, call } from '@redux-saga/core/effects'
import { cloneableGenerator } from '@redux-saga/testing-utils'
import { getExistingGeometrySaga } from '../../sideEffect/geometrySaga'
import { GET_EXISTING_GEOMETRY, GET_EXISTING_GEOMETRY_FINISHED, GET_EXISTING_GEOMETRY_ERROR, LOADING_TASK } from '../../actions'
import geometryService from '../../services/geometryService'
import UnableToFetchGeometryError from '../../errors/UnableToFetchGeometryError'

const existingGeometry = {
  'existing': 'geometry'
}
const path = '/validation'

let nextTask = {
  feature: {
    geometry: {
      coordinates: [[51, 4]]
    }
  }
}
const action = {
  type: GET_EXISTING_GEOMETRY,
  payload: nextTask
}

describe('getExistingGeometrySaga', () => {
  let generator = null
  let successClone = null
  let failureClone = null

  beforeAll(() => {
    generator = cloneableGenerator(getExistingGeometrySaga)(action)
  })  
  
  it('should put loading_task to true', () => {
    const expected = put({
      type: LOADING_TASK,
      payload: true
    })
    const actual = generator.next()
    expect(actual.value).toEqual(expected)
  })
  
  it('should call geometryService', () => {
    const expected = call(geometryService, action)
    const actual = generator.next(existingGeometry)
    expect(actual.value).toEqual(expected)
  })
  
  it('clones the generator', () => {
    successClone = generator.clone()
    failureClone = generator.clone()
  })

  it('should put getExistingGeometryFinished in case of success', () => {
    const expected = put({
      type: GET_EXISTING_GEOMETRY_FINISHED,
      payload: existingGeometry
    })
    const actual = successClone.next(existingGeometry)
    expect(actual.value).toEqual(expected)
  })

  it('should put error in case of error', () => {
    const expected = put({
      type: GET_EXISTING_GEOMETRY_ERROR,
      error: new UnableToFetchGeometryError().message
    })
    const actual = failureClone.throw(new UnableToFetchGeometryError())
    expect(actual.value).toEqual(expected)
  })
})
