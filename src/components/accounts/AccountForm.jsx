import React, { useState, useEffect } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../hooks/useAuth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTimes, faSpinner } from '@fortawesome/free-solid-svg-icons';

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Account name is required'),
  accountType: Yup.string().required('Account type is required'),
  balance: Yup.number()
    .required('Balance is required')
    .typeError('Balance must be a number')
});

const AccountForm = ({ show, handleClose, initialValues, onSubmit, title }) => {
  const { currentUser } = useAuth();
  
  const defaultValues = {
    name: '',
    accountType: 'SAVINGS',
    balance: '',
    userId: currentUser?.id
  };
  
  const formValues = initialValues || defaultValues;

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{title || 'Add Account'}</Modal.Title>
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
          isSubmitting
        }) => (
          <Form onSubmit={handleSubmit}>
            <Modal.Body>
              <Form.Group className="mb-3">
                <Form.Label>Account Name</Form.Label>
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
              
              <Form.Group className="mb-3">
                <Form.Label>Account Type</Form.Label>
                <Form.Select
                  name="accountType"
                  value={values.accountType}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={touched.accountType && errors.accountType}
                >
                  <option value="SAVINGS">Savings</option>
                  <option value="CHECKING">Checking</option>
                  <option value="CREDIT">Credit Card</option>
                  <option value="INVESTMENT">Investment</option>
                  <option value="CASH">Cash</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.accountType}
                </Form.Control.Feedback>
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Balance</Form.Label>
                <Form.Control
                  type="number"
                  name="balance"
                  value={values.balance}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={touched.balance && errors.balance}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.balance}
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

export default AccountForm;