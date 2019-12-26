import React from "react"
import Adapter from 'enzyme-adapter-react-16'
import { configure, shallow } from 'enzyme'
import Info from "../../../components/Info/Completeness"

configure({ adapter: new Adapter() })

describe("Completeness Info component", () => {
  let component = null

  beforeEach(() => {
    component = shallow(<Info 
    />)
  })

  it("should mount", () => {
    expect(component).toBeDefined()
  })
})