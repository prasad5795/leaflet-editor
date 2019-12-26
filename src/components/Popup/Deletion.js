import React from 'react'
import PropTypes from 'prop-types'
import application from '../../utils/application'

export const getPopupContent = (props) => {
  const { onClick } = props
  let content =
    <React.Fragment>
      <span id={props.key} aria-label='Is there a road inside the buffer ?'>Is there a road inside the buffer ?</span>
      <br />
      <button id='toKeepButton' aria-label='no deletion needed' className={'validButton'} onClick={() => onClick('y')} >
        &nbsp;Yes
      </button>
      <button id='toDeleteButton' aria-label='deletion needed' className={'notValidButton'} onClick={() => onClick('n')}>
        &nbsp;No
      </button>
    </React.Fragment>
  let container = `<div id="${application.elements.leaflet.popup}" style="width: 190px;"></div>`
  return ({
    container,
    content
  })
}

getPopupContent.propTypes = {
  onClick: PropTypes.func.isRequired
}
