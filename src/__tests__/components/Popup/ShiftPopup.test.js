import React from "react"
import Adapter from 'enzyme-adapter-react-16'
import { configure, mount } from 'enzyme'
import { getPopupContent } from "../../../components/Popup/Shift";

configure({ adapter: new Adapter() })

describe("Shift Popup component", () => {
  let popupComponent = null;
  let mockOnPopupClick = jest.fn()

  beforeEach(() => {
    const popup = getPopupContent({ onClick: mockOnPopupClick });
    popupComponent = mount(popup.content);
  });

  afterEach(() => {
    popupComponent = null;
  });

  it("should trigger 'y' when using shift", () => {
    const validButton = popupComponent.find("#shift")
    validButton.simulate("click")

    expect(mockOnPopupClick.mock.calls[mockOnPopupClick.mock.calls.length - 1][0]).toEqual('y')
  })

  it("should trigger 'n' when using noShift", () => {
    const notValidButton = popupComponent.find("#noShift")
    notValidButton.simulate("click")
    
    expect(mockOnPopupClick.mock.calls[mockOnPopupClick.mock.calls.length - 1][0]).toEqual('n')
  })
});