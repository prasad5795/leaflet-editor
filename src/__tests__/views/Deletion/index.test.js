import React from "react"
import Adapter from 'enzyme-adapter-react-16'
import { configure, mount,shallow } from 'enzyme'
import {Deletion} from "../../../views/Deletion"
import application from '../../../utils/application'
import PropTypes from 'prop-types';
import { Provider } from 'react-redux'


jest.mock('react-notify-toast')


configure({ adapter: new Adapter() })

describe("Deletion component", () => {
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
    let popupElement = null
    let store = null

    afterEach(() => {
        document.body.removeChild(mapElement)
    })

    beforeEach(() => {
        mapElement = document.createElement('div')
        mapElement.setAttribute('id', application.elements.map)
        document.body.appendChild(mapElement)
        popupElement = document.createElement('div')
        popupElement.setAttribute('id', application.elements.leaflet.popup)
        document.body.appendChild(popupElement)
        mapHandlers = {}

        props = {
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
            addAcceptedFeature: jest.fn(),
            addRejectedFeature: jest.fn(),
            getDeletionTask: jest.fn(),
            postCompletedDeletionTask: jest.fn(),
            user: {
                roles : ['ROLE_USER', 'ROLE_QTEAM']
            },
            task: {},
            map: {
                on: jest.fn((event, handler) => mapHandlers[event] = handler),
                openPopup: jest.fn(),
                removeLayer: jest.fn(),
                getMaxZoom: jest.fn(),
                fitBounds: jest.fn(),
                addControl: jest.fn()
            }
        }
        component = shallow(<Deletion {...props} />)


        component.setProps({
            task: TASK
        })
    })

    it("should mount", () => {
        expect(component).toBeDefined()
    })

    it('should fetch a task on mount', () => {
        expect(props.getDeletionTask.mock.calls.length).toBe(1)
    })

    it('should send the expected event for accepted feature', () => {
        let validButton = document.getElementById('toDeleteButton')
        validButton.click()
        expect(props.postCompletedDeletionTask.mock.calls.length).toBe(1)
        expect(props.addAcceptedFeature.mock.calls.length).toBe(1)
        expect(props.postCompletedDeletionTask.mock.calls[0]).toEqual([{
            feedbackValue: 'ACCEPTED',
            branch: 'a-branch',
            version : 2000,
            id: TASK.id
        }])
    })

    it('should send the expected action for rejected feature', () => {
        let notValidButton = document.getElementById('toKeepButton')
        notValidButton.click()
        expect(props.postCompletedDeletionTask.mock.calls.length).toBe(1)
        expect(props.addRejectedFeature.mock.calls.length).toBe(1)
        expect(props.postCompletedDeletionTask.mock.calls[0]).toEqual([{
            feedbackValue: 'REJECTED',
            branch: 'a-branch',
            version: 2000,
            id: TASK.id
        }])
    })


})