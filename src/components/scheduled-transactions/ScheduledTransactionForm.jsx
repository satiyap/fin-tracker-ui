import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useAuth } from '../../hooks/useAuth';
import { getAllAccounts } from '../../api/accountApi';
import { getAllCategories } from '../../api/categoryApi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTimes, faSpinner } from '@fortawesome/free-solid-svg-icons';

const validationSchema = Yup.object().shape({
  description: Yup.string().required('Description is required'),
  amount: Yup.number()
    .required('Amount is required')
    .positive('Amount must be positive'),
  frequency: Yup.string().required('Frequency is required'),
  nextDueDate: Yup.date().required('Next due date is required'),
  transactionType: Yup.string().required('Transaction type is required'),
  accountId: Yup.number().required('Account is required'),
  categoryId: Yup.number().required('Category is required'),
  notes: Yup.string(),
  active: Yup.boolean()
});

const ScheduledTransactionForm = ({ show, handleClose, initialValues, onSubmit, title }) => {
  const { currentUser } = useAuth();
  const [accounts, setAccounts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchFormData = async () => {
      try {
        setLoading(true);
        const [accountsData, categoriesData] = await Promise.all([
          getAllAccounts(),
          getAllCategories()
        ]);
        
        setAccounts(accountsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching form data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFormData();
  }, []);
  
  const defaultValues = {
    description: '',
    amount: '',
    frequency: 'MONTHLY',
    nextDueDate: new Date(),
    transactionType: 'EXPENSE',
    accountId: '',
    categoryId: '',
    createdById: currentUser?.id,
    notes: '',
    active: true
  };
  
  const formValues = initialValues || defaultValues;
  
  // Filter categories based on transaction type
  const getFilteredCategories = (type) => {
    return categories.filter(category => 
      (type === 'EXPENSE' && category.type === 'EXPENSE') || 
      (type === 'INCOME' && category.type === 'INCOME')
    );
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{title || 'Add Scheduled Transaction'}</Modal.Title>
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
              {loading ? (
                <div className="text-center p-4">
                  <FontAwesomeIcon icon={faSpinner} spin size="2x" />
                  <p className="mt-2">Loading form data...</p>
                </div>
              ) : (
                <>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                          type="text"
                          name="description"
                          value={values.description}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={touched.description && errors.description}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.description}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Amount</Form.Label>
                        <Form.Control
                          type="number"
                          name="amount"
                          value={values.amount}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={touched.amount && errors.amount}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.amount}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Next Due Date</Form.Label>
                        <DatePicker
                          selected={values.nextDueDate ? new Date(values.nextDueDate) : null}
                          onChange={(date) => setFieldValue('nextDueDate', date)}
                          className={`form-control ${touched.nextDueDate && errors.nextDueDate ? 'is-invalid' : ''}`}
                          dateFormat="dd/MM/yyyy"
                        />
                        {touched.nextDueDate && errors.nextDueDate && (
                          <div className="invalid-feedback d-block">
                            {errors.nextDueDate}
                          </div>
                        )}
                      </Form.Group>
                    </Col>
                    
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Frequency</Form.Label>
                        <Form.Select
                          name="frequency"
                          value={values.frequency}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={touched.frequency && errors.frequency}
                        >
                          <option value="DAILY">Daily</option>
                          <option value="WEEKLY">Weekly</option>
                          <option value="MONTHLY">Monthly</option>
                          <option value="YEARLY">Yearly</option>
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          {errors.frequency}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Transaction Type</Form.Label>
                        <Form.Select
                          name="transactionType"
                          value={values.transactionType}
                          onChange={(e) => {
                            handleChange(e);
                            // Reset category when transaction type changes
                            setFieldValue('categoryId', '');
                          }}
                          onBlur={handleBlur}
                          isInvalid={touched.transactionType && errors.transactionType}
                        >
                          <option value="EXPENSE">Expense</option>
                          <option value="INCOME">Income</option>
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          {errors.transactionType}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Status</Form.Label>
                        <Form.Select
                          name="active"
                          value={values.active.toString()}
                          onChange={(e) => setFieldValue('active', e.target.value === 'true')}
                          onBlur={handleBlur}
                        >
                          <option value="true">Active</option>
                          <option value="false">Inactive</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Account</Form.Label>
                        <Form.Select
                          name="accountId"
                          value={values.accountId}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={touched.accountId && errors.accountId}
                        >
                          <option value="">Select Account</option>
                          {accounts.map(account => (
                            <option key={account.id} value={account.id}>
                              {account.name}
                            </option>
                          ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          {errors.accountId}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Category</Form.Label>
                        <Form.Select
                          name="categoryId"
                          value={values.categoryId}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={touched.categoryId && errors.categoryId}
                        >
                          <option value="">Select Category</option>
                          {getFilteredCategories(values.transactionType).map(category => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          {errors.categoryId}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Notes</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="notes"
                      value={values.notes}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.notes && errors.notes}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.notes}
                    </Form.Control.Feedback>
                  </Form.Group>
                </>
              )}
            </Modal.Body>
            
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                <FontAwesomeIcon icon={faTimes} className="me-1" /> Cancel
              </Button>
              <Button variant="primary" type="submit" disabled={isSubmitting || loading}>
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

export default ScheduledTransactionForm;