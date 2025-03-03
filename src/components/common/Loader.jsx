import React from 'react';
import { Spinner } from 'react-bootstrap';

const Loader = ({ size = 'md', message = 'Loading...' }) => {
  return (
    <div className="text-center p-4 loader-container">
      <Spinner animation="border" role="status" variant="primary" className="mb-2">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
      <p className="text-muted">{message}</p>
    </div>
  );
};

export default Loader;