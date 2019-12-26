import React from 'react'
import Modal from '../Modal'

const Info = () => {
  return (
    <Modal>
      <h1>Tori Realignment Info</h1>
      <p>
        A <b className='red'> red</b> buffer is displayed around a road on the image. 
      </p>
      <h2>Realignment</h2>
      <p style={{ padding: '0 2em 0 2em' }}>
        Click the YES button or the &apos;<strong>y</strong>&apos; key on your keyboard if the road is completely or partially inside the buffer for the entire length of the buffer.
        <br />
        Click the NO button or the  &apos;<strong>n</strong>&apos; key on your keyboard if the road is completely outside the buffer.
      </p>
      <h2>Instructions</h2>
      <p>
        <a href={'https://storagetori.blob.core.windows.net/instructions/ToriRealignmentValidator.pdf'}> Click here for detailed insctructions</a>
      </p>    
    </Modal>
  )
}

export default Info
