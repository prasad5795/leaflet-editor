import React from 'react'
import Modal from '../Modal'

const Info = () => {
  return (
    <Modal>
      <h1>Tori Validator Info</h1>
      <p>
        A possible road is displayed as a <b className='red'>dotted red</b> line.
        <br />
        Existing roads are displayed in <b className='blue'>full blue</b> lines.
      </p>
      <h2>Validation</h2>
      <p style={{ padding: '0 2em 0 2em' }}>
        Indicate if a road is correctly shown by clicking the YES button or the &apos;<strong>y</strong>&apos; key on your keyboard.
        <br />
        Click the NO button or the  &apos;<strong>n</strong>&apos; key on your keyboard if the road needs some work/re-alignment or if it is not suitable to be entered.
      </p>
      <h2>Instructions</h2>
      <p>
        <video width='450' height='350' controls src='https://storagetori.blob.core.windows.net/instructions/ToriValidator.mp4' type='video/mp4'>
          Your browser does not support the video tag.
        </video>
      </p>
    </Modal>
  )
}

export default Info
