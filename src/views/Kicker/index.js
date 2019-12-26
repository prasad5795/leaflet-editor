import React from 'react'
import { connect } from 'react-redux'
import ToriMap from '../../components/Map'
import {
  getFillTask,
  postCompletedFillTask
} from '../../actions'
import Feature from '../../geometry/Feature'
import Info from '../../components/Info/Kicker'
import HelpButton from '../../components/HelpButton'
import { notify } from 'react-notify-toast'
import application from '../../utils/application'
import L from 'leaflet'
import 'leaflet.pm-snapignore'
import 'leaflet.pm-snapignore/dist/leaflet.pm.css'
import TaskLocation from '../../components/TaskLocation'
import * as turf from '@turf/turf'

class Kicker extends React.Component {
  constructor(props) {
    super(props)
    this._onCreate = this._onCreate.bind(this)
    this._onTaskDone = this._onTaskDone.bind(this)
    this._onKeyDown = this._onKeyDown.bind(this)
  }

  componentDidMount() {
    document.title = 'Tori Kicker'
    this.props.getFillTask()
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
    delete this.drawnFeatures
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
      cursorMarker: true
    })
    this.props.map.pm.disableDraw('Line')

    const customControl = L.Control.extend({
      options: {
        position: 'topleft'
      },
      onAdd: function () {
        let container = L.DomUtil.create('button', 'leaflet-bar fa fa-check-circle fa-2x customLeafletBarButton')
        container.title = 'Ready to submit'
        container.id = application.elements.readyToSubmit
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
      }
    } catch (error) {
      console.error(error)
    }
  }

  removePreviousTask() {
    try {
      this.fillTask.remove()
      this.existingGeometry.remove()
    } catch (error) { }
  }

  featureCrossesTask(featureCoordinates) {
    try {
      return turf.lineIntersect(turf.lineString(this.props.task.feature.geometry.coordinates), turf.lineString(featureCoordinates)).features.length > 0
    } catch (error) {
      return false
    }
  }

  featureTouchesTask(featureCoordinates) {
    try {
      let drawnFeaturePoints = turf.explode(turf.lineString(featureCoordinates)).features
      let closestPoint = Math.min(...drawnFeaturePoints.map(point => {
        return turf.pointToLineDistance(point.geometry.coordinates, this.props.task.feature, { units: 'kilometers' }) * 1000
      }))
      return closestPoint < 1
    } catch (error) {
      return false
    }
  }
  featureTouchesNewlyDrawnRoads(featureCoordinates) {
    try {
      let drawnFeaturePoints = turf.explode(turf.lineString(featureCoordinates)).features
      if (this.drawnFeatures) {
        let lines = []
        this.drawnFeatures.forEach(layer => {
          lines.push(layer.getLatLngs().map(coordinate => [coordinate.lng, coordinate.lat]))
        })
        let closestPoint = Math.min(...drawnFeaturePoints.map(point => {
          return Math.min(...lines.map(line => {
            return turf.pointToLineDistance(point.geometry.coordinates, turf.lineString(line), { units: 'kilometers' }) * 1000
          }))
        }))
        return closestPoint < 1
      }
      return false
    } catch (error) {
      return false
    }
  }

  featureOverlapsExisting(featureCoordinates) {
    let feature = turf.lineString(featureCoordinates)
    return this.existingGeometry.toGeoJSON().features.some(item => {
      let intersection = turf.lineOverlap(feature, item, { tolerance: '0.005' })
      if (intersection.features.length > 0) {
        return true
      }
      return false
    })
  }

  _onCreate(event) {
    if (this.props.task !== undefined) {
      let createdFeatureCoordinates = event.layer.getLatLngs().map(coordinate => [coordinate.lng, coordinate.lat])
      if (this.featureOverlapsExisting(createdFeatureCoordinates)) {
        event.layer.bindPopup('The new road should not overlap with existing roads.', { className: 'kicker-popup' }).openPopup()
        event.layer.getPopup().on('remove', () => event.layer.remove())
      }
      if (this.featureCrossesTask(createdFeatureCoordinates) || this.featureTouchesTask(createdFeatureCoordinates)) {
        if (this.drawnFeatures === undefined) {
          this.drawnFeatures = new Array(event.layer)
        } else {
          this.drawnFeatures.push(event.layer)
        }
      } else {
        event.layer.bindPopup('The road needs to cross or connect to the starting segment (red colored line)', { className: 'kicker-popup' }).openPopup()
        event.layer.getPopup().on('remove', () => event.layer.remove())
      }
    }
  }

  _onKeyDown(pressedKeys) {
    if (!this.props.keyboardLock) {
      let drawingController = this.props.map.pm.Draw['Line']
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
    }
  }

  notifyUser(text, type = 'success') {
    notify.show(text, type)
  }

  _onTaskDone() {
    let features = []
    if (this.drawnFeatures) {
      let lines = []
      this.drawnFeatures.forEach(layer => {
        lines.push(layer.getLatLngs().map(coordinate => [coordinate.lng, coordinate.lat]))
      })
      features = lines.map(line => new Feature(line))
      // eslint-disable-next-line
      this.props.map.eachLayer(layer => this.drawnFeatures.filter(featureLayer => {
        if (featureLayer._leaflet_id === layer._leaflet_id) {
          // remove drawn features
          layer.remove()
        }
      }))
    }
    let task = {
      id: this.props.task.id,
      branch: this.props.existingGeometry.properties.branch.branchId,
      version: this.props.existingGeometry.properties.version.journalVersion,
      features: features
    }
    this.props.postCompletedFillTask(task)
  }

  render() {
    return (
      <div>
        <div className={'buttonContainer'}  onClick={() => {this.props.map.pm.Draw['Line'].disable()}}>
          <TaskLocation />
          <HelpButton />
        </div>
        <Info />
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

export default connect(mapStateToProps, { getFillTask, postCompletedFillTask })(ToriMap(Kicker, { zoomLevel }))
