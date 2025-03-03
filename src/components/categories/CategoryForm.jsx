import React from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTimes, faSpinner } from '@fortawesome/free-solid-svg-icons';

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Category name is required'),
  type: Yup.string().required('Category type is required'),
  description: Yup.string()
});

const CategoryForm = ({ show, handleClose, initialValues, onSubmit, title, categories }) => {
  const defaultValues = {
    name: '',
    type: 'EXPENSE',
    description: '',
    parentId: ''
  };
  
  const formValues = initialValues || defaultValues;

  // Filter parent categories based on type
  const getParentCategories = (type) => {
    return categories ? categories.filter(category => 
      category.type === type && !category.parentId
    ) : [];
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{title || 'Add Category'}</Modal.Title>
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
              <Form.Group className="mb-3">
                <Form.Label>Category Name</Form.Label>
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
                <Form.Label>Category Type</Form.Label>
                <Form.Select
                  name="type"
                  value={values.type}
                  onChange={(e) => {
                    handleChange(e);
                    // Reset parent category when type changes
                    setFieldValue('parentId', '');
                  }}
                  onBlur={handleBlur}
                  isInvalid={touched.type && errors.type}
                >
                  <option value="EXPENSE">Expense</option>
                  <option value="INCOME">Income</option>
                  <option value="INVESTMENT">Investment</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.type}
                </Form.Control.Feedback>
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Parent Category (Optional)</Form.Label>
                <Form.Select
                  name="parentId"
                  value={values.parentId || ''}
                  onChange={handleChange}
                  onBlur={handleBlur}
                >
                  <option value="">None (Top Level Category)</option>
                  {getParentCategories(values.type).map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Description (Optional)</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="description"
                  value={values.description || ''}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
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

export default CategoryForm;