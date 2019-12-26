import React from 'react'
import Modal from '../Modal'

const Info = () => {
    return (
        <Modal>
            <h1>Tori Shift Info</h1>
            <p>
                Check the position of the roads on the imagery compared to the <b className='red'>red</b> line.
            </p>
            <h2>Shift</h2>
            <p style={{ padding: '0 2em 0 2em' }}>
                Click the YES button or the &apos;<strong>y</strong>&apos; key on your keyboard if there is a road completely or partially parallel to the red line.
                <br />
                Click the NO button or the  &apos;<strong>n</strong>&apos; key on your keyboard if there is no road parallel to the red line.
            </p>
            <h2>Instructions</h2>
            <p>
                <a href={'https://storagetori.blob.core.windows.net/instructions/ToriShiftValidator.pdf'}> Click here for detailed insctructions</a>
            </p>
        </Modal>
    )
}

export default Info
