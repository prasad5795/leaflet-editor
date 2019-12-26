import React from 'react'
import Modal from '../Modal'

const Info = () => {
  return (
    <Modal>
      <h1>Tori Editor Info</h1>
      <p>
        A possible road is indicated with an <b className='orange'>orange</b> oval.
        <br />
        Existing roads are displayed in <b className='blue'>full blue</b> lines.
      </p>
      <h2>Drawing a road</h2>
      <p style={{ padding: '0 2em 0 2em' }}>
        You can draw a road by clicking on the draw a line button, displayed with a line icon on the left of the screen, under the zoom buttons.
        <br />
        If no action is needed you can click the no action button, displayed with a cross icon on the left of the screen, under the draw a line button.
      </p>
      <h2>Instructions</h2>
      <p>
        <video controls width='450' height='350' src='https://storagetori.blob.core.windows.net/instructions/ToriEditor.mp4' type='video/mp4'>
          Your browser does not support the video tag.
        </video>
      </p>
    </Modal>
  )
}

export default Info
