import React from "react"
import Adapter from 'enzyme-adapter-react-16'
import { configure, shallow } from 'enzyme'
import CompletenessDialog from "../../../components/Popup/CompletenessDialog"

configure({ adapter: new Adapter() })

describe("CompletenessDialog component", () => {
    let mockOnAccept = jest.fn()
    let mockOnReject = jest.fn()
    let mockOnToggleMove = jest.fn()
    let component = null
    const position = 'left'

    beforeEach(() => {
      component = shallow(<CompletenessDialog 
        onToggleMove={mockOnToggleMove}
        onAccept={mockOnAccept}
        onReject={mockOnReject}
        position={position}
      />)
    })

    it("should use onAccept handler when using validButton", () => {
      const validButton = component.find('.validButton')
      validButton.simulate('click')

      expect(mockOnAccept.mock.calls.length).toEqual(1)
    })
    
    it("should use onReject handler when using notValidButton", () => {
      const notValidButton = component.find('.notValidButton')
      notValidButton.simulate('click')

      expect(mockOnReject.mock.calls.length).toEqual(1)
    })

    it("should use onToggleMove handler when using move button", () => {
      const moveButton = component.find('.move')
      moveButton.simulate('click')

      expect(mockOnToggleMove.mock.calls.length).toEqual(1)
    })

    it(`should assign class move-${position} to move button`, () => {
      const moveButton = component.find(`.move.move-${position}`)

      expect(moveButton).toBeDefined()
    })
  });