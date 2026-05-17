import React from 'react'
import { Button } from 'react-bootstrap'
import WishCreatorModal from './wishCreatorModal/WishCreatorModal'
import { AiOutlinePlus } from 'react-icons/ai'

function WishCreator({
  employeeId,
  employeeName,
  defaultDate,
  onSaved,
  size = 'sm',
  variant = 'outline-primary',
  label = 'Wunsch',
  iconOnly = false,
}) {
  const [modalShow, setModalShow] = React.useState(false)

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={() => setModalShow(true)}
        title="Dienstwunsch anlegen"
        aria-label={`Dienstwunsch anlegen${
          employeeName ? ` für ${employeeName}` : ''
        }`}
      >
        <AiOutlinePlus />
        {!iconOnly && <span className="ms-1">{label}</span>}
      </Button>

      <WishCreatorModal
        employeeId={employeeId}
        employeeName={employeeName}
        defaultDate={defaultDate}
        onSaved={onSaved}
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
    </>
  )
}

export default WishCreator
