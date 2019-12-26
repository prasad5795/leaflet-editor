import geometryService from '../../services/geometryService'
import { GET_EXISTING_GEOMETRY } from '../../actions'
import nock from 'nock'
import axios from 'axios'

const FEATURES = [{
  type: 'Feature',
  geometry: {
    type: 'LineString',
    coordinates: [[0, 0], [0, 1]]
  },
  properties: {}
}]

const emptyUrlParams = new URLSearchParams()
const BRANCH = "aBranch"
const VERSION = 123546
const TIMESTAMP = 56789
const urlParams = new URLSearchParams()
urlParams.set('branchId', BRANCH)
urlParams.set('version', VERSION)
const urlDateParam = new URLSearchParams()
urlDateParam.set('date', Date.parse(TIMESTAMP))
urlDateParam.set('branchId', process.env.REACT_APP_GEOMETRY_BRANCHID)

describe('Geometry Service Test', () => {
  afterAll(() => {
    nock.cleanAll()
    nock.restore()
  })

  let getGeometry
  beforeEach(() => {
    getGeometry = jest.spyOn(axios, 'get').mockImplementation(() => Promise.resolve({ data: FEATURES }))
  })
  afterEach(() => {
    getGeometry.mockRestore()
  })

  it('sends request to the endpoint and works with null branch and version', () => {
    geometryService({
      type: GET_EXISTING_GEOMETRY,
      payload: {
        feature: {
          geometry: {
            type: 'LineString',
            coordinates: [[4, 51]]
          }
        },
        branch: null,
        version: null
      }
    })

    expect(getGeometry).toHaveBeenCalledTimes(1)
    expect(getGeometry).toHaveBeenCalledWith("https://tori-staging.maps-pu-core-dev.amiefarm.com/tori-cdb-geojson/getFeatureCollection/51/4/10000", { params:emptyUrlParams })
  })

  it('sends request to the endpoint when branch and version are not null', () => {
    geometryService({
      type: GET_EXISTING_GEOMETRY,
      payload: {
        feature: {
          geometry: {
            type: 'LineString',
            coordinates: [[4, 51]]
          }
        },
        branch: BRANCH,
        version: VERSION
      }
    })

    expect(getGeometry).toHaveBeenCalledTimes(1)
    expect(getGeometry).toHaveBeenCalledWith("https://tori-staging.maps-pu-core-dev.amiefarm.com/tori-cdb-geojson/getFeatureCollection/51/4/10000", { params: urlParams })
  })

  it('resolves to correct value and works with undefined branch and version', async () => {
    await expect(geometryService({
      type: GET_EXISTING_GEOMETRY,
      payload: {
        feature: {
          geometry: {
            type: 'LineString',
            coordinates: [[4, 51]]
          }
        },
        branch: undefined,
        version: undefined
      }
    })).resolves.toEqual(FEATURES)
    expect(getGeometry).toHaveBeenCalledTimes(1)
    expect(getGeometry).toHaveBeenCalledWith("https://tori-staging.maps-pu-core-dev.amiefarm.com/tori-cdb-geojson/getFeatureCollection/51/4/10000", { params: emptyUrlParams })
  })

  it('sends request to the endpoint when branch, version and timestamp are not null but without date (date and version can not be used together, version has priority in our case)', () => {
    geometryService({
      type: GET_EXISTING_GEOMETRY,
      payload: {
        feature: {
          geometry: {
            type: 'LineString',
            coordinates: [[4, 51]]
          }
        },
        branch: BRANCH,
        version: VERSION,
        timestamp: TIMESTAMP
      }
    })

    expect(getGeometry).toHaveBeenCalledTimes(1)
    expect(getGeometry).toHaveBeenCalledWith("https://tori-staging.maps-pu-core-dev.amiefarm.com/tori-cdb-geojson/getFeatureCollection/51/4/10000", { params: urlParams })
  })

  it('sends request to the endpoint when date is set and version is null', () => {
    geometryService({
      type: GET_EXISTING_GEOMETRY,
      payload: {
        feature: {
          geometry: {
            type: 'LineString',
            coordinates: [[4, 51]]
          }
        },
        timestamp: TIMESTAMP
      }
    })

    expect(getGeometry).toHaveBeenCalledTimes(1)
    expect(getGeometry).toHaveBeenCalledWith("https://tori-staging.maps-pu-core-dev.amiefarm.com/tori-cdb-geojson/getFeatureCollection/51/4/10000", { params: urlDateParam })
  })

})
