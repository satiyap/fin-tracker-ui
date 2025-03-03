import React, { useState, useEffect } from 'react';
import { Alert as BootstrapAlert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faInfoCircle, 
  faExclamationTriangle, 
  faCheckCircle, 
  faTimesCircle 
} from '@fortawesome/free-solid-svg-icons';

const Alert = ({ 
  variant = 'info', 
  message, 
  dismissible = true, 
  timeout = 0,
  onClose
}) => {
  const [show, setShow] = useState(true);
  
  useEffect(() => {
    if (timeout > 0) {
      const timer = setTimeout(() => {
        setShow(false);
        if (onClose) onClose();
      }, timeout);
      
      return () => clearTimeout(timer);
    }
  }, [timeout, onClose]);
  
  if (!show) return null;
  
  const getIcon = () => {
    switch (variant) {
      case 'info':
        return faInfoCircle;
      case 'warning':
        return faExclamationTriangle;
      case 'success':
        return faCheckCircle;
      case 'danger':
        return faTimesCircle;
      default:
        return faInfoCircle;
    }
  };
  
  const handleClose = () => {
    setShow(false);
    if (onClose) onClose();
  };
  
  return (
    <BootstrapAlert 
      variant={variant} 
      dismissible={dismissible} 
      onClose={dismissible ? handleClose : undefined}
    >
      <div className="d-flex align-items-center">
        <FontAwesomeIcon icon={getIcon()} className="me-2" />
        <div>{message}</div>
      </div>
    </BootstrapAlert>
  );
};

export default Alert;