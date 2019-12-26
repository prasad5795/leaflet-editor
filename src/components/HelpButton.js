import React from 'react'
import { connect } from 'react-redux'
import { toggleInfo } from '../actions'
const pjson = require('../../package.json')

const HelpButton = (props) => {
  return (
    <div aria-label='version'>
      <button className={'fa fa-question-circle icon'} onMouseDown={(event) => event.preventDefault()} onClick={() => props.toggleInfo()} />
      <br />
      <span><strong> v {pjson.version}</strong></span>
    </div>

  )
}

export default connect(null, { toggleInfo })(HelpButton)
