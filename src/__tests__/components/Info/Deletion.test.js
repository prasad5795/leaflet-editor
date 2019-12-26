import React from "react"
import Adapter from 'enzyme-adapter-react-16'
import { configure, shallow } from 'enzyme'
import Info from "../../../components/Info/Deletion"

configure({ adapter: new Adapter() })

describe("SourceValidation Info component", () => {
  let component = null

  beforeEach(() => {
    component = shallow(<Info 
    />)
  })

  it("should mount", () => {
    expect(component).toBeDefined()
  })
})