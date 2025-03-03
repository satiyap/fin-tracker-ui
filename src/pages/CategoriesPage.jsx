import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import CategoryList from '../components/categories/CategoryList';
import Sidebar from '../components/common/Sidebar';
import { useCategories } from '../hooks/useCategories';
import Alert from '../components/common/Alert';

const CategoriesPage = () => {
  const { 
    categories, 
    loading, 
    error, 
    addCategory, 
    editCategory, 
    removeCategory 
  } = useCategories();

  return (
    <Container fluid>
      <Row>
        <Col md={3} lg={2} className="d-none d-md-block">
          <Sidebar />
        </Col>
        <Col md={9} lg={10}>
          <h1 className="mb-4">Categories</h1>
          
          {error && (
            <Alert 
              variant="danger" 
              message={error} 
              dismissible={true}
            />
          )}
          
          <CategoryList
            categories={categories}
            loading={loading}
            onAdd={addCategory}
            onEdit={editCategory}
            onDelete={removeCategory}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default CategoriesPage;