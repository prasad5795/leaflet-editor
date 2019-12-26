import React from "react"
import Adapter from 'enzyme-adapter-react-16'
import { configure, shallow } from 'enzyme'
import { Realignment } from "../../../views/Realignment"
import application from '../../../utils/application'
jest.mock('react-notify-toast')


configure({ adapter: new Adapter() })

describe("Realignment component", () => {
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
    let popupElement = null

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
            getRealignmentTask: jest.fn(),
            postCompletedRealignmentTask: jest.fn(),
            keyboardLock: false,
            task: {},
            map: {
                openPopup: jest.fn(),
            }
        }
        component = shallow(<Realignment {...props} />)

        component.setProps({
            task: TASK
        })
    })

    it("should mount", () => {
        expect(component).toBeDefined()
    })

    it('should fetch a task on mount', () => {
        expect(props.getRealignmentTask.mock.calls.length).toBe(1)
    })

    it('should send the expected event for accepted feature on yes-click', () => {
        let validButton = document.getElementById('validButton')
        validButton.click()
        expect(props.postCompletedRealignmentTask.mock.calls.length).toBe(1)
        expect(props.addAcceptedFeature.mock.calls.length).toBe(1)
        expect(props.postCompletedRealignmentTask.mock.calls[0]).toEqual([{
            feedbackValue: 'ACCEPTED',
            branch: 'a-branch',
            version: 2000,
            id: TASK.id
        }])
    })

    it('should send the expected event for accepted feature on y keyboard input', () => {
        var event = new KeyboardEvent('keydown', {'key': "y"});
        document.dispatchEvent(event);

        expect(props.postCompletedRealignmentTask.mock.calls.length).toBe(1)
        expect(props.addAcceptedFeature.mock.calls.length).toBe(1)
        expect(props.postCompletedRealignmentTask.mock.calls[0]).toEqual([{
            feedbackValue: 'ACCEPTED',
            branch: 'a-branch',
            version: 2000,
            id: TASK.id
        }])
    })

    it('should send the expected action for rejected feature on no-click', () => {
        let notValidButton = document.getElementById('notValidButton')
        notValidButton.click()
        expect(props.postCompletedRealignmentTask.mock.calls.length).toBe(1)
        expect(props.addRejectedFeature.mock.calls.length).toBe(1)
        expect(props.postCompletedRealignmentTask.mock.calls[0]).toEqual([{
            feedbackValue: 'REJECTED',
            branch: 'a-branch',
            version: 2000,
            id: TASK.id
        }])
    })

    it('should send the expected event for rejected feature on n keyboard input', () => {
        var event = new KeyboardEvent('keydown', {'key': "n"});
        document.dispatchEvent(event);

        expect(props.postCompletedRealignmentTask.mock.calls.length).toBe(1)
        expect(props.addRejectedFeature.mock.calls.length).toBe(1)
        expect(props.postCompletedRealignmentTask.mock.calls[0]).toEqual([{
            feedbackValue: 'REJECTED',
            branch: 'a-branch',
            version: 2000,
            id: TASK.id
        }])
    })

    it('should not send an event on i keyboard input', () => {
        var event = new KeyboardEvent('keydown', {'key': "i"});
        document.dispatchEvent(event);

        expect(props.postCompletedRealignmentTask.mock.calls.length).toBe(0)
    })


    it('should not send an event on keyboard input when keyboardLock is true', () => {
        component.setProps( {
            keyboardLock: true
        })
        
        var yEvent = new KeyboardEvent('keydown', {'key': "y"});
        document.dispatchEvent(yEvent);
        var nEvent = new KeyboardEvent('keydown', {'key': "n"});
        document.dispatchEvent(nEvent);

        expect(props.postCompletedRealignmentTask.mock.calls.length).toBe(0)
    })
})