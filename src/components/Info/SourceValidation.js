import React from 'react'
import Modal from '../Modal'

const Info = () => {
  return (
    <Modal>
      <h1>Tori Source Validator Info</h1>
      <p>
        A <b className='red'> red</b> buffer is displayed around a road on the image. 
        <br />
        Existing roads are displayed in <b className='blue'>full blue</b> lines.
      </p>
      <h2>Source Validation</h2>
      <p style={{ padding: '0 2em 0 2em' }}>
        Click the YES button or the &apos;<strong>y</strong>&apos; key on your keyboard if the road is completely or partially inside the buffer for the entire length of the buffer.
        <br />
        Click the NO button or the  &apos;<strong>n</strong>&apos; key on your keyboard if the road is completely outside the buffer.
      </p>
    </Modal>
  )
}

export default Info
