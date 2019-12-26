import NoTaskError from '../errors/NoTaskError'
import UnableToFetchTaskError from '../errors/UnableToFetchTaskError'
import axios from 'axios'

export const TYPE_COMPLETENESS = 'CompletenessCheck'
export const TYPE_VALIDATION = 'ValidateFeature'
export const TYPE_EDIT = 'CorrectFeature'
export const TYPE_REALIGNMENT = 'ValidateRealignment'
export const TYPE_FILL = 'AddRoadFeatures'
export const TYPE_SOURCE_VALIDATION = 'SourceValidateFeature'
export const TYPE_DELETION = 'ValidateDeletion'
export const TYPE_SHIFT = 'ValidateShift'

const GROUP_REGEX = /.*\/group\/(.*)/
const ALLOWED_TYPES = [
  TYPE_REALIGNMENT,
  TYPE_EDIT,
  TYPE_VALIDATION,
  TYPE_COMPLETENESS,
  TYPE_FILL,
  TYPE_SOURCE_VALIDATION,
  TYPE_DELETION,
  TYPE_SHIFT
]


const TASKS = [
  // { 'feature': { 'type': 'Feature', 'properties': {}, 'geometry': { 'type': 'LineString', 'coordinates': [[3.70894, 51.06276], [3.70894, 51.06276]] } }, 'id': '41a9fdec-a8d9-11e9-9910-0a58a9feac2a' },
  // { 'feature': { 'type': 'Feature', 'properties': {}, 'geometry': { 'type': 'LineString', 'coordinates': [[3.2268111, 50.3748532], [3.2270203, 50.3747019]] } }, 'id': '41a9fdec-a8d9-11e9-9910-0a58a9feac2a' },
  // { 'feature': { 'type': 'Feature', 'properties': {}, 'geometry': { 'type': 'LineString', 'coordinates': [[-69.3484338, -15.5150832], [-69.3484102, -15.5151567]] } }, 'id': '81b42aad-a8a1-11e9-9910-0a58a9feac2a01' },
  // { 'feature': { 'type': 'Feature', 'properties': {}, 'geometry': { 'type': 'LineString', 'coordinates': [[-69.3484023, -15.5151725], [-69.3483897, -15.5151818]] } }, 'id': '81b42aad-a8a1-11e9-9910-0a58a9feac2a02' },
  // { 'feature': { 'type': 'Feature', 'properties': {}, 'geometry': { 'type': 'LineString', 'coordinates': [[-69.3483682, -15.5151856], [-69.3480634, -15.5151042]] } }, 'id': '81b42aad-a8a1-11e9-9910-0a58a9feac2a03' },
  // { 'feature': { 'type': 'Feature', 'properties': {}, 'geometry': { 'type': 'LineString', 'coordinates': [[-69.3477219, -15.5150149], [-69.3476298, -15.5149894]] } }, 'id': '81b42aad-a8a1-11e9-9910-0a58a9feac2a04' },
  // {
  // 	"id": "a5ca3f7c-904f-48e9-856d-1863c8f3654d",
  // 	"parentId": "01f8f230-da33-11e9-80d8-0a58a9feac2a",
  // 	"timestamp": "2019-09-18T16:40:22.204270",
  // 	"type": "ValidateFeature",
  // 	"variables": {
  // 		"CorrelationId": "790ef6a9-4651-40f7-aa63-f2199c502a4e",
  // 		"feature": {
  // 			"geometry": {
  // 				"coordinates": [
  // 					[-70.2943844, 19.2248843],
  // 					[-70.2943361, 19.2248286],
  // 					[-70.2937353, 19.2239776],
  // 					[-70.2936227, 19.2237801],
  // 					[-70.2932793, 19.2232938],
  // 					[-70.2930862, 19.2230709],
  // 					[-70.2928716, 19.2228683],
  // 					[-70.2926785, 19.2226455],
  // 					[-70.2925712, 19.2225442],
  // 					[-70.2924264, 19.222377],
  // 					[-70.2921689, 19.2220123],
  // 					[-70.2920563, 19.2218148],
  // 					[-70.2919704, 19.2216932],
  // 					[-70.2915949, 19.2210347]
  // 				],
  // 				"type": "LineString"
  // 			},
  // 			"properties": {
  // 				"creationDate": "2019-09-18T16:40:22.204270",
  // 				"lead": "c00216c6-ecea-4ccb-8f19-41c57085855a",
  // 				"length": 519.1744212076837,
  // 				"probabilities": [1, 0.9275034070014954, 0.938513457775116, 0.8561949133872986, 0.6197546720504761, 0.5494687557220459, 0.781176745891571, 0.8554375767707825, 0.9431424140930176, 0.8923029899597168, 0.866641640663147, 0.8573423027992249, 0.8328508138656616, 0.7195532321929932],
  // 				"probabilitiesOriginal": [1, 0.9275034070014954, 0.9458974003791809, 0.9356876015663147, 0.9661639332771301, 0.9752559065818787, 0.9800636768341064, 0.9557457566261292, 0.9610924124717712, 0.9770607948303223, 0.943368136882782, 0.919732391834259, 0.8837442994117737, 0.8794558644294739, 0.9132446646690369, 0.910476803779602, 0.8864389657974243, 0.854065477848053, 0.8290445804595947, 0.7217673659324646, 0.6470170617103577, 0.5804908871650696, 0.6152722239494324, 0.693284273147583, 0.6301438212394714, 0.5301492810249329, 0.5634216070175171, 0.6187330484390259, 0.5453509092330933, 0.4241296947002411, 0.6369333267211914, 0.7646836042404175, 0.7654707431793213, 0.7832157611846924, 0.8122792840003967, 0.7872186899185181, 0.8430516719818115, 0.8601759672164917, 0.9380293488502502, 0.9493294358253479, 0.9369957447052002, 0.9244547486305237, 0.9060816168785095, 0.8481721878051758, 0.8868914842605591, 0.9117899537086487, 0.8754730820655823, 0.8690184354782104, 0.8264081478118896, 0.8333082795143127, 0.8875099420547485, 0.8620138764381409, 0.8237116932868958, 0.8148106336593628, 0.8512904644012451, 0.8388360738754272, 0.8281813859939575, 0.7993963360786438, 0.7936995625495911, 0.7309180498123169, 0.693444550037384, 0.5529714822769165, 0.6068031191825867, 0.7268145084381104, 0.6828948259353638],
  // 				"softwareVersionTag": "190917.1403"
  // 			},
  // 			"type": "Feature"
  // 		}
  // 	}
  // }
  // {
  //   'feature': {
  //     "geometry": {
  //       "coordinates": [
  //         [-70.2943844, 19.2248843],
  //         [-70.2943361, 19.2248286],
  //         [-70.2937353, 19.2239776],
  //         [-70.2936227, 19.2237801],
  //         [-70.2932793, 19.2232938],
  //         [-70.2930862, 19.2230709],
  //         [-70.2928716, 19.2228683],
  //         [-70.2926785, 19.2226455],
  //         [-70.2925712, 19.2225442],
  //         [-70.2924264, 19.222377],
  //         [-70.2921689, 19.2220123],
  //         [-70.2920563, 19.2218148],
  //         [-70.2919704, 19.2216932],
  //         [-70.2915949, 19.2210347]
  //       ],
  //       "type": "LineString"
  //     },
  //     "properties": {
  //       "creationDate": "2019-09-18T16:40:22.204270",
  //       "lead": "c00216c6-ecea-4ccb-8f19-41c57085855a",
  //       "length": 519.1744212076837,
  //       "probabilities": [1, 0.9275034070014954, 0.938513457775116, 0.8561949133872986, 0.6197546720504761, 0.5494687557220459, 0.781176745891571, 0.8554375767707825, 0.9431424140930176, 0.8923029899597168, 0.866641640663147, 0.8573423027992249, 0.8328508138656616, 0.7195532321929932],
  //       "probabilitiesOriginal": [1, 0.9275034070014954, 0.9458974003791809, 0.9356876015663147, 0.9661639332771301, 0.9752559065818787, 0.9800636768341064, 0.9557457566261292, 0.9610924124717712, 0.9770607948303223, 0.943368136882782, 0.919732391834259, 0.8837442994117737, 0.8794558644294739, 0.9132446646690369, 0.910476803779602, 0.8864389657974243, 0.854065477848053, 0.8290445804595947, 0.7217673659324646, 0.6470170617103577, 0.5804908871650696, 0.6152722239494324, 0.693284273147583, 0.6301438212394714, 0.5301492810249329, 0.5634216070175171, 0.6187330484390259, 0.5453509092330933, 0.4241296947002411, 0.6369333267211914, 0.7646836042404175, 0.7654707431793213, 0.7832157611846924, 0.8122792840003967, 0.7872186899185181, 0.8430516719818115, 0.8601759672164917, 0.9380293488502502, 0.9493294358253479, 0.9369957447052002, 0.9244547486305237, 0.9060816168785095, 0.8481721878051758, 0.8868914842605591, 0.9117899537086487, 0.8754730820655823, 0.8690184354782104, 0.8264081478118896, 0.8333082795143127, 0.8875099420547485, 0.8620138764381409, 0.8237116932868958, 0.8148106336593628, 0.8512904644012451, 0.8388360738754272, 0.8281813859939575, 0.7993963360786438, 0.7936995625495911, 0.7309180498123169, 0.693444550037384, 0.5529714822769165, 0.6068031191825867, 0.7268145084381104, 0.6828948259353638],
  //       "softwareVersionTag": "190917.1403"
  //     },
  //     "type": "Feature"
  //   },
  //   id: 'a5ca3f7c-904f-48e9-856d-1863c8f3654d'
  // }
  // {
  //   "feature": {
  //     "type": "FeatureCollection",
  //     "features": [
  //       {
  //         "geometry": {
  //           "coordinates": [
  //             [
  //               -3.27225,
  //               48.690265
  //             ],
  //             [
  //               -3.27184,
  //               48.68965
  //             ]
  //           ],
  //           "type": "LineString"
  //         },
  //         "id": "00004632-3200-0400-0000-0000005f860e",
  //         "properties": {
  //           "graph_id": 6,
  //           "type": "proposed_mds"
  //         },
  //         "type": "Feature"
  //       },
  //       {
  //         "geometry": {
  //           "coordinates": [
  //             [
  //               -3.27225,
  //               48.690265
  //             ],
  //             [
  //               -3.272355,
  //               48.690283
  //             ]
  //           ],
  //           "type": "LineString"
  //         },
  //         "id": "00004632-3200-0400-0000-0000005f85fe",
  //         "properties": {
  //           "graph_id": 6,
  //           "type": "proposed_mds"
  //         },
  //         "type": "Feature"
  //       }
  //     ]
  //   }
  // }
  {
    "feature": {
      "type": "FeatureCollection",
      "features": [{
        "type": "Feature",
        "id": "00004632-3200-0400-0000-00000060f0da",
        "geometry": {
          "type": "LineString",
          "coordinates": [
            [-3.267764, 48.684605],
            [-3.265329, 48.683851]
          ]
        },
        "properties": {
          "graph_id": 12,
          "type": "proposed_mds"
        }
      }, {
        "type": "Feature",
        "id": "00004632-3200-0400-0000-00000060f0db",
        "geometry": {
          "type": "LineString",
          "coordinates": [
            [-3.265329, 48.683851],
            [-3.265285, 48.684035],
            [-3.265092, 48.684377],
            [-3.264302, 48.685239]
          ]
        },
        "properties": {
          "graph_id": 12,
          "type": "proposed_mds"
        }
      }, {
        "type": "Feature",
        "id": "00004632-3200-0400-0000-00000060f11b",
        "geometry": {
          "type": "LineString",
          "coordinates": [
            [-3.265329, 48.683851],
            [-3.264471, 48.683738]
          ]
        },
        "properties": {
          "graph_id": 12,
          "type": "proposed_mds"
        }
      }, {
        "type": "Feature",
        "id": "00004632-3200-0400-0000-00000060f0b9",
        "geometry": {
          "type": "LineString",
          "coordinates": [
            [-3.264302, 48.685239],
            [-3.263853, 48.685019],
            [-3.263599, 48.684827],
            [-3.262987, 48.68482],
            [-3.262161, 48.685286]
          ]
        },
        "properties": {
          "graph_id": 12,
          "type": "proposed_mds"
        }
      }, {
        "type": "Feature",
        "id": "00004632-3200-0400-0000-00000060f103",
        "geometry": {
          "type": "LineString",
          "coordinates": [
            [-3.262161, 48.685286],
            [-3.261748, 48.684993],
            [-3.261225, 48.68435]
          ]
        },
        "properties": {
          "graph_id": 12,
          "type": "proposed_mds"
        }
      }]
    }
  }
]
let counter = 1

const generateAuthorizationHeaders = (user) => {
  if (user.authorization) return {
    'Authorization': JSON.stringify(user.authorization)
  }
  return {}
}

export function getTask(workflowEndpoint, path, user) {
  return new Promise((resolve, reject) => {
    const urlParams = new URLSearchParams()
    if (path) {
      const match = path.match(GROUP_REGEX)
      if (match) {
        urlParams.set('group', match[1])
      }
    }

    axios.get(`${workflowEndpoint}`, {
        params: urlParams,
        headers: generateAuthorizationHeaders(user)
      })
      .then(res => resolve({
        ...res.data.variables,
        id: res.data.id,
        timestamp: res.data.timestamp
      }))
      .catch(error => {
        console.error('Error retrieving tasks:', error)
        if (error.response && error.response.status === 404) {
          reject(new NoTaskError())
        }
        reject(new UnableToFetchTaskError())
      })
  })
}

export function postCompleteTask(workflowEndpoint, action, user) {
  const body = Object.assign({}, action.body)
  delete body.id

  return axios.post(`${workflowEndpoint}/${action.body.id}/done`, body, {
    headers: generateAuthorizationHeaders(user)
  })
}

export default function taskService(type) {
  if (ALLOWED_TYPES.indexOf(type) === -1) {
    throw new Error(`Type ${type} is not in supported type ${ALLOWED_TYPES}`)
  }

  return (action, path, user) => {
    switch (action.type) {
      case `GET_${type}_TASK`:
        // eslint-disable-next-line no-undef
        //const workflowFetchEndpoint = `${process.env.REACT_APP_WORKFLOW_ENDPOINT}/${type}/tasks`
        //return getTask(workflowFetchEndpoint, path, user)
        return Promise.resolve(TASKS[counter++ % TASKS.length])
      case `POST_COMPLETE_${type}_TASK`:
        // eslint-disable-next-line no-undef
        //const workflowCompleteEndpoint = `${process.env.REACT_APP_WORKFLOW_ENDPOINT}/tasks`
        //return postCompleteTask(workflowCompleteEndpoint, action, user)
        return Promise.resolve({})
        //case POST_TASK_TO_DROID:
        // return postToDroid(action)
        //return Promise.resolve({})
      default:
        console.warn('Unhandled action')
    }
  }
}