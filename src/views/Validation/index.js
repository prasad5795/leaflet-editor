import React from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import ToriMap from '../../components/Map'
import {
  getValidationTask,
  addAcceptedFeature,
  addRejectedFeature,
  postCompletedValidationTask
} from '../../actions'
import { getPopupContent } from '../../components/Popup/Validation'
import UserMetrics from '../../components/UserMetrics'
import Info from '../../components/Info/Validation'
import * as turf from '@turf/turf'
import HelpButton from '../../components/HelpButton'
import TaskLocation from '../../components/TaskLocation'
import application from '../../utils/application'
import L from 'leaflet'
import Notifications, { notify } from 'react-notify-toast'



let sateliteLayerState = true;
let probeLayerState = true;
let mainProps;

export class Validation extends React.Component {
  constructor(props) {
    super(props)
    this.onPopupClick = this.onPopupClick.bind(this)
    // this.layerSwitch = this.layerSwitch.bind(this)

    
  }

  componentDidMount() {
    document.title = 'Tori Validator'
    this.props.getValidationTask()
    this.renderPopup()
    //document.addEventListener('keydown', this.onPopupClick.bind(this))
  }

  UNSAFE_componentWillUnmount() {
    document.removeEventListener('keydown', this.onPopupClick)
  }

  shouldComponentUpdate(nextProps) {
    // console.log("shouldComponentUpdate", nextProps.existingGeometry)
    if (nextProps.task.id !== this.props.task.id) return true
    if (nextProps.existingGeometry && nextProps.existingGeometry.features) {
      // console.log("adfasdf")
      return true
    }
    if (nextProps.existingGeometry.features !== this.props.existingGeometry.features) return true
    if (this.props.task.error) return true
    return false
  }

  componentDidUpdate() {
    this.removePreviousTask()
    this.addTaskToMap()
    this.addGeometryToMap()
    if (!this.props.loading) {
      if (this.props.existingGeometry.error) {
        return notify.show(application.messages.unableToLoadGeometry, 'warning')
      }
      if (this.props.task.error) {
        return notify.show(this.props.task.error, 'warning')
      }
      if (this.props.loadingTask) {
        return notify.show(application.messages.loadingData, 'custom', -1, { background: '#b1110e', text: '#ffffff', top: '5%' })
      }
      if (!this.props.loadingTask) return notify.hide()
    }
  }

  addGeometryToMap() {
    try {
      this.existingGeometry = L.geoJSON(Object.values(this.props.existingGeometry.features), {
        style: {
          color: '#BCDCF5',
          weight: 10
        }
      })
      this.existingGeometry.addTo(this.props.map).bringToBack()
      this.popup.setLatLng(this.lead.getBounds().getNorthEast())
    } catch (error) {
      console.error(error)
    }
  }

  addTaskToMap() {
    if (this.props.task.feature) {
      try {
        this.lead = L.geoJSON(this.props.task.feature, {
          style: {
            // dashArray: '10',
            color: 'darkviolet',
            weight: 7
          }
        })
        this.lead.addTo(this.props.map).bringToFront()
        this.props.map.fitBounds(this.lead.getBounds(), { maxZoom: 17 })
        
      } catch (error) {
        console.error(error)
      }
    }
  }

  removePreviousTask() {
    try {
      this.lead.remove()
      this.existingGeometry.remove()
    } catch (error) { }
  }

  renderPopup() {
    let popup = getPopupContent({ onClick: this.onPopupClick, duplicateButton: this.props.user.duplicateButtonAllowed })
    this.popup = L.popup({
      closeButton: false,
      closeOnClick: false,
      closeOnEscapeKey: false,
      offset: new L.Point(0, -30)
    }).setContent(popup.container)
      .setLatLng([0, 0])
    console.log("map",this.props.map)
    this.popup.openOn(this.props.map)
    ReactDOM.render(popup.content, document.getElementById(application.elements.leaflet.popup))
  }

  onPopupClick(choice) {
    if (!this.props.loadingTask && !this.props.keyboardLock) {
      let key = choice.key ? choice.key.toLowerCase() : choice.toLowerCase()
      let featureLength = turf.length(turf.lineString(this.props.task && this.props.task.feature ? this.props.task.feature.geometry.coordinates : null), { units: 'kilometers' })
      let task = {
        id: this.props.task.id,
        branch: this.props.existingGeometry.properties.branch.branchId,
        version: this.props.existingGeometry.properties.version.journalVersion
      }
      if (key === 'y') {
        this.props.addAcceptedFeature(featureLength)
        task = {
          feedbackValue: 'ACCEPTED',
          ...task
        }
        this.props.postCompletedValidationTask(task)
      }
      if (key === 'n') {
        this.props.addRejectedFeature(featureLength)
        task = {
          feedbackValue: 'REJECTED',
          ...task
        }
        this.props.postCompletedValidationTask(task)
      }
      if ((key === 'd') && this.props.user.duplicateButtonAllowed) {
        this.props.addRejectedFeature(featureLength)
        task = {
          feedbackValue: 'DUPLICATE',
          ...task
        }
        this.props.postCompletedValidationTask(task)
      }
    }
  }

  

  render() {
    return (
      <div>
        <UserMetrics
          user={this.props.user}
          accepted={this.props.accepted}
          rejected={this.props.rejected}
          processed={this.props.processed}
          taskId={this.props.task.id}
          correlationId={this.props.task.CorrelationId}
          correlationIdAllowed={this.props.user.correlationIdAllowed}
        />
        
        <div className={'buttonContainer'}>
          <TaskLocation />
          <HelpButton />
        </div>
        <Info />
        <Notifications></Notifications>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  task: state.task,
  accepted: state.ui.accepted,
  rejected: state.ui.rejected,
  processed: state.ui.processed,
  toggleInfo: state.ui.toggleInfo,
  toggleLocation: state.ui.toggleLocation,
  sateliteLayerState: state.ui.sateliteLayerState,
  probeLayerState: state.ui.probeLayerState,
  existingGeometry: state.existingGeometry,
  taskError: state.ui.taskError,
  user: state.user,
  loading: state.ui.loading,
  loadingTask: state.ui.loadingTask,
  keyboardLock: state.ui.keyboardLock,
  map:state.ui.map
})

const zoomLevel = {
  default: 18,
  min: 1
}

// export default connect(mapStateToProps, { getValidationTask, addAcceptedFeature, addRejectedFeature, postCompletedValidationTask })(ToriMap(Validation, {mainProps}))
export default connect(mapStateToProps, { getValidationTask, addAcceptedFeature, addRejectedFeature, postCompletedValidationTask })(ToriMap(Validation,{zoomLevel}))
