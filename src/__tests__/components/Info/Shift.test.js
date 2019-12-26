import React from "react"
import Adapter from 'enzyme-adapter-react-16'
import { configure, shallow } from 'enzyme'
import Info from "../../../components/Info/Shift"

configure({ adapter: new Adapter() })

describe("Shift Info component", () => {
  let component = null

  beforeEach(() => {
    component = shallow(<Info 
    />)
  })

  it("should mount", () => {
    expect(component).toBeDefined()
  })
})