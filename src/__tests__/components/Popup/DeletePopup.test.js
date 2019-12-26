import React from "react"
import Adapter from 'enzyme-adapter-react-16'
import { configure, mount } from 'enzyme'
import { getPopupContent } from "../../../components/Popup/Deletion";

configure({ adapter: new Adapter() })

describe("Deletion Popup component", () => {
  let popupComponent = null;
  let mockOnPopupClick = jest.fn()

  beforeEach(() => {
    const popup = getPopupContent({ onClick: mockOnPopupClick });
    popupComponent = mount(popup.content);
  });

  afterEach(() => {
    popupComponent = null;
  });

  it("should trigger 'y' when using toKeepButton", () => {
    const validButton = popupComponent.find("#toKeepButton")
    validButton.simulate("click")

    expect(mockOnPopupClick.mock.calls[mockOnPopupClick.mock.calls.length - 1][0]).toEqual('y')
  })

  it("should trigger 'n' when using toDeleteButton", () => {
    const notValidButton = popupComponent.find("#toDeleteButton")
    notValidButton.simulate("click")
    
    expect(mockOnPopupClick.mock.calls[mockOnPopupClick.mock.calls.length - 1][0]).toEqual('n')
  })
});