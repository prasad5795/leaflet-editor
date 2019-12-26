import React from "react"
import Adapter from 'enzyme-adapter-react-16'
import { configure, shallow } from 'enzyme'
import { Completeness } from "../../../views/Completeness"
import { notify } from 'react-notify-toast'
import application from '../../../utils/application'

jest.mock('react-notify-toast')

configure({ adapter: new Adapter() })

describe("Completeness component", () => {
  let component = null
  const FEATURE = {
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates: [
        [0, 0], [0, 1]
      ]
    }
  }

  const TASK = {
    id: 'aTaskId',
    feature: {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [0, 0], [0, 1], [1, 1], [1, 0], [0, 0]
        ]]
      }
    }
  }

  const NEW_TASK = {
    id: 'aTaskIdNew',
    feature: {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [0, 0], [0, 1], [1, 1], [1, 0], [0, 0]
        ]]
      }
    }
  }

  let props = null

  beforeEach(() => {
    props =  {
      existingGeometry: {
        features: [],
        properties: {
          branch: {
            branchId: 'a-branch'
          },
          version: {
            journalVersion: 2000
          }
        }
      },
      getCompletenessTask: jest.fn(),
      postCompletedCompletenessTask: jest.fn(),
      task: {},
      map: {
        addLayer: jest.fn(),
        removeLayer: jest.fn(),
        getMaxZoom: jest.fn(),
        fitBounds: jest.fn()
      }
    }
    component = shallow(<Completeness {...props}
      
    />)
  })

  it("should mount", () => {
    expect(component).toBeDefined()
  })

  it('should fetch a task on mount', () => {
    expect(props.getCompletenessTask.mock.calls.length).toBe(1)
  })

  it('should display geometry if existing geometry is present', () => {
    component.setProps({
      existingGeometry: {
        features: [ FEATURE ]
      }
    })

    expect(props.map.addLayer.mock.calls.length).toBe(1)
  })

  it('should update the shown geometry when receiving new data', () => {
    component.setProps({
      existingGeometry: {
        features: [ FEATURE ]
      }
    })

    expect(props.map.addLayer.mock.calls.length).toBe(1)

    component.setProps({
      existingGeometry: {
        features: [ FEATURE ]
      }
    })
    expect(props.map.addLayer.mock.calls.length).toBe(2)
    expect(props.map.removeLayer.mock.calls.length).toBe(1)
  })

  it('should not show geometry if absent', () => {
    component.setProps({
      existingGeometry: {
        features: []
      }
    })

    expect(props.map.addLayer.mock.calls.length).toBe(0)
  })

  it('should show task on map', () => {
    component.setProps({
      task: TASK
    })

    expect(props.map.addLayer.mock.calls.length).toBe(1)
  })

  it('should show task on map', () => {
    component.setProps({
      task: TASK
    })

    expect(props.map.addLayer.mock.calls.length).toBe(1)

    component.setProps({
      task: NEW_TASK
    })

    expect(props.map.removeLayer.mock.calls.length).toBe(1)
    expect(props.map.addLayer.mock.calls.length).toBe(2)
  })

  it('should remove feature and send completion event on accept', () => {
    component.setProps({
      task: TASK
    })

    const instance = component.instance()
    instance.onAcceptTask()

    expect(props.map.removeLayer.mock.calls.length).toBe(1)
    expect(props.postCompletedCompletenessTask.mock.calls[0]).toEqual([
      {
        id: TASK.id,
        feedbackValue: 'ACCEPTED',
        version: props.existingGeometry.properties.version.journalVersion,
        branch: props.existingGeometry.properties.branch.branchId
      }
    ])
  })

  it('should remove feature and send completion event on reject', () => {
    component.setProps({
      task: TASK
    })

    const instance = component.instance()
    instance.onRejectTask()

    expect(props.map.removeLayer.mock.calls.length).toBe(1)
    expect(props.postCompletedCompletenessTask.mock.calls[0]).toEqual([
      {
        id: TASK.id,
        feedbackValue: 'REJECTED',
        version: props.existingGeometry.properties.version.journalVersion,
        branch: props.existingGeometry.properties.branch.branchId
      }
    ])
  })
})