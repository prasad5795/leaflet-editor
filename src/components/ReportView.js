import React from 'react'
import Modal from '@material-ui/core/Modal'
import { makeStyles } from '@material-ui/core/styles'
import { connect } from 'react-redux'
import Backdrop from '@material-ui/core/Backdrop'
import Fade from '@material-ui/core/Fade'
import { toggleReport } from '../actions'
import ToriReport from './Report'

const useStyles = makeStyles(theme => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}))

export function ReportView(props) {
  const classes = useStyles()
    
  function onReportSubmit(choice, message) {
    props.onSubmit(choice, message)
    props.toggleReport()
  }
    
  return (
    <Modal
      className={classes.modal}
      open={props.toggleReportStatus}
      onClose={props.toggleReport}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={props.toggleReportStatus}>
        <ToriReport displayOtherOption={props.displayOtherOption} onSubmit={onReportSubmit}/>

      </Fade>
    </Modal>
  )
}

const mapStateToProps = (state) => ({
  toggleReportStatus: state.ui.toggleReport
})


export default connect(mapStateToProps, {toggleReport})(ReportView)