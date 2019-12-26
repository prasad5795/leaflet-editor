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
import L, { marker } from 'leaflet'
import '@geoman-io/leaflet-geoman-free';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';
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
  markerDraggingStarted = false
  draggingMarkerId;
  endMarkers = {};
  mapOfMarkersWithSameCoords = {}
  markerToLineMapping = {}
  oldMarkers = [];
  stackOfUndo = new Array()
  myGeoJson;
  lastDragEvent;
  operationExecuting = false;

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
    // this.props.map.pm.addControls({
    //   position: 'topright',
    //   // editMode: true,
    //   // dragMode: true
    // })
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
    this.props.map.doubleClickZoom.disable();

    this.props.map.pm.disableDraw('Line')


    this.props.map.on('layeradd', (e) => {
      let layers = this.props.map._layers;
      let markers = []
      this.operationExecuting = true;
      setTimeout(() => {
        for (let key of Object.keys(layers)) {
          if (layers[key].options && layers[key].options.icon && layers[key].options.icon.options && layers[key].options.icon.options.className && layers[key].options.icon.options.className == "marker-icon marker-icon-middle") {
            layers[key].remove()
            continue;
          }
          //endpoints ka logic 
          if (e.layer && e.layer._latlng && layers[key] && layers[key].pm && layers[key].pm._markers && layers[key].feature && layers[key].feature.geometry && layers[key].feature.geometry.type && layers[key].feature.geometry.type == "LineString") {
            let latlngs = layers[key]._latlngs;
            let endPoints = [latlngs[0], latlngs[latlngs.length - 1]]
            for (let marker of layers[key].pm._markers) {
              // marker._events.contextmenu.length = 0;

              this.markerToLineMapping[marker._leaflet_id] = layers[key]._leaflet_id
              for (let latlng of endPoints) {
                // console.log(latlng)
                let pt1 = turf.point([latlng.lat, latlng.lng])
                let pt2 = turf.point([latlng.lat, latlng.lng])
                let pt3 = turf.point([e.layer._latlng.lat, e.layer._latlng.lng])
                if (turf.booleanEqual(pt1, pt3) || turf.booleanEqual(pt2, pt3)) {
                  this.endMarkers[e.layer._leaflet_id] = e.layer
                }
              }
            }
          }
        }
        if (e.layer && e.layer._latlng) {
          let flag = false;
          for (let oldMarker of this.oldMarkers) {
            let pt1 = turf.point([oldMarker._latlng.lat, oldMarker._latlng.lng])
            let pt2 = turf.point([e.layer._latlng.lat, e.layer._latlng.lng])
            if (turf.booleanEqual(pt1, pt2)) {
              flag = true
              for (let undoItem of this.stackOfUndo) {
                if (undoItem.idOfFeature == oldMarker._leaflet_id) {
                  undoItem.idOfFeature = e.layer._leaflet_id
                  undoItem.current_layer = e.layer
                }
              }

              for (let key of Object.keys(this.mapOfMarkersWithSameCoords)) {
                if (key == oldMarker._leaflet_id) {
                  this.mapOfMarkersWithSameCoords[e.layer._leaflet_id] = this.mapOfMarkersWithSameCoords[oldMarker._leaflet_id].slice()
                  delete this.mapOfMarkersWithSameCoords[oldMarker._leaflet_id]
                } else {
                  let markersToBeReplaced = this.mapOfMarkersWithSameCoords[key]
                  for (let k = 0; k < markersToBeReplaced.length; k++) {
                    if (markersToBeReplaced[k]._leaflet_id == oldMarker._leaflet_id) {
                      markersToBeReplaced.splice(k, 1)
                      markersToBeReplaced.push(e.layer)
                      break
                    }
                  }
                }
                //intersection logic
                if (this.mapOfMarkersWithSameCoords[e.layer._leaflet_id] && this.mapOfMarkersWithSameCoords[e.layer._leaflet_id].length > 0) {
                  this.endMarkers[e.layer._leaflet_id] = e.layer
                }
              }
            }
          }


          if (!flag && this.oldMarkers.length > 0) {
            this.mapOfMarkersWithSameCoords[e.layer._leaflet_id] = []
          }

          // console.log(this.endMarkers)
          for (let endMarker of Object.keys(this.endMarkers)) {
            let endMarkerLayer = this.endMarkers[endMarker]
            if (endMarkerLayer._icon && endMarkerLayer._events) {
              endMarkerLayer._icon.classList.remove("marker-icon")
              endMarkerLayer._icon.classList.add("non-deletable-marker")
              endMarkerLayer._events.contextmenu = null;
              // console.log("endmarker", endMarkerLayer)
            }
          }

          // let lineId = this.markerToLineMapping[e.layer._leaflet_id]
          // let coords = layers[lineId]._latlngs
          // console.log(coords)
          // for(let coord of coords){

          // }


          if (!this.endMarkers[e.layer._leaflet_id]) {
            e.layer._events.contextmenu[0].fn = (e1) => {
              let lineLayer = e1.sourceTarget._events.contextmenu[0].ctx._layer
              let oldLatlangs = e1.sourceTarget._events.contextmenu[0].ctx._layer._latlngs.slice()
              let indexOfDeleteMarker = oldLatlangs.indexOf(e1.latlng);
              e1.target.remove()
              this.stackOfUndo.push({
                idOfFeature: lineLayer._leaflet_id,
                latlngs: oldLatlangs.slice(),
                type: "delete_point",
                current_layer: lineLayer
              })
              oldLatlangs.splice(indexOfDeleteMarker, 1)
              console.log("delete event", e1, lineLayer, oldLatlangs, this.stackOfUndo)
              lineLayer.setLatLngs(oldLatlangs)

            }
          }

          e.layer.on('dragstart', (e1) => {
            this.markerDraggingStarted = true;
            this.draggingMarkerId = e1.sourceTarget._leaflet_id
          })

          e.layer.on('dragend', (e1) => {
            this.markerDraggingStarted = false;
            this.draggingMarkerId = undefined
            // this.stackOfUndo.push({idOfFeature:e.sourceTarget._leaflet_id,latlngs:e.sourceTarget._latlngs})
            this.stackOfUndo.push({
              idOfFeature: e1.target._leaflet_id,
              latlngs: this.lastDragEvent.oldLatLng,
              type: "drag_point",
              current_layer: e
            })
          })

          e.layer.on('drag', (e1) => {
            this.lastDragEvent = e1;
            if (this.markerDraggingStarted && this.mapOfMarkersWithSameCoords[this.draggingMarkerId].length > 0) {
              let markersToBeEdited = this.mapOfMarkersWithSameCoords[this.draggingMarkerId]
              if (markersToBeEdited.length > 0) {
                for (let j = 0; j < markersToBeEdited.length; j++) {
                  markersToBeEdited[j].setLatLng(e1.latlng)
                }
              }
            }
          })
        }
        this.operationExecuting = false;
      }, 0)
    })

    const customControl = L.Control.extend({
      options: {
        position: 'topright'
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
      //some other approach starts 
      this.myGeoJson = L.geoJSON(this.props.task.feature, {
        style: {
          color: '#FF8A48',
          fill: false,
          weight: 10
        },
        snapIgnore: true,
        pmIgnore: false,
        allowSelfIntersection: true
      })
      this.myGeoJson.addTo(this.props.map).bringToFront()
      this.myGeoJson.pm.enable()

      //take all the layers
      let layers = this.props.map._layers;
      let markers = []
      let lines = []
      let middleMarkers = []
      // extract markers(white balls) from all the layers and make an array of markers
      for (let key of Object.keys(layers)) {
        if (layers[key].options && layers[key].options.icon && layers[key].options.icon.options && layers[key].options.icon.options.className && layers[key].options.icon.options.className == "marker-icon") {
          markers.push(layers[key])
        }
        if (layers[key].feature && layers[key].feature.geometry && layers[key].feature.geometry.type && layers[key].feature.geometry.type == "LineString") {
          lines.push(layers[key])
        }

        if (layers[key].options && layers[key].options.icon && layers[key].options.icon.options && layers[key].options.icon.options.className && layers[key].options.icon.options.className == "marker-icon marker-icon-middle") {
          middleMarkers.push(layers[key])
        }

      }
      for (let middleMarker of middleMarkers) {
        middleMarker.remove()
      }

      for (let line of lines) {
        for (let marker of line.pm._markers)
          this.markerToLineMapping[marker._leaflet_id] = line._leaflet_id
      }

      // create a map of markers with same lat lon 
      //that map will have marker leaflet id as key and an array of markers having same lat lon
      for (let i = 0; i < markers.length; i++) {
        this.mapOfMarkersWithSameCoords[markers[i]._leaflet_id] = []
        for (let j = 0; j < markers.length; j++) {
          // if()
          let pt1 = turf.point([markers[i]._latlng.lat, markers[i]._latlng.lng])
          let pt2 = turf.point([markers[j]._latlng.lat, markers[j]._latlng.lng])
          if (turf.booleanEqual(pt1, pt2) && i !== j) {
            this.mapOfMarkersWithSameCoords[markers[i]._leaflet_id].push(markers[j])
          }
        }
      }
      // // now add event listener to all the markers and listen to pm:edit event
      // // once any marker -> all the markers in that markers array in map will be moved
      // for (let i = 0; i < markers.length; i++) {

      //   markers[i].on('dragstart', (e) => {
      //     this.markerDraggingStarted = true;
      //     this.draggingMarkerId = e.sourceTarget._leaflet_id
      //   })

      //   markers[i].on('dragend', (e) => {
      //     this.markerDraggingStarted = false;
      //     this.draggingMarkerId = undefined
      //     // this.stackOfUndo.push({
      //     //   idOfFeature: e.target._leaflet_id,
      //     //   latlngs: this.lastDragEvent.oldLatLng,
      //     //   type: "drag_point",
      //     //   current_layer: markers[i]
      //     // })
      //     // console.log("pushed",this.stackOfUndo)

      //   })

      //   markers[i].on('drag', (e) => {
      //     this.lastDragEvent = e;
      //     if (this.markerDraggingStarted && this.mapOfMarkersWithSameCoords[this.draggingMarkerId].length > 0) {
      //       let markersToBeEdited = this.mapOfMarkersWithSameCoords[this.draggingMarkerId]
      //       if (markersToBeEdited.length > 0) {
      //         for (let j = 0; j < markersToBeEdited.length; j++) {
      //           markersToBeEdited[j].setLatLng(e.latlng)
      //         }
      //       }
      //     }
      //   })
      // }

      this.myGeoJson.on('dblclick', (e) => {
        let latlngs = e.sourceTarget._latlngs
        let point1 = e.latlng
        let distances = []
        for (let i = 0; i < latlngs.length - 1; i++) {
          let pt1 = [latlngs[i].lat, latlngs[i].lng]
          let pt2 = [latlngs[i + 1].lat, latlngs[i + 1].lng]
          let line = turf.lineString([pt1, pt2])
          let pt3 = [point1.lat, point1.lng]
          distances.push({
            index: i + 1,
            distance: turf.pointToLineDistance(pt3, line)
          })
        }
        distances.sort((a, b) => {
          return a.distance - b.distance
        })
        let sliceIndex = distances[0].index;
        let featureToBeAdded = e.sourceTarget.feature
        let id = featureToBeAdded.id
        let layers = e.target._layers
        for (let key of Object.keys(layers)) {
          if (layers[key].feature.id == id) {
            this.oldMarkers = layers[key].pm._markers
            let oldLatLngs = layers[key]._latlngs.slice()
            layers[key]._latlngs.splice(sliceIndex, 0, new L.LatLng(e.latlng.lat, e.latlng.lng))
            layers[key].redraw()
            layers[key].pm.enable()
            this.stackOfUndo.push({
              idOfFeature: e.sourceTarget._leaflet_id,
              latlngs: oldLatLngs,
              type: "add_point",
              current_layer: layers[key]
            })
            break;
          }
        }
        let lineStringFeatureToBePushed = L.polyline(e.sourceTarget._latlngs)
      })
      this.props.map.fitBounds(this.myGeoJson.getBounds(), {
        maxZoom: this.props.map.getMaxZoom()
      })
      //some other approach ends
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
      // if (this.checkOverlap(feature) === false && this.checkTouching(feature) === true) this._onTaskDone(feature, null)
      // event.layer.remove()
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
            if (this.stackOfUndo.length > 0 && !this.operationExecuting) {
              let undoChange = this.stackOfUndo.pop()
              let layers = this.props.map._layers;
              if (undoChange.type == "drag_point") {
                for (let key of Object.keys(layers)) {
                  if (layers[key] && layers[key]._leaflet_id && layers[key]._leaflet_id == undoChange.idOfFeature) {
                    let markersToBeEdited = this.mapOfMarkersWithSameCoords[layers[key]._leaflet_id]
                    if (markersToBeEdited.length > 0) {
                      for (let j = 0; j < markersToBeEdited.length; j++) {
                        markersToBeEdited[j].setLatLng(undoChange.latlngs)
                      }
                    }
                    layers[key].setLatLng(undoChange.latlngs)
                    break;
                  }
                }
              } else if (undoChange.type == "add_point") {
                for (let key of Object.keys(layers)) {
                  if (layers[key] && layers[key]._leaflet_id && layers[key]._leaflet_id == undoChange.idOfFeature) {
                    this.oldMarkers = layers[key].pm._markers
                    layers[key]._latlngs = undoChange.latlngs;
                    layers[key].redraw()
                    layers[key].pm.enable()
                    break;
                  }
                }
              } else if (undoChange.type == "delete_point") {
                for (let key of Object.keys(layers)) {
                  if (layers[key] && layers[key]._leaflet_id && layers[key]._leaflet_id == undoChange.idOfFeature) {
                    this.oldMarkers = layers[key].pm._markers
                    layers[key]._latlngs = undoChange.latlngs;
                    layers[key].redraw()
                    layers[key].pm.enable()
                    break;
                  }
                }
              }
            }
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
      <div className={'buttonContainer'} onClick={() => { this.props.map.pm.Draw['Line'].disable() }}>
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
