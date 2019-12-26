import React from 'react'
import { connect } from 'react-redux'
import ToriMap from '../../components/Map'
import {
  getEditTask,
  postCompletedEditTask,
} from '../../actions'
import Info from '../../components/Info/Editor'
import HelpButton from '../../components/HelpButton'
import { notify } from 'react-notify-toast'
import application from '../../utils/application'
import L from 'leaflet'
import 'leaflet.pm-snapignore'
import 'leaflet.pm-snapignore/dist/leaflet.pm.css'
import * as turf from '@turf/turf'
import TaskLocation from '../../components/TaskLocation'
import PanicButton from '../../components/PanicButton'
import ReportView from '../../components/ReportView'

export const correctionValue = {
  CORRECTED: 'CORRECTED',
  INVALID: 'INVALID',
  IMPOSSIBLE: 'IMPOSSIBLE'
}

export class Editor extends React.Component {
  constructor(props) {
    super(props)
    this._onCreate = this._onCreate.bind(this)
    this._onTaskDone = this._onTaskDone.bind(this)
    this._onReportSubmit = this._onReportSubmit.bind(this)
    this._onKeyDown = this._onKeyDown.bind(this)
  }

  componentDidMount() {
    document.title = 'Tori Editor'
    this.props.getEditTask()
    this.initEditControls()
  }

  UNSAFE_componentWillUnmount() {
    document.removeEventListener('keydown', this._onKeyDown.bind(this))
  }


  shouldComponentUpdate(nextProps) {
    if (nextProps.task.id !== this.props.task.id) return true
    if (nextProps.existingGeometry.features !== this.props.existingGeometry.features) return true
    if (this.props.task.error) return true
    return false
  }

  componentDidUpdate() {
    this.removePreviousTask()
    this.addTaskToMap()
    this.addGeometryToMap()
  }

  initEditControls() {
    this.props.map.pm.addControls({
      position: 'topleft',
      drawMarker: false,
      drawRectangle: false,
      drawPolygon: false,
      drawCircle: false,
      editMode: false,
      dragMode: false,
      cutPolygon: false,
      removalMode: false
    })
    this.props.map.on('pm:create', this._onCreate)
    /*
      If you are wondering how e.g. the Line button will enable drawing mode with specific options, here it is:
      Simply enable drawing mode programmatically, pass it your options and disable it again. The options will persist, even when the mode is enabled/disabled via the toolbar.
      https://github.com/codeofsumit/leaflet.pm#leafletpm-toolbar
    */
    this.props.map.pm.enableDraw('Line', {
      snappable: true,
      snapDistance: 10,
      finishOn: 'dblClick',
      tooltips: false,
      cursorMarker: true,
    })
    this.props.map.pm.disableDraw('Line')

    const customControl = L.Control.extend({
      options: {
        position: 'topleft'
      },
      onAdd: function () {
        let container = L.DomUtil.create('button', 'leaflet-bar fa fa-times fa-2x noActionNeeded')
        container.title = 'No action needed'
        container.id = application.elements.noActionNeeded
        container.onclick = () => {
          if (this.options.props.task !== undefined) {
            this.options.props.map.pm.disableDraw('Line')
            this.options._onTaskDone()
            container.blur()
            document.getElementById(application.elements.map).focus()
          }
        }
        return container
      }
    })

    this.props.map.addControl(new customControl(this))
    document.addEventListener('keydown', this._onKeyDown.bind(this))
  }

  addGeometryToMap() {
    try {
      this.existingGeometry = L.geoJSON(Object.values(this.props.existingGeometry.features), {
        style: {
          color: '#BCDCF5'
        }
      })
      this.existingGeometry.addTo(this.props.map).bringToBack()
    } catch (error) {
      console.error(error)
    }
  }

  addTaskToMap() {
    try {
      // eslint-disable-next-line no-undef
      let bufferedLead = turf.buffer(this.props.task.feature, process.env.REACT_APP_EDITOR_BUFFER_SIZE, { units: 'meters' })
      this.editTask = L.geoJSON(bufferedLead, {
        style: {
          color: '#FF8A48',
          fill: false
        },
        snapIgnore: true,
        pmIgnore: true
      })
      this.editTask.addTo(this.props.map).bringToFront()
      this.props.map.pm.Draw['Line'].disable()
      this.props.map.fitBounds(this.editTask.getBounds(), { maxZoom: this.props.map.getMaxZoom() })
    } catch (error) {
      console.error(error)
    }
  }

  removePreviousTask() {
    try {
      this.editTask.remove()
      this.existingGeometry.remove()
    } catch (error) { }
  }

  /*
  * @param feature - the created road.
  * @return result - return true if an intersection was detected, false otherwise.
  * Uses turf's lineOverlap method to only detect stretches where the created road overlaps the existing MDS.
  * https://turfjs.org/docs/#lineOverlap
  * */
  checkOverlap(feature) {
    return this.existingGeometry.toGeoJSON().features.some(item => {
      let intersection = turf.lineOverlap(feature, item, { tolerance: '0.005' })
      if (intersection.features.length > 0) {
        L.popup({ className: 'overlap-popup' })
          .setLatLng(this.props.map.getCenter())
          .setContent('Created roads should not overlap with existing roads')
          .openOn(this.props.map)
        return true
      }
      return false
    })
  }

  checkTouching(feature) {
    let touching = this.isTouchingExistingFeatures(feature)
    if (touching === false) {
      L.popup({ className: 'overlap-popup' })
        .setLatLng(this.props.map.getCenter())
        .setContent('New roads should start from existing roads')
        .openOn(this.props.map)
    }
    return touching
  }

  isTouchingExistingFeatures(feature) {
    try {
      return this.existingGeometry.toGeoJSON().features.some(existingFeature => this.areTouching(feature, existingFeature))
    } catch (error) {
      return false
    }
  }

  areTouching(feature1, feature2) {
    let featurePoints = turf.explode(turf.lineString(feature1.geometry.coordinates)).features
    let closestPoint = Math.min(...featurePoints.map(point => {
      return turf.pointToLineDistance(point.geometry.coordinates, feature2.geometry, { units: 'kilometers' }) * 1000
    }))
    return closestPoint < 1 // meter
  }

  /*
    The simplification is now done in this method.
    turf.simplify takes as arguments the created road and the tolerance level, simplifies it according to the
    Douglas-Peucker algorithm, and returns a GeoJSON object that is then passed to the _onTaskDone method.
    https://turfjs.org/docs/#simplify
   */
  _onCreate(event) {
    if (this.props.task !== undefined) {
      const feature = turf.simplify(event.layer.toGeoJSON(), { tolerance: 0.0000045 })
      if (this.checkOverlap(feature) === false && this.checkTouching(feature) === true) this._onTaskDone(feature, null)
      event.layer.remove()
    }
  }

  notifyUser(text, type = 'success') {
    notify.show(text, type)
  }

  _onKeyDown(pressedKeys) {
    let drawingController = this.props.map.pm.Draw['Line']
    if (!this.props.keyboardLock) {
      switch (pressedKeys.key) {
      case 'Enter':
        if (drawingController.enabled()) {
          if (drawingController._layer._latlngs.length > 1) {
            drawingController._finishShape()
            drawingController.disable()
          }
        } else {
          drawingController.enable()
        }
        break
      case 'Escape':
        drawingController.disable()
        break
      case 'Backspace':
        this._onTaskDone()
        break
      case 'Z':
      case 'z':
        if (pressedKeys.ctrlKey === true) {
          drawingController._removeLastVertex()
        }
        break
      default:
      }
    } else {
      drawingController.disable()
    }
  }

  _onTaskDone(drawnFeature, message) {
    const feedbackValue = drawnFeature ? correctionValue.CORRECTED : message ? correctionValue.IMPOSSIBLE : correctionValue.INVALID
    const feature = { correctedFeature: drawnFeature }

    const task = {
      id: this.props.task.id,
      feedbackValue: feedbackValue,
      ...feature,
      ...message
    }

    this.props.postCompletedEditTask(task)
  }

  _onReportSubmit(choice, message) {
    const userComment = message ? { userComment: message } : { userComment: choice }
    this._onTaskDone(undefined, userComment)
  }

  render() {
    return (
      <div className={'buttonContainer'} onClick={() => {this.props.map.pm.Draw['Line'].disable()}}>
        <PanicButton />
        <TaskLocation />
        <HelpButton />
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
  user: state.user,
  loading: state.ui.loading,
  loadingTask: state.ui.loadingTask,
  keyboardLock: state.ui.keyboardLock
})

const zoomLevel = {
  default: 10,
  min: 9
}

export default connect(mapStateToProps, { getEditTask, postCompletedEditTask })(ToriMap(Editor, { zoomLevel }))
