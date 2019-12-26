import React from 'react'
import PropTypes from 'prop-types'
import application from '../../utils/application'

export const getPopupContent = (props) => {
    const { onClick } = props
    let content =
        <React.Fragment>
            <span id={props.key} aria-label='Is there a road parallel to the line?'>Is there a road on imagery partially or fully parallel to the red line?</span>
            <br />
            <button id='shift' aria-label='shifted' className={'validButton'} onClick={() => onClick('y')} >
                &nbsp;Yes
            </button>
            <button id='noShift' aria-label='not shifted' className={'notValidButton'} onClick={() => onClick('n')}>
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
