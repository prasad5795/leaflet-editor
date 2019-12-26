import React from 'react'
import Modal from '../Modal'

const Info = () => {
  return (
    <Modal>
      <h1>Tori Visual Check Info</h1>
      <p>
        The area of interest is shown as <b className='red'>full red</b> box.
        <br /> 
        Existing roads are displayed in <b className='yellow'>dotted yellow</b> lines.
      </p>
      <h2>Validation</h2>
      <p style={{ padding: '0 2em 0 2em' }}>
        Indicate if the area is fully captured by clicking the YES button or the &apos;<strong>y</strong>&apos; key on your keyboard.
        <br />
        Click the NO button or the  &apos;<strong>n</strong>&apos; key on your keyboard if you spot navigable road that are yet to be captured.
      </p>
    </Modal>
  )
}

export default Info
