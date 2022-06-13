import React from 'react'
import { Button } from 'react-bootstrap'
import WishCreatorModal from './wishCreatorModal/WishCreatorModal'

function WishCreator(props) {
  const [modalShow, setModalShow] = React.useState(false)

  return (
    <>
      <Button
        variant="outline-info"
        size="sm"
        onClick={() => setModalShow(true)}
      >
        Wunsch
      </Button>

      <WishCreatorModal
        employeeId={props.employeeId}
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
    </>
  )
}

export default WishCreator
