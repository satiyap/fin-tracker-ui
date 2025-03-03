import React, { useState } from 'react';
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useAuth } from '../../hooks/useAuth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTimes, faSpinner } from '@fortawesome/free-solid-svg-icons';

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Investment name is required'),
  investmentType: Yup.string().required('Investment type is required'),
  initialAmount: Yup.number()
    .required('Initial amount is required')
    .positive('Initial amount must be positive'),
  currentValue: Yup.number()
    .nullable()
    .positive('Current value must be positive'),
  startDate: Yup.date().required('Start date is required'),
  endDate: Yup.date().nullable(),
  expectedReturnRate: Yup.number()
    .nullable()
    .min(0, 'Expected return rate must be positive'),
  ticker: Yup.string(),
  notes: Yup.string()
});

const InvestmentForm = ({ show, handleClose, initialValues, onSubmit, title }) => {
  const { currentUser } = useAuth();
  
  const defaultValues = {
    name: '',
    investmentType: 'SIP',
    initialAmount: '',
    currentValue: '',
    startDate: new Date(),
    endDate: null,
    expectedReturnRate: '',
    userId: currentUser?.id,
    ticker: '',
    notes: ''
  };
  
  const formValues = initialValues || defaultValues;

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{title || 'Add Investment'}</Modal.Title>
      </Modal.Header>
      
      <Formik
        initialValues={formValues}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            await onSubmit(values);
            handleClose();
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
          setFieldValue
        }) => (
          <Form onSubmit={handleSubmit}>
            <Modal.Body>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Investment Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={values.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.name && errors.name}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.name}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Investment Type</Form.Label>
                    <Form.Select
                      name="investmentType"
                      value={values.investmentType}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.investmentType && errors.investmentType}
                    >
                      <option value="SIP">SIP</option>
                      <option value="MUTUAL_FUND">Mutual Fund</option>
                      <option value="STOCK">Stock</option>
                      <option value="FIXED_DEPOSIT">Fixed Deposit</option>
                      <option value="BOND">Bond</option>
                      <option value="REAL_ESTATE">Real Estate</option>
                      <option value="OTHER">Other</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {errors.investmentType}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
              
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Initial Amount</Form.Label>
                    <Form.Control
                      type="number"
                      name="initialAmount"
                      value={values.initialAmount}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.initialAmount && errors.initialAmount}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.initialAmount}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Current Value (Optional)</Form.Label>
                    <Form.Control
                      type="number"
                      name="currentValue"
                      value={values.currentValue || ''}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.currentValue && errors.currentValue}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.currentValue}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
              
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Start Date</Form.Label>
                    <DatePicker
                      selected={values.startDate ? new Date(values.startDate) : null}
                      onChange={(date) => setFieldValue('startDate', date)}
                      className={`form-control ${touched.startDate && errors.startDate ? 'is-invalid' : ''}`}
                      dateFormat="dd/MM/yyyy"
                    />
                    {touched.startDate && errors.startDate && (
                      <div className="invalid-feedback d-block">
                        {errors.startDate}
                      </div>
                    )}
                  </Form.Group>
                </Col>
                
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>End Date (Optional)</Form.Label>
                    <DatePicker
                      selected={values.endDate ? new Date(values.endDate) : null}
                      onChange={(date) => setFieldValue('endDate', date)}
                      className={`form-control ${touched.endDate && errors.endDate ? 'is-invalid' : ''}`}
                      dateFormat="dd/MM/yyyy"
                      isClearable
                      placeholderText="No end date"
                      minDate={values.startDate ? new Date(values.startDate) : null}
                    />
                    {touched.endDate && errors.endDate && (
                      <div className="invalid-feedback d-block">
                        {errors.endDate}
                      </div>
                    )}
                  </Form.Group>
                </Col>
              </Row>
              
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Expected Return Rate % (Optional)</Form.Label>
                    <Form.Control
                      type="number"
                      name="expectedReturnRate"
                      value={values.expectedReturnRate || ''}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.expectedReturnRate && errors.expectedReturnRate}
                      placeholder="e.g., 12.5"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.expectedReturnRate}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Ticker Symbol (Optional)</Form.Label>
                    <Form.Control
                      type="text"
                      name="ticker"
                      value={values.ticker || ''}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.ticker && errors.ticker}
                      placeholder="e.g., HDFC, RELIANCE"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.ticker}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
              
              <Form.Group className="mb-3">
                <Form.Label>Notes (Optional)</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="notes"
                  value={values.notes || ''}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={touched.notes && errors.notes}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.notes}
                </Form.Control.Feedback>
              </Form.Group>
            </Modal.Body>
            
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                <FontAwesomeIcon icon={faTimes} className="me-1" /> Cancel
              </Button>
              <Button variant="primary" type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} spin className="me-1" /> Saving...
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faSave} className="me-1" /> Save
                  </>
                )}
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default InvestmentForm;