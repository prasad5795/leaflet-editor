
import L from 'leaflet'
import React from 'react'
import { connect } from 'react-redux'
import { getCompletenessTask, postCompletedCompletenessTask } from '../../actions'
import CompletenessPopup from '../../components/Popup/CompletenessPopup'
import Info from '../../components/Info/Completeness'
import ToriMap from '../../components/Map'
import HelpButton from '../../components/HelpButton'
import TaskLocation from '../../components/TaskLocation'
import PanicButton from '../../components/PanicButton'
import ReportView from '../../components/ReportView'

const MDS_GEOMETRY_STYLE = {
  color: '#FFFF00',
  dashArray: '10',
  weight: 3
}

const TASK_BOUNDARY_STYLE = {
  color: '#ff0000',
  weight: 5
}

export class Completeness extends React.Component {
  constructor (props) {
    super(props)
    
    this.onAcceptTask = this.onAcceptTask.bind(this)
    this.onRejectTask = this.onRejectTask.bind(this)
    this.removeFeature = this.removeFeature.bind(this)
    this._onReportSubmit = this._onReportSubmit.bind(this)

  }

  componentDidMount () {
    document.title = 'Tori Completeness'
    this.props.getCompletenessTask()
  }

  shouldComponentUpdate (nextProps) {
    if (nextProps.task.id !== this.props.task.id) return true
    if (nextProps.existingGeometry.features !== this.props.existingGeometry.features) return true
    if (this.props.task.error) return true

    return false
  }

  componentDidUpdate (prevProps) {   
    if (prevProps.task.id !== this.props.task.id) {
      this.addTaskToMap()
    }

    if (prevProps.existingGeometry !== this.props.existingGeometry) {
      this.updateGeometry()
    }
  }

  updateGeometry () {
    if (this.existingGeometry) {
      this.existingGeometry.removeFrom(this.props.map)
      this.existingGeometry = null
    }

    const features = this.props.existingGeometry.features
    if (features && features.length > 0) {
      this.existingGeometry = L.geoJSON(Object.values(features), {
        style: MDS_GEOMETRY_STYLE
      })
  
      this.existingGeometry.addTo(this.props.map).bringToBack()
    }
  }

  removeFeature() {
    if (this.feature) {
      this.feature.removeFrom(this.props.map)
      this.feature = null
    }
  }

  addTaskToMap () {
    this.removeFeature()

    if (this.props.task.feature) {
      try {
        let boundary = {
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: this.props.task.feature.geometry.coordinates[0]
          }
        }
  
        this.feature = L.geoJSON(boundary, {
          style: TASK_BOUNDARY_STYLE
        })
  
        this.feature.addTo(this.props.map).bringToFront()
        this.props.map.fitBounds(this.feature.getBounds(), { maxZoom: this.props.map.getMaxZoom() })
        
      } catch (error) {
        console.error(error)
      }
    }
  }

  onHandleFeedbackTask(feedbackValue, userComment) {
    let task = {
      id: this.props.task.id,
      branch: this.props.existingGeometry.properties.branch.branchId,
      version: this.props.existingGeometry.properties.version.journalVersion,
      feedbackValue: feedbackValue,
      ...userComment
    }
    
    this.props.postCompletedCompletenessTask(task)
    this.removeFeature()
  }

  onAcceptTask () {
    this.onHandleFeedbackTask('ACCEPTED')
  }

  onRejectTask () {
    this.onHandleFeedbackTask('REJECTED')
  }

  _onReportSubmit(choice, message) {
    const userComment = message ? { userComment: message } : { userComment: choice }
    this.onHandleFeedbackTask('IMPOSSIBLE', userComment)
  }

  render() {
    return (
      <div>
        {
          this.feature && <CompletenessPopup onAccept={this.onAcceptTask}
            onReject={this.onRejectTask}
            map={this.props.map}
            feature={this.feature}
          />
        }
        <div className={'buttonContainer'}>
          <PanicButton />
          <TaskLocation />
          <HelpButton />
        </div>
        <Info />
        <ReportView
          onSubmit={this._onReportSubmit}
        />
      </div>
    )
  }
}

const mapStateToProps = state => ({
  task: state.task,
  toggleInfo: state.ui.toggleInfo,
  toggleLocation: state.ui.toggleLocation,
  existingGeometry: state.existingGeometry,
  taskError: state.ui.taskError,
  loading: state.ui.loading,
  loadingTask: state.ui.loadingTask
})

const zoomLevel = {
  default: 18,
  min: 14
}

export default connect(mapStateToProps, { getCompletenessTask, postCompletedCompletenessTask })(ToriMap(Completeness, { zoomLevel }))
