import React from 'react';
import { connect } from 'react-redux'
import { toggleSateliteLayer, toggleProbeLayer } from '../actions'

const SwitchButtons = (props) => {
    return (
        <div>
            <div>
                <div className="toggle-button-label">Probe</div>
                <div className="toggle-button-slider"
                onClick={
                    () => {
                        //props.layerSwitch({ sateliteLayerState: props.sateliteLayerState, probeLayerState: props.probeLayerState })
                        props.toggleSateliteLayer()
                    }
                }>
                    <button
                        className={props.sateliteLayerState ? "toggle-button-clicked" : "toggle-button"}
                        
                    />
                </div>
                <div className="toggle-button-label">Satelite</div>
            </div>
        </div>
    );
};

const mapStateToProps = (state) => ({
    sateliteLayerState: state.ui.sateliteLayerState,
    probeLayerState: state.ui.probeLayerState,
})

export default connect(mapStateToProps, { toggleSateliteLayer, toggleProbeLayer })(SwitchButtons)