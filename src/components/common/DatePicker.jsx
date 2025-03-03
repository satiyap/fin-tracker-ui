import React from 'react';
import ReactDatePicker from 'react-datepicker';
import { Form } from 'react-bootstrap';
import 'react-datepicker/dist/react-datepicker.css';

const DatePicker = ({ 
  selected, 
  onChange, 
  label, 
  error, 
  touched,
  placeholder = 'Select date',
  isClearable = false,
  showTimeSelect = false,
  dateFormat = 'dd/MM/yyyy',
  minDate = null,
  maxDate = null,
  ...props
}) => {
  return (
    <Form.Group className="mb-3">
      {label && <Form.Label>{label}</Form.Label>}
      <ReactDatePicker
        selected={selected}
        onChange={onChange}
        className={`form-control ${touched && error ? 'is-invalid' : ''}`}
        placeholderText={placeholder}
        isClearable={isClearable}
        showTimeSelect={showTimeSelect}
        dateFormat={dateFormat}
        minDate={minDate}
        maxDate={maxDate}
        {...props}
      />
      {touched && error && (
        <div className="invalid-feedback d-block">
          {error}
        </div>
      )}
    </Form.Group>
  );
};

export default DatePicker;