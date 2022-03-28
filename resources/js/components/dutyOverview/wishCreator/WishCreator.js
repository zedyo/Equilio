import React from 'react'
import { Button } from 'react-bootstrap'
import WishCreatorModal from './wishCreatorModal/WishCreatorModal'

function WishCreator() {
  const [modalShow, setModalShow] = React.useState(false)

  return (
    <>
      <Button variant="outline-success" onClick={() => setModalShow(true)}>
        Neuer Dienstwunsch
      </Button>

      <WishCreatorModal show={modalShow} onHide={() => setModalShow(false)} />
    </>
  )
}

export default WishCreator
