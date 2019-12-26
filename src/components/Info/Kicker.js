import React from 'react'
import Modal from '../Modal'

const Info = () => {
  return (
    <Modal>
      <h1>Tori Kicker Info</h1>
      <p>
        A lead is indicated with a <b className='red'>red</b> line.
        <br />
        Existing roads are displayed in <b className='blue'>full blue</b> lines.
      </p>
      <h2>Drawing a lead</h2>
      <p style={{ padding: '0 2em 0 2em' }}>
        You can draw a lead by clicking on the draw a line button, displayed with a line icon on the left of the screen, under the zoom buttons.
        <br />
        If no action is needed or you are ready with drawing you can click the ready to submit button, displayed with a checkmark icon on the left of the screen, under the draw a line button.
      </p>
    </Modal>
  )
}

export default Info
