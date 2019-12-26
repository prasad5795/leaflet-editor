import React from 'react'
import PropTypes from 'prop-types'

export default function CompletenessDialog(props) {
  return <div>
    <button aria-label='move dialog' className={`move move-${props.position}`} onClick={() => props.onToggleMove()}></button>
    <p id={props.key} aria-label='Is this tile complete?'>Is this tile complete?</p>
    <div className="button-row">
      <button aria-label='tile ok' className='validButton' onClick={() => props.onAccept()} >Yes</button>
      <button aria-label='tile not ok' className='notValidButton' onClick={() => props.onReject()}>No</button>
    </div>
  </div>
}

CompletenessDialog.propTypes = {
  onToggleMove: PropTypes.func.isRequired,
  onAccept: PropTypes.func.isRequired,
  onReject: PropTypes.func.isRequired,
  position: PropTypes.string.isRequired
}