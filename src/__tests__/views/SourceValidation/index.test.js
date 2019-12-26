import React from "react"
import Adapter from 'enzyme-adapter-react-16'
import { configure, shallow, mount } from 'enzyme'
import { SourceValidation } from "../../../views/SourceValidation"
import application from '../../../utils/application'
import { createStore } from 'redux'
import { Provider } from 'react-redux'


jest.mock('react-notify-toast')

configure({ adapter: new Adapter() })

describe("SourceValidation component", () => {
    let component = null
    let store = null
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
        
        const mockUseEffect = () => {
            useEffect.mockImplementationOnce(f => f());
        };


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
            getSourceValidationTask: jest.fn(),
            postCompletedSourceValidationTask: jest.fn(),           
            task: {},
            map: {
                openPopup: jest.fn(),
                addLayer: jest.fn(),
                getMaxZoom: jest.fn(),
                fitBounds: jest.fn()
            },
            accepted: 0,
            rejected: 0,
            processed: 0
        }
        const initialState = {
            ui: {
                keyboardLock: false,
                toggleReport: false,
                toggleInfo: false,
            }
           
        }
        const reducer = (previousState = initialState, action) => {
            switch (action.type) {
                case 'keyboardLock':
                    return {
                        ui: {
                            keyboardLock: true,
                            toggleReport: false,
                            toggleInfo: false,
                        }
                    }
                default:
                    return {...previousState}
            }
        } 
        store = createStore(reducer)
        const Proxy = ({props}) => (
            <Provider store={store}> <SourceValidation {...props} /></Provider>
        )
        component = mount(<Proxy props={props} />)
        
        component.setProps({
            props: {
                ...props,
                task : TASK
            } 
        })
    })

     it("should mount", () => {
        expect(component).toBeDefined()
    })

   it('should fetch a task on mount', () => {
        expect(props.getSourceValidationTask.mock.calls.length).toBe(1)
    })

    //Enzyme support for effects is ongoing
   it('should send the expected event for accepted feature on yes-click', () => {
  
        let validButton = document.getElementById('validButton')
        
        validButton.click()
        expect(props.postCompletedSourceValidationTask.mock.calls.length).toBe(1)
        expect(props.addAcceptedFeature.mock.calls.length).toBe(1)
        expect(props.postCompletedSourceValidationTask.mock.calls[0]).toEqual([{
            feedbackValue: 'ACCEPTED',
            branch: 'a-branch',
            version: 2000,
            id: TASK.id
        }])
    })

     it('should send the expected event for accepted feature on y keyboard input', () => {
        var event = new KeyboardEvent('keydown', { 'key': "y" });
        document.dispatchEvent(event);

        expect(props.postCompletedSourceValidationTask.mock.calls.length).toBe(1)
        expect(props.addAcceptedFeature.mock.calls.length).toBe(1)
        expect(props.postCompletedSourceValidationTask.mock.calls[0]).toEqual([{
            feedbackValue: 'ACCEPTED',
            branch: 'a-branch',
            version: 2000,
            id: TASK.id
        }])
    })

    it('should send the expected action for rejected feature on no-click', () => {
        let notValidButton = document.getElementById('notValidButton')
        notValidButton.click()
        expect(props.postCompletedSourceValidationTask.mock.calls.length).toBe(1)
        expect(props.addRejectedFeature.mock.calls.length).toBe(1)
        expect(props.postCompletedSourceValidationTask.mock.calls[0]).toEqual([{
            feedbackValue: 'REJECTED',
            branch: 'a-branch',
            version: 2000,
            id: TASK.id
        }])
    })

    it('should send the expected event for rejected feature on n keyboard input', () => {
        var event = new KeyboardEvent('keydown', { 'key': "n" });
        document.dispatchEvent(event);

        expect(props.postCompletedSourceValidationTask.mock.calls.length).toBe(1)
        expect(props.addRejectedFeature.mock.calls.length).toBe(1)
        expect(props.postCompletedSourceValidationTask.mock.calls[0]).toEqual([{
            feedbackValue: 'REJECTED',
            branch: 'a-branch',
            version: 2000,
            id: TASK.id
        }])
    })

    it('should not send an event on i keyboard input', () => {
        var event = new KeyboardEvent('keydown', { 'key': "i" });
        document.dispatchEvent(event);
        expect(props.postCompletedSourceValidationTask.mock.calls.length).toBe(0)
    })
})

describe("Keyboard Lock", () => {
    let component = null
    let store = null
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

        const mockUseEffect = () => {
            useEffect.mockImplementationOnce(f => f());
        };


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
            getSourceValidationTask: jest.fn(),
            postCompletedSourceValidationTask: jest.fn(),
            task: {},
            map: {
                openPopup: jest.fn(),
                addLayer: jest.fn(),
                getMaxZoom: jest.fn(),
                fitBounds: jest.fn()
            },
            accepted: 0,
            rejected: 0,
            processed: 0
        }
        const initialState = {
            ui: {
                keyboardLock: true,
                toggleReport: false,
                toggleInfo: false,
            }

        }
        const reducer = (previousState = initialState, action) => {
            switch (action.type) {
                case 'keyboardLock':
                    return {
                        ui: {
                            keyboardLock: true,
                            toggleReport: false,
                            toggleInfo: false,
                        }
                    }
                default:
                    return { ...previousState }
            }
        }
        store = createStore(reducer)
        const Proxy = ({ props }) => (
            <Provider store={store}> <SourceValidation {...props} /></Provider>
        )
        component = mount(<Proxy props={props} />)

        component.setProps({
            props: {
                ...props,
                task: TASK
            }
        })
    })

    it('should not send an event on keyboard input when keyboardLock is true', () => {

        var yEvent = new KeyboardEvent('keydown', { 'key': "y" });
        document.dispatchEvent(yEvent);
        var nEvent = new KeyboardEvent('keydown', { 'key': "n" });
        document.dispatchEvent(nEvent);

        expect(props.postCompletedSourceValidationTask.mock.calls.length).toBe(0)
    })
  
})