import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

const ConfirmDialog = ({ 
  show, 
  handleClose, 
  handleConfirm, 
  title, 
  message,
  confirmText = 'Delete',
  confirmVariant = 'danger'
}) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          <FontAwesomeIcon icon={faExclamationTriangle} className="me-2 text-warning" />
          {title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{message}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          <FontAwesomeIcon icon={faTimes} className="me-1" /> Cancel
        </Button>
        <Button variant={confirmVariant} onClick={handleConfirm}>
          <FontAwesomeIcon icon={faCheck} className="me-1" /> {confirmText}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmDialog;