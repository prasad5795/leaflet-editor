import React from 'react'
import Adapter from 'enzyme-adapter-react-16'
import { configure, mount } from 'enzyme'
import { ReportView } from '../../components/ReportView'

configure({ adapter: new Adapter() })

describe('PanicButton component', () => {
    let component = null
    let props = null

    props = {
        onSubmit: jest.fn(),
        toggleReport: jest.fn(),
        toggleReportStatus: true,
        displayOtherOption: true
    }
    beforeEach(() => {
        component = mount(<ReportView
            {...props}
        />)
    })

    it('should mount', () => {
        expect(component).toBeDefined()
    })

    it('should call toggleReport and onSubmit when onReportSubmit is called', () => {
        const submitButton = component.find('.MuiButton-label')
        submitButton.simulate('click')
        expect(props.toggleReport).toHaveBeenCalled()
        expect(props.onSubmit).toHaveBeenCalled()
    });

    it('should have 2 radio buttons if displayOtherOption is true', () => {
        expect(component.find('input[id=\'other\']')).toHaveLength(1)
    });
});

describe('PanicButton component without other option', () => {
    let component = null
    let props = null

    props = {
        onSubmit: jest.fn(),
        toggleReport: jest.fn(),
        toggleReportStatus: true,
        displayOtherOption: false
    }
    beforeEach(() => {
        component = mount(<ReportView
            {...props}
        />)
    })

    it('should have 1 radio button if displayOtherOption is not available', () => {
        expect(component.find('input[id=\'other\']')).toHaveLength(0)
    });
});

