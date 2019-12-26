import React from 'react'
import PropTypes from 'prop-types'
import application from '../../utils/application'

export const getPopupContent = (props) => {
  const { onClick } = props
  let content =
    <React.Fragment>
      <span id={props.key} aria-label='Is the road inside the buffer ?'>Is this a missing road?</span>
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
    container: `<div id="${application.elements.leaflet.popup}" style="width: 150px;"></div>`,
    content
  })
}

getPopupContent.propTypes = {
  onClick: PropTypes.func.isRequired,
}
