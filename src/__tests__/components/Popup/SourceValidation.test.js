import React from "react"
import Adapter from 'enzyme-adapter-react-16'
import { configure, mount } from 'enzyme'
import { getPopupContent } from "../../../components/Popup/SourceValidation";

configure({ adapter: new Adapter() })

describe("Sourcevalidation Popup component", () => {
  let popupComponent = null;
  let mockOnPopupClick = jest.fn()

  beforeEach(() => {
    const popup = getPopupContent({ onClick: mockOnPopupClick });
    popupComponent = mount(popup.content);
  });

  afterEach(() => {
    popupComponent = null;
  });

  it("should trigger 'y' when using validButton", () => {
    const validButton = popupComponent.find("#validButton")
    validButton.simulate("click")

    expect(mockOnPopupClick.mock.calls[mockOnPopupClick.mock.calls.length - 1][0]).toEqual('y')
  })

  it("should trigger 'n' when using notValidButton", () => {
    const notValidButton = popupComponent.find("#notValidButton")
    notValidButton.simulate("click")
    
    expect(mockOnPopupClick.mock.calls[mockOnPopupClick.mock.calls.length - 1][0]).toEqual('n')
  })
});