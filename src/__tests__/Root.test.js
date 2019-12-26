import React from 'react'
import Root from '../containers/Root'
import ShallowRenderer from 'react-test-renderer/shallow'

it('renders without crashing', () => {
  const renderer = new ShallowRenderer()
  renderer.render(<Root />)
})
