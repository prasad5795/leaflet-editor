import React from 'react'
import Adapter from 'enzyme-adapter-react-16'
import { configure, shallow, mount } from 'enzyme'
import { Location } from '../../components/TaskLocation'
import L from "leaflet";

configure({ adapter: new Adapter() })

describe('Location component', () => {
    let component = null
    let props = null

    const feature = {
        type: 'Feature',
        geometry: {
            type: 'LineString',
            coordinates: [
                [1, 1], [3, 3]
            ]
        }
    }
    const featureWithPolygon = {
        type: 'Feature',
        geometry: {
            type: 'Polygon',
            coordinates: [
                [[1, 1], [3, 3]]
            ]
        }
    }
    const brokenFeature = {
        type: 'XYZ',
        geometry: {
            some : "info"
        }
    }
    props = {
    toggleLocation: jest.fn(),
    toggleLocationStatus: false,
    location: feature.geometry.coordinates[0],
    task: {
        feature: feature
    }
    }
    beforeEach( () => {
      component = shallow(<Location
          {...props}
      />)
    })

    it('should mount', () => {
      expect(component).toBeDefined()
    })

    it('should call toggleLocation when button is clicked', () => {
        const toggleButton = component.find('#locationButton')
        toggleButton.simulate('click')

        expect(props.toggleLocation).toHaveBeenCalled()
    });

    it('should show coordinates when toggleLocationStatus is true', () => {
        props.toggleLocationStatus = true
        component = shallow(<Location {... props} />)
        const text = component.find('span').text()
        expect(text).toEqual('2.00000, 2.00000')
    })

    it('should show coordinates with polygons', () => {
        props.task.feature = featureWithPolygon
        component = shallow(<Location {...props} />)
        const text = component.find('span').text()
        expect(text).toEqual('2.00000, 2.00000')
    })
    it('should return Unknown if error', () => {
        props.task.feature = brokenFeature
        component = shallow(<Location {...props} />)
        const text = component.find('span').text()
        expect(text).toEqual('Unknown')
    })
});

