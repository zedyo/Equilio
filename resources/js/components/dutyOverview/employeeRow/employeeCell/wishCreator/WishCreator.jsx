import React from 'react'
import { Button } from 'react-bootstrap'
import WishCreatorModal from './wishCreatorModal/WishCreatorModal'
import { AiOutlinePlus } from 'react-icons/ai'

function WishCreator(props) {
  const [modalShow, setModalShow] = React.useState(false)

  return (
    <>
      <Button
        variant="outline-success"
        size="sm"
        onClick={() => setModalShow(true)}
      >
        <AiOutlinePlus /> Wunsch
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
