import React from "react"
import Adapter from 'enzyme-adapter-react-16'
import L from 'leaflet'
import { configure, mount } from 'enzyme'
import CompletenessPopup from '../../../components/Popup/CompletenessPopup'
import application from '../../../utils/application'

configure({ adapter: new Adapter() })
describe("CompletenessPopup component", () => {
    let container = null
    let popupContainer = null
    const feature = {
        type: 'Feature',
        geometry: {
            type: 'Polygon',
            coordinates: [[
                [0, 0],
                [0, 1],
                [1, 1],
                [1, 0],
                [0, 0]
            ]]
        }
    }
    const newFeature = L.geoJSON({
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [0, 0],
          [0, 2],
          [2, 2],
          [2, 0],
          [0, 0]
        ]]
      }
    })
    let component = null
    let map = null
    let onAccept = null
    let onReject = null

    beforeEach(() => {
      container = document.createElement('div')
      container.setAttribute('id', 'map')

      popupContainer = document.createElement('div')
      popupContainer.setAttribute('id', application.elements.leaflet.popup)

      document.body.appendChild(container)
      document.body.appendChild(popupContainer)
      map = {
        openPopup: jest.fn(),
        removeLayer: jest.fn()
      }
      const geojson = L.geoJSON(feature)
      
      onAccept = jest.fn()
      onReject = jest.fn()
      component = mount(<CompletenessPopup 
        map={map}
        feature={geojson}
        onAccept={onAccept}
        onReject={onReject}
      />)
    })

    afterEach(() => {
      document.body.removeChild(container)
      document.body.removeChild(popupContainer)
    })

    it('should mount', () => {
      expect(component).toBeDefined()
    })

    it('should open the popup on the map', () => {
      expect(map.openPopup.mock.calls.length).toEqual(1)

      const popup = map.openPopup.mock.calls[0][0]
      expect(popup.getLatLng()).toEqual({ lat: 1, lng: 1 })
    })

    it('should move the popup if the feature changes', () => {
      const popup = map.openPopup.mock.calls[0][0]      
      component.setProps({
          feature: newFeature
      })
      expect(popup.getLatLng()).toEqual({ lat: 2, lng: 2 })
    })

    it('should move the popup when position changes', () => {
      const popup = map.openPopup.mock.calls[0][0]      
      component.find('.move').simulate('click')
      expect(popup.getLatLng()).toEqual({ lat: 1, lng: 0 })
    })

    it ('unmount should remove the popup', () => {
      component.unmount()

      expect(map.removeLayer.mock.calls.length).toBe(1)
    })
    
    it ('unmount should remove the key listeners', () => {
      component.unmount()

      let yKeyEvent = new KeyboardEvent('keydown', {'keyCode': 74, 'key': 'y'});
      document.dispatchEvent(yKeyEvent)

      let nKeyEvent = new KeyboardEvent('keydown', {'keyCode': 78, 'key': 'n'});
      document.dispatchEvent(nKeyEvent)

      expect(onAccept.mock.calls.length).toBe(0)
      expect(onReject.mock.calls.length).toBe(0)
    })
  });