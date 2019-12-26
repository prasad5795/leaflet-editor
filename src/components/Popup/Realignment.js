import React from 'react'
import PropTypes from 'prop-types'
import application from '../../utils/application'

export const getPopupContent = (props) => {
  const { onClick } = props
  let content =
    <React.Fragment>
      <span id={props.key} aria-label='Is the road inside the buffer ?'>Is the road inside the buffer ?</span>
      <br />
      <button aria-label='realignment needed' id={'validButton'} className='validButton' onClick={() => onClick('y')} >
        &nbsp;Yes
      </button>
      <button aria-label='no realignment needed' id={'notValidButton'} className='validButton' onClick={() => onClick('n')}>
        &nbsp;No
      </button>
    </React.Fragment>
  let container = `<div id="${application.elements.leaflet.popup}" style="width: 185px;"></div>`
  return ({
    container,
    content
  })
}

getPopupContent.propTypes = {
  onClick: PropTypes.func.isRequired
}
