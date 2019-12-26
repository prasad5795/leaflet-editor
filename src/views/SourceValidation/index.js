import React, { useEffect, useState, useCallback } from 'react'
import ReactDOM from 'react-dom'
import { connect, useSelector } from 'react-redux'
import ToriMap from '../../components/Map'
import {
  getSourceValidationTask,
  addAcceptedFeature,
  addRejectedFeature,
  postCompletedSourceValidationTask
} from '../../actions'

import { getPopupContent } from '../../components/Popup/SourceValidation'
import Info from '../../components/Info/SourceValidation'
import UserMetrics from '../../components/UserMetrics'
import * as turf from '@turf/turf'
import HelpButton from '../../components/HelpButton'
import TaskLocation from '../../components/TaskLocation'
import application from '../../utils/application'
import L from 'leaflet'
import PanicButton from '../../components/PanicButton'
import ReportView from '../../components/ReportView'

const zoomLevel = {
  default: 18,
  min: 1
}

function useKeyPress(targetKey, cb){
  const keyboardLock = useSelector(state => state.ui.keyboardLock)
  function downHandler({ key }) {
    if(key === targetKey ) cb(key)
  }
  useEffect(() => {
    if(!keyboardLock) document.addEventListener('keydown', downHandler)
    return () => {
      document.removeEventListener('keydown', downHandler)
    }
  })
}

function usePopup(task, memoizedOnPopupClick, map){
  const [popup, setPopup] = useState(null)
  useEffect(() => {
    setPopup(L.popup({
      closeButton: false,
      closeOnClick: false,
      closeOnEscapeKey: false,
      offset: new L.Point(0, -30)
    })
      .setLatLng([0, 0])
      .openOn(map)
    )
  },[map])

  useEffect(() => {
    let P = getPopupContent({ onClick: memoizedOnPopupClick })
    if (popup) {
      popup.setContent(P.container)
      ReactDOM.render(P.content, document.getElementById(application.elements.leaflet.popup))
    }
  }, [popup, memoizedOnPopupClick])

  useEffect(() => {
    if(task.feature) popup.setLatLng(L.geoJSON(task.feature).getBounds().getNorthEast())
  }, [popup,task])
}

function useBufferedTask(task,map) {
  useEffect(() => {
    let lead = null
    if (task.feature) {
      let bufferedLead = turf.buffer(task.feature, process.env.REACT_APP_SOURCEVALIDATION_BUFFER_SIZE, { units: 'meters' })
      lead = L.geoJSON(bufferedLead, {
        style: {
          color: '#ff0000',
          fill: false
        }
      })
      lead.addTo(map).bringToFront()
      map.fitBounds(lead.getBounds(), { maxZoom: map.getMaxZoom() })

    }
    return () => {
      if (lead) lead.remove()
    }
  }, [task.id, map, task.feature])
}

function useExistingGeometry(existingGeometry,map) {
  useEffect(() => {
    let geometry = null
    if (existingGeometry.features) {
      geometry = L.geoJSON(Object.values(existingGeometry.features), {
        style: {
          color: '#BCDCF5',
          weight: 10
        }
      })
      geometry.addTo(map).bringToBack()
    }
    return () => {
      if (geometry) geometry.remove()
    }
  }, [existingGeometry, map])
}

export function SourceValidation(props) {
  const {
    map, 
    getSourceValidationTask, 
    task, 
    existingGeometry, 
    postCompletedSourceValidationTask, 
    addAcceptedFeature,
    addRejectedFeature
  } = props

  useEffect(() => {
    document.title = 'Tori Source Validator'
    getSourceValidationTask()
  }, [getSourceValidationTask])

  const memoizedOnPopupClick = useCallback((key, userComment) => {
    let featureLength = turf.length(turf.lineString(task.feature.geometry.coordinates), { units: 'kilometers' })
    let taskResponse = {
      id: task.id,
      branch: existingGeometry.properties.branch.branchId,
      version: existingGeometry.properties.version.journalVersion
    }
    if(key === 'y'){
      addAcceptedFeature(featureLength)
      taskResponse = {
        feedbackValue : 'ACCEPTED',
        ...taskResponse
      }
    }
    else if(key === 'n'){
      addRejectedFeature(featureLength)
      taskResponse = {
        feedbackValue : 'REJECTED',
        ...taskResponse
      }
    }
    else if(key === 'i'){
      addRejectedFeature(featureLength)
      taskResponse = {
        feedbackValue : 'IMPOSSIBLE',
        ...taskResponse,
        ...userComment
      }
    }
    postCompletedSourceValidationTask(taskResponse)
  }, [task, existingGeometry, addAcceptedFeature, addRejectedFeature, postCompletedSourceValidationTask])

  usePopup(task, memoizedOnPopupClick, map)
  useKeyPress('y', memoizedOnPopupClick)
  useKeyPress('n', memoizedOnPopupClick)

  const memoizedSubmitReport = useCallback((choice, message) => {
    const userComment = message ? { userComment: message } : { userComment: choice }
    memoizedOnPopupClick('i',userComment)
  }, [memoizedOnPopupClick])

  useBufferedTask(task, map)
  useExistingGeometry(existingGeometry,map)

  return (
    <div>
      <UserMetrics
        user={props.user}
        accepted={props.accepted}
        rejected={props.rejected}
        processed={props.processed}
        taskId={props.task.id}
      />
      <div className={'buttonContainer'}>
        <PanicButton />
        <TaskLocation />
        <HelpButton />
      </div>
      <Info />
      <ReportView
        onSubmit={memoizedSubmitReport}
      />
    </div>
  )
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
  loadingTask: state.ui.loadingTask,
  keyboardLock: state.ui.keyboardLock
})

export default connect(mapStateToProps, { getSourceValidationTask, addAcceptedFeature, addRejectedFeature, postCompletedSourceValidationTask })(ToriMap(SourceValidation, { zoomLevel }))
