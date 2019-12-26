import React from 'react'
import L from 'leaflet'
import application from '../utils/application'
import Notifications, { notify } from 'react-notify-toast'
import { connect } from 'react-redux'
import SwitchButtons from '../components/SwitchButtons'

export default function (View, props) {

  const zoomLevel = {
    default: 18,
    min: 1
  }
  // eslint-disable-next-line no-undef
  zoomLevel.max = process.env.REACT_APP_IMAGERY_LAYER.trim() === 'DG' ? 19 : 20

  class PropertyProxy extends React.Component {

    sateliteLayerState;
    wmsProbeLayer;
    screenHeight = window.screen.height;
    screenWidth = window.screen.width;
    constructor(props) {
      super(props)
      console.log(props)
    }

    componentDidMount() {
      this.map = L.map(application.elements.map, {
        zoom: zoomLevel.default,
        maxZoom: zoomLevel.max,
        minZoom: zoomLevel.min,
        center: { lat: 18, lng: 73 },
        preferCanvas: true,
        editable:true
      })

      this.forceUpdate()
    }

    componentDidUpdate() {
      if (!this.props.sateliteLayerState) {
        if (this.wmsSateliteLayer) {
          this.wmsSateliteLayer.remove()
          this.wmsSateliteLayer = undefined
        }
      } else {
        if (!this.wmsSateliteLayer) {
          this.wmsSateliteLayer = L.tileLayer.wms(process.env.REACT_APP_IMAGERY_ENDPOINT, {
            layers: 'Aerial',
            id: 'Satelite-Layer',
            name: 'Satelite-Layer',
            attribution: 'mapsavvy.com',
            maxZoom: zoomLevel.max
          }).addTo(this.map)
        }
      }
      if (!this.props.probeLayerState) {
        if (this.wmsProbeLayer) {
          this.wmsProbeLayer.remove()
          this.wmsProbeLayer = undefined
        }
      } else {
        if (!this.wmsProbeLayer) {
          L.tileLayer.wms('http://fusion-prod-probe.tomtomgroup.com/trace-heatmap-wms/heatmapwms?', {
            service: 'WMS',
            version: '1.1.1',
            request: 'GetMap',
            layers: 'heatmap',
            srs: L.CRS.EPSG900913,
            crs: L.CRS.EPSG900913,
            height: 256,
            width: 256,
            transparent: 'true',
            exceptions: 'application/vnd.ogc.se_inimage',
            format: 'image/png',
            uppercase: 'true'
          }).addTo(this.map)
        }
      }
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
    
    render() {
      return (
        <div>
          {this.props.loading ? <div className={application.elements.loadingIndicator} /> : null}
          {!this.props.loading && this.props.loadingTask ? <div> <div className={application.elements.disableAllInteraction} /> <div className={application.elements.loadingDataIndicator} /> </div> : null}
          <div id={application.elements.map} style={{ position: 'absolute', visibility: this.props.loading || this.props.taskError !== false ? 'hidden' : 'visible' }}>
            {this.map ? <View {...this.props} map={this.map} /> : null}
          </div>
          <div className={'switchContainer'}>
            <SwitchButtons layerSwitch={this.layerSwitch}></SwitchButtons>
          </div>
          <Notifications />
        </div>
      )
    }

    renderImagery() {
      // eslint-disable-next-line no-undef
      if (this.props.sateliteLayerState) {

        if (process.env.REACT_APP_IMAGERY_LAYER.trim() === 'DG') {
          // eslint-disable-next-line no-undef
          L.tileLayer(process.env.REACT_APP_IMAGERY_ENDPOINT, {
            attribution: 'DigitalGlobe',
            maxZoom: zoomLevel.max
          }).addTo(this.map)
        } else {
          // eslint-disable-next-line no-undef
          // this.wmsLayer = L.tileLayer.wms(process.env.REACT_APP_IMAGERY_ENDPOINT, {
          //   layers: 'Aerial',
          //   id:'Satelite-Layer',
          //   name:'Satelite-Layer',
          //   attribution: 'mapsavvy.com',
          //   maxZoom: zoomLevel.max
          // }).addTo(this.map)
        }
      }
    }
  }


  const mapStateToProps = state => ({
    sateliteLayerState: state.ui.sateliteLayerState,
    probeLayerState: state.ui.probeLayerState,
    existingGeometry: state.existingGeometry,
    taskError: state.ui.taskError,
    loading: state.ui.loading,
    loadingTask: state.ui.loadingTask,
  })

  return connect(mapStateToProps)(PropertyProxy);
}
