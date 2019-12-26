import React, { Component } from 'react';
import L from 'leaflet'
import { Map, Marker, Popup, TileLayer } from 'react-leaflet'
import application from '../utils/application'
import { connect } from 'react-redux'
import {
    addMapToStore
} from '../actions'
import { getPopupContent } from '../components/Popup/Validation'
import ReactDOM from 'react-dom'

export class SimpleMap extends Component {

    constructor(props) {
        super(props)
        console.log(props)
    }
    
    componentDidMount() {
        this.map = L.map(application.elements.map, {
            zoom: 16,
            maxZoom: 19,
            minZoom: 1,
            center: { lat: 18, lng: 72 },
            preferCanvas: true
        })
        // this.forceUpdate()
        this.props.addMapToStore(this.map)
        // this.renderPopup()

        this.sateliteLayer = L.tileLayer.wms(process.env.REACT_APP_IMAGERY_ENDPOINT, {
            layers: 'Aerial',
            id: 'Satelite-Layer',
            name: 'Satelite-Layer',
            attribution: 'mapsavvy.com',
            maxZoom: 19
        }).addTo(this.map)
        
        
        this.probeLayer = L.tileLayer.wms('http://fusion-prod-probe.tomtomgroup.com/trace-heatmap-wms/heatmapwms?', {
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
    // , duplicateButton: this.props.user.duplicateButtonAllowed
    renderPopup() {
        let popup = getPopupContent({ onClick: this.onPopupClick })
        this.popup = L.popup({
            closeButton: false,
            closeOnClick: false,
            closeOnEscapeKey: false,
            offset: new L.Point(0, -30)
        }).setContent(popup.container)
            .setLatLng([0, 0])
        console.log("map", this.map)
        this.popup.openOn(this.map)
        ReactDOM.render(popup.content, document.getElementById(application.elements.leaflet.popup))
    }
    componentDidUpdate() {

    }

    render() {
        return (
            <div id='map'></div>
        );
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
    keyboardLock: state.ui.keyboardLock
})

//   return connect(mapStateToProps, { getValidationTask, addAcceptedFeature, addRejectedFeature, postCompletedValidationTask })(PropertyProxy);
// }

// export default SimpleMap;

export default connect(mapStateToProps, { addMapToStore })(SimpleMap);
