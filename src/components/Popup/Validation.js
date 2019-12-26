import React from 'react'
import PropTypes from 'prop-types'
import application from '../../utils/application'

export const getPopupContent = (props) => {
  const { duplicateButton, onClick } = props
  let content =
    <React.Fragment>
      <span id={props.key} aria-label='Is this a valid road?'>Is this a valid road?</span>
      <br />
      <div className='button-row'>
        <button id='validButton' aria-label='valid road' className='validButton' onClick={() => onClick('y')} >
          &nbsp;Yes
        </button>
        <button id='notValidButton' aria-label='invalid road' className='notValidButton' onClick={() => onClick('n')}>
          &nbsp;No
        </button>
      </div>
    </React.Fragment>
  return ({
    container: `<div id="${application.elements.leaflet.popup}"></div>`,
    content
  })
}

getPopupContent.propTypes = {
  onClick: PropTypes.func.isRequired,
  duplicateButton: PropTypes.bool.isRequired
}
