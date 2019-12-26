import React from "react"
import Adapter from 'enzyme-adapter-react-16'
import { configure, shallow } from 'enzyme'
import { Editor } from "../../../views/Editor"
import application from '../../../utils/application'

jest.mock('react-notify-toast')


configure({ adapter: new Adapter() })

describe("Editor component", () => {
  let component = null
  const FEATURE = {
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates: [
        [0, 0], [0, 1]
      ]
    },
    properties: {}
  }

  const TASK = {
    id: 'aTaskId',
    feature: FEATURE
  }

  let props = null
  let mapElement = null
  let mapHandlers = {}

  afterEach(() => {
    document.body.removeChild(mapElement)
  })
  
  beforeEach(() => {
    mapElement = document.createElement('div')
    mapElement.setAttribute('id', application.elements.map)
    document.body.appendChild(mapElement)
    mapHandlers = {}

    props =  {
      existingGeometry: {
        features: [
          {
              type: 'LineString',
              coordinates: [[0, 0], [-1, 0]]
          },
          {
              type: 'LineString',
              coordinates: [[0, 0], [1, 0]]
          }
        ],
        properties: {
          branch: {
            branchId: 'a-branch'
          },
          version: {
            journalVersion: 2000
          }
        }
      },
      getEditTask: jest.fn(),
      postCompletedEditTask: jest.fn(),
      task: {},
      map: {
        pm: {
          addControls: jest.fn(),
          enableDraw: jest.fn(),
          disableDraw: jest.fn(),
        },
        on: jest.fn((event, handler) => mapHandlers[event] = handler),
        addLayer: jest.fn(),
        removeLayer: jest.fn(),
        getMaxZoom: jest.fn(),
        fitBounds: jest.fn(),
        addControl: jest.fn(),
        getCenter: jest.fn(),
        openPopup: jest.fn()
      }
    }
    component = shallow(<Editor {...props} />)

            
    component.setProps({
      task: TASK
    })
  })

  it("should mount", () => {
    expect(component).toBeDefined()
  })

  it('should fetch a task on mount', () => {
    expect(props.getEditTask.mock.calls.length).toBe(1)
  })

  it('should send the expected event for invalid feature', () => {
    const control = props.map.addControl.mock.calls[0][0]
    const container = control.onAdd()
    container.onclick()
    expect(props.postCompletedEditTask.mock.calls.length).toBe(1)
    expect(props.postCompletedEditTask.mock.calls[0]).toEqual([{
      feedbackValue: 'INVALID',
      id: TASK.id
    }])
  })

  it('should send the expected action for corrected feature', () => {
    mapHandlers['pm:create']({
      layer: {
        toGeoJSON: jest.fn(() => FEATURE),
        remove: jest.fn()
      }
    })
    
    expect(props.postCompletedEditTask.mock.calls.length).toBe(1)
    expect(props.postCompletedEditTask.mock.calls[0]).toEqual([{
      feedbackValue: 'CORRECTED',
      id: TASK.id,
      correctedFeature: FEATURE
    }])
  })

  describe('checkOverlap method', () => {
    const OVERLAP_FULL = {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: [
          [0,0], [-1, 0]
        ]
      }
    }

    const OVERLAP_OVERFLOW = {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: [[0,0], [2, 0]]
      }
    }

    const OVERLAP_PARTIAL = {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: [[0,0], [0.5, 0]]
      }
    }

    const OVERLAP_POINT = {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [[0,0], [0, 0]]
      }
    }

    it ('should not send completed task if feature overlaps', () => {
      mapHandlers['pm:create']({
          layer: {
            toGeoJSON: jest.fn(() => OVERLAP_FULL),
            remove: jest.fn()
          }
      })
        
      expect(props.postCompletedEditTask.mock.calls.length).toBe(0)
    })

    it ('should send completed task if feature does not overlap', () => {
      mapHandlers['pm:create']({
          layer: {
            toGeoJSON: jest.fn(() => FEATURE),
            remove: jest.fn()
          }
      })

      expect(props.postCompletedEditTask.mock.calls.length).toBe(1)
    })

    it ('should not send completed task if feature overlaps only part of the geometry', () => {
      mapHandlers['pm:create']({
        layer: {
          toGeoJSON: jest.fn(() => OVERLAP_OVERFLOW),
          remove: jest.fn()
        }
      })

      expect(props.postCompletedEditTask.mock.calls.length).toBe(0)
    })

    it ('should send completed task if only a point of the feature is on the geometry', () => {
      mapHandlers['pm:create']({
        layer: {
          toGeoJSON: jest.fn(() => OVERLAP_POINT),
          remove: jest.fn()
        }
      })

    expect(props.postCompletedEditTask.mock.calls.length).toBe(1)
    })
  })

  describe('checkTouching method', () => {
    const TOUCHING_END = {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: [
          [0,0], [0, -1]
        ]
      }
    }

    const TOUCHING_MIDDLE = {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: [[0.5,0], [0.5, 1]]
      }
    }

    const NOT_TOUCHING = {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: [[1,1], [2, 2]]
      }
    }

    it ('should not send completed task if feature is not touching', () => {
      mapHandlers['pm:create']({
          layer: {
            toGeoJSON: jest.fn(() => NOT_TOUCHING),
            remove: jest.fn()
          }
      })

      expect(props.postCompletedEditTask.mock.calls.length).toBe(0)
    })

    it ('should send completed task if feature does continue from an endpoint', () => {
      mapHandlers['pm:create']({
          layer: {
            toGeoJSON: jest.fn(() => TOUCHING_END),
            remove: jest.fn()
          }
      })

      expect(props.postCompletedEditTask.mock.calls.length).toBe(1)
    })

    it ('should send completed task if feature touches the middle', () => {
      mapHandlers['pm:create']({
          layer: {
            toGeoJSON: jest.fn(() => TOUCHING_MIDDLE),
            remove: jest.fn()
          }
      })

      expect(props.postCompletedEditTask.mock.calls.length).toBe(1)
    })
  })
})