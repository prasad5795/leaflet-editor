import React from 'react'
import Adapter from 'enzyme-adapter-react-16'
import { configure, shallow, mount } from 'enzyme'
import Report from '../../../components/Report'

configure({ adapter: new Adapter() })

describe('Report component', () => {
    let component = null
    let props = {
        onSubmit: jest.fn(),
        displayOtherOption: true
    }

    beforeEach(() => {
        component = mount(<Report {...props}/>)
    })

    it('should mount', () => {
        expect(component).toBeDefined()
    })

    it('should call onSubmit when submit Button is clicked', () => {
        const submitButton = component.find('#submitButton').first()
        submitButton.simulate('click')
        expect(props.onSubmit).toHaveBeenCalled()
    });

    it('should initially display all items with the first one checked', () => {
        expect(component.find('input[type=\'radio\']').map(el => el.getDOMNode().checked)).toEqual([true, false])
    })

    it('should have 1 text input field if displayOtherOption is available', () => {
        expect(component.find('[id=\'commentInput\']').length).toBeGreaterThanOrEqual(1)
    });



})

describe('Report component with no other option', () => {
    let component = null
    let props = {
        onSubmit: jest.fn()
    }

    beforeEach(() => {
        component = mount(<Report {...props}/>)
    })

    it('should mount', () => {
        expect(component).toBeDefined()
    })

    it('should display only one item checked', () => {
        expect(component.find('input[type=\'radio\']').map(el => el.getDOMNode().checked)).toEqual([true])
    })

    it('should have 1 text input field if displayOtherOption is available', () => {
        expect(component.find('[id=\'commentInput\']')).toHaveLength(0)
    });

})