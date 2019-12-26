import React from 'react'
import Modal from '../Modal'

const Info = () => {
    return (
        <Modal>
            <h1>Tori Deletion Info</h1>
            <p>
                A <b className='red'> red</b> buffer is displayed around a road on the image.
            </p>
            <h2>Deletion</h2>
            <p style={{ padding: '0 2em 0 2em' }}>
                Click the YES button or the &apos;<strong>y</strong>&apos; key on your keyboard if there is a road completely or partially inside the buffer for the entire length of the buffer.
                <br />
                Click the NO button or the  &apos;<strong>n</strong>&apos; key on your keyboard if all roads are completely outside the buffer.
            </p>
            <h2>Instructions</h2>
            <p>
                <a href={'https://storagetori.blob.core.windows.net/instructions/ToriDeletionValidator.pdf'}> Click here for detailed insctructions</a>
            </p>

        </Modal>
    )
}

export default Info
