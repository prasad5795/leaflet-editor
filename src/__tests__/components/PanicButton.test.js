import React from 'react'
import Adapter from 'enzyme-adapter-react-16'
import { configure, shallow, mount } from 'enzyme'
import {PanicButton} from '../../components/PanicButton'

configure({ adapter: new Adapter() })

describe('PanicButton component', () => {
    let component = null
    let props = null

    props = {
        toggleReport : jest.fn()
    }
    beforeEach(() => {
        component = shallow(<PanicButton
            {...props}
        />)
    })

    it('should mount', () => {
        expect(component).toBeDefined()
    })

    it('should call toggleLocation when button is clicked', () => {
        const toggleButton = component.find('#panicDiv')
        toggleButton.simulate('click')
        expect(props.toggleReport).toHaveBeenCalled()
    });
});

