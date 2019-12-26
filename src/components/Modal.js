import React from 'react'
import PropTypes from 'prop-types'
import 'font-awesome/css/font-awesome.min.css'
import { connect } from 'react-redux'
import { toggleInfo } from '../actions'
import { Modal as MModal } from '@material-ui/core'
import Fade from '@material-ui/core/Fade'

export const Modal = (props) => {
  if (props.toggleInfoStatus === false) {
    return null
  }
  return (
    <MModal style={{display:'flex',alignItems:'center',justifyContent:'center'}} open={props.toggleInfoStatus} onClose={props.toggleInfo} closeAfterTransition>
      <Fade in={props.toggleInfoStatus}>
        <div className='modal-content'>
          {props.children}

          <div className='modal-footer'>
            <button onClick={() => props.toggleInfo()}>
            OK
            </button>
          </div>
        </div>
      </Fade>
    </MModal>
  )
}

Modal.propTypes = {
  children: PropTypes.node
}

const mapStateToProps = (state) => ({
  toggleInfoStatus: state.ui.toggleInfo
})

export default connect(mapStateToProps, { toggleInfo })(Modal)
