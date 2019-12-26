import React from 'react'
import { connect } from 'react-redux'
import { toggleReport } from '../actions'




export const PanicButton = (props) => {

  return (
    <div id='panicDiv' aria-label="location" onMouseDown={(event) => event.preventDefault()} onClick={() => props.toggleReport()}>
      <button className={'fa fa-share icon'} id='panicButton' />
      <br />
      <span className='buttonText'>Report</span>
      <br />
    </div>
  )
}

export default connect(null, { toggleReport })(PanicButton)
