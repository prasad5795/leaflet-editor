import React from 'react'

const UserMetrics = (props) => {
  return (
    <div className={'userMetrics leafletContainer'}>
      <span aria-label='user'><strong>{(props.user ? props.user.id : '<>')}</strong></span> <br />
      <span aria-label='accepted roads'>Accepted: {props.accepted.toFixed(2)} km</span> <br />
      <span aria-label='rejected roads'>Rejected: {props.rejected.toFixed(2)} km</span> <br />
      <span aria-label='total'>Total: {(props.rejected + props.accepted).toFixed(2)} km</span> <br />
      <span aria-label='amount of tasks'>Roads processed: {props.processed}</span> <br />
      <span aria-label='ID of the lead' onClick={() => { navigator.clipboard.writeText(props.taskId) }}>ID: <span className='copyText'>{props.taskId}</span></span> <br />
      {
        props.correlationIdAllowed === true && props.correlationId
          ?
        <span aria-label='Correlation ID of the lead' onClick={() => { navigator.clipboard.writeText(props.correlationId) }}>CID: <span className='copyText'>{props.correlationId}</span></span>
        : null
      }
    </div>
  )
}

export default UserMetrics
