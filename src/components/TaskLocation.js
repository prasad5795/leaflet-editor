import React from 'react'
import { connect } from 'react-redux'
import { toggleLocation } from '../actions'
import L from 'leaflet'

export const Location = (props) => {
  return (
    <div aria-label='location'>
      <button className='fa fa-location-arrow icon fa-pull-centre' id='locationButton' onMouseDown={(event) => event.preventDefault()} onClick={() => props.toggleLocation()} />
      <br />
      <span className='location-label copyText buttonText' onClick={() => { navigator.clipboard.writeText(getLocation(props.task.feature)) }}>
        {(props.toggleLocationStatus ? getLocation(props.task.feature) : 'Task Location')}
      </span> <br />
    </div>

  )
}

const getLocation = (feature) => {
  try {
    let coordinates = L.geoJSON(feature).getBounds().getCenter()
    return (coordinates.lat.toFixed(5) + ', ' + coordinates.lng.toFixed(5))
  } catch (error) {
    return 'Unknown'
  }
}

const mapStateToProps = (state) => ({
  toggleLocationStatus: state.ui.toggleLocation,
  task: state.task
})

export default connect(mapStateToProps, { toggleLocation })(Location)
