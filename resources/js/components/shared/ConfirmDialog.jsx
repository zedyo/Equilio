import React from 'react'
import { Button, Modal } from 'react-bootstrap'

/**
 * Bestätigungsdialog für destruktive Aktionen (Löschen). Verhindert
 * das bisherige sofortige, rückfragelose Löschen.
 */
function ConfirmDialog({
  show,
  title = 'Wirklich löschen?',
  body,
  confirmLabel = 'Löschen',
  cancelLabel = 'Abbrechen',
  variant = 'danger',
  onConfirm,
  onCancel,
}) {
  return (
    <Modal show={show} onHide={onCancel} centered>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {body || 'Diese Aktion kann nicht rückgängig gemacht werden.'}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={onCancel}>
          {cancelLabel}
        </Button>
        <Button variant={variant} onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default ConfirmDialog
