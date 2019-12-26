import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import L from 'leaflet'


import CompletenessDialog from './CompletenessDialog'

const POSITION_RIGHT = 'right'
const POSITION_RIGHT_OFFSET = new L.Point(-140, 0)
const POSITION_LEFT = 'left'
const POSITION_LEFT_OFFSET = new L.Point(15, 0)

const POPUP_MOVE_THRESHOLD = 1e-6

export default class CompletenessPopup extends React.Component {
  constructor (props) {
    super(props)

    this.onToggleMove = this.onToggleMove.bind(this)
    this.state = { position: POSITION_RIGHT }

    const placement = this.getPopupPlacement(this.props.feature, this.state.position)
    const popupContainer = document.createElement('div')
    this.popup = L.popup({
      closeButton: false,
      closeOnClick: false,
      closeOnEscapeKey: false,
      offset: placement.offset
    }).setContent(popupContainer)
      .setLatLng(placement.latlng)
    
    this.popup.openOn(this.props.map)
  }

  componentWillUnmount () {
    this.popup.removeFrom(this.props.map)
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevState.position !== this.state.position
        || this.hasMoved(prevProps.feature, this.props.feature)) {
      const placement = this.getPopupPlacement(this.props.feature, this.state.position)
      this.popup.options.offset = placement.offset
      this.popup.setLatLng(placement.latlng)
    }
  }

  hasMoved (oldFeature, newFeature) {
    const oldLatLng = oldFeature.getBounds().getCenter()
    const newLatLng = newFeature.getBounds().getCenter()

    const deltaLat = Math.abs(oldLatLng.lat - newLatLng.lat)
    const deltaLon = Math.abs(oldLatLng.lng - newLatLng.lng)

    return deltaLat > POPUP_MOVE_THRESHOLD ||
            deltaLon > POPUP_MOVE_THRESHOLD
  }

  onToggleMove () {
    this.setState(state => {
      return {
        position: this.togglePosition(state.position)
      }
    })
  }

  togglePosition (position) {
    return position === POSITION_LEFT ? POSITION_RIGHT : POSITION_LEFT
  }

  getPopupPlacement (feature, position) {
    const bounds = feature.getBounds()

    if (position === POSITION_RIGHT) {
      return {
        offset: POSITION_RIGHT_OFFSET,
        latlng: bounds.getNorthEast()
      }
    } else {
      return {
        offset: POSITION_LEFT_OFFSET,
        latlng: bounds.getNorthWest()
      }
    }
  }

  render () {
    const content = <CompletenessDialog onAccept={this.props.onAccept}
      onReject={this.props.onReject}
      position={this.togglePosition(this.state.position)} 
      onToggleMove={this.onToggleMove} />
    return ReactDOM.createPortal(content, this.popup.getContent())
  }
}

CompletenessPopup.propTypes = {
  onReject: PropTypes.func.isRequired,
  onAccept: PropTypes.func.isRequired,
  map: PropTypes.object.isRequired,
  feature: PropTypes.object.isRequired
}
