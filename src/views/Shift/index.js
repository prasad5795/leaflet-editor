import React from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import ToriMap from '../../components/Map'
import {
  getShiftTask,
  addAcceptedFeature,
  addRejectedFeature,
  postCompletedShiftTask
} from '../../actions'
import { getPopupContent } from '../../components/Popup/Shift'
import UserMetrics from '../../components/UserMetrics'
import Info from '../../components/Info/Shift'
import TaskLocation from '../../components/TaskLocation'
import * as turf from '@turf/turf'
import HelpButton from '../../components/HelpButton'
import application from '../../utils/application'
import L from 'leaflet'
import PanicButton from '../../components/PanicButton'
import ReportView from '../../components/ReportView';

export class ShiftCheck extends React.Component {
  constructor (props) {
    super(props)
    this.onPopupClick = this.onPopupClick.bind(this)
    this._onReportSubmit = this._onReportSubmit.bind(this)
    this.onKeyboardInput = this.onKeyboardInput.bind(this)
  }

  componentDidMount () {
    document.title = 'Tori Shift check'
    this.props.getShiftTask()
    this.renderPopup()
    this.onPopupClick.bind(this)
    document.addEventListener('keydown', this.onKeyboardInput)
  }

  shouldComponentUpdate (nextProps) {
    if (nextProps.task.id !== this.props.task.id) return true
    if (this.props.task.error) return true
    return false
  }

  componentDidUpdate () {
    this.removePreviousTask()
    this.addTaskToMap()
  }

  addTaskToMap () {
    try {
      // eslint-disable-next-line no-undef
      if (this.props.task.feature) {
        this.fillTask = L.geoJSON(this.props.task.feature, {
          style: {
            color: '#ff0000',
            fill: false
          },
          snapIgnore: false,
          pmIgnore: true
        })
        this.fillTask.addTo(this.props.map).bringToFront()
        this.props.map.pm.Draw['Line'].disable()
        this.props.map.fitBounds(this.fillTask.getBounds(), { maxZoom: this.props.map.getMaxZoom() })
        this.popup.setLatLng(this.fillTask.getBounds().getNorthEast())
      }
    } catch (error) {
      console.error(error)
    }
  }

  removePreviousTask () {
    try {
      this.lead.remove()
    } catch (error) {}
  }

  renderPopup () {
    let popup = getPopupContent({ onClick: this.onPopupClick })
    this.popup = L.popup({
      closeButton: false,
      closeOnClick: false,
      closeOnEscapeKey: false,
      offset: new L.Point(0, -30)
    }).setContent(popup.container)
      .setLatLng([0, 0])
    this.popup.openOn(this.props.map)
    ReactDOM.render(popup.content, document.getElementById(application.elements.leaflet.popup))
  }

  onPopupClick (choice,userComment) {
    if (this.props.task) {
      this.handleCompletedTask(choice, userComment)
    }
  }

  onKeyboardInput(input) {
    if (this.props.task  && !this.props.keyboardLock) {
      if (input.key === 'y' || input.key === 'n') {
        this.handleCompletedTask(input.key)
      }
    }
  }

  handleCompletedTask(choice, userComment = '') {
    let task = {
      id: this.props.task.id,
      branch: this.props.existingGeometry.properties.branch.branchId,
      version: this.props.existingGeometry.properties.version.journalVersion
    }
    let featureLength = turf.length(turf.lineString(this.props.task.feature.geometry.coordinates), { units: 'kilometers' })
    switch (choice) {
    case 'n':
      this.props.addRejectedFeature(featureLength)
      task = {
        feedbackValue: 'REJECTED',
        ...task
      }
      this.props.postCompletedShiftTask(task)
      break
    case 'y':
      this.props.addAcceptedFeature(featureLength)
      task = {
        feedbackValue: 'ACCEPTED',
        ...task
      }
      this.props.postCompletedShiftTask(task)
      break
    case 'i':
      this.props.addRejectedFeature(featureLength)
      task = {
        feedbackValue: 'IMPOSSIBLE',
        ...userComment,
        ...task
      }
      this.props.postCompletedShiftTask(task)
      break
    default:
      break

    }
  
  }

  _onReportSubmit(choice, message) {
    const userComment = message ? { userComment: message } : { userComment: choice }
    this.onPopupClick('i', userComment)
  }

  render () {
    return (
      <div>
        <UserMetrics
          user={this.props.user}
          accepted={this.props.accepted}
          rejected={this.props.rejected}
          processed={this.props.processed}
          taskId={this.props.task.id}
        />
        
        <div className={'buttonContainer'}>
          <PanicButton />
          <TaskLocation />
          <HelpButton />
        </div>
        <Info />
        <ReportView displayOtherOption
            onSubmit={this._onReportSubmit}
        />
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
  existingGeometry: state.existingGeometry,
  taskError: state.ui.taskError,
  user: state.user,
  loading: state.ui.loading,
  keyboardLock: state.ui.keyboardLock
})

const zoomLevel = {
  default: 18,
  min: 1
}

export default connect(mapStateToProps, { getShiftTask, addAcceptedFeature, addRejectedFeature, postCompletedShiftTask })(ToriMap(ShiftCheck, { zoomLevel }))
