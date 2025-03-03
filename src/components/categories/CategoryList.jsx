import React, { useState } from 'react';
import { Card, Table, Button, Badge, Dropdown, Tabs, Tab } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus, 
  faEdit, 
  faTrash, 
  faEllipsisV, 
  faTag, 
  faArrowUp, 
  faArrowDown, 
  faChartLine 
} from '@fortawesome/free-solid-svg-icons';
import CategoryForm from './CategoryForm';
import ConfirmDialog from '../common/ConfirmDialog';
import Loader from '../common/Loader';

const CategoryList = ({ 
  categories, 
  loading, 
  onAdd, 
  onEdit, 
  onDelete 
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [activeTab, setActiveTab] = useState('EXPENSE');
  
  const handleAddClick = () => {
    setShowAddModal(true);
  };
  
  const handleEditClick = (category) => {
    setCurrentCategory(category);
    setShowEditModal(true);
  };
  
  const handleDeleteClick = (category) => {
    setCurrentCategory(category);
    setShowDeleteModal(true);
  };
  
  const handleConfirmDelete = async () => {
    if (currentCategory) {
      await onDelete(currentCategory.id);
      setShowDeleteModal(false);
    }
  };
  
  const getCategoryIcon = (type) => {
    switch (type) {
      case 'EXPENSE':
        return <FontAwesomeIcon icon={faArrowUp} className="text-danger" />;
      case 'INCOME':
        return <FontAwesomeIcon icon={faArrowDown} className="text-success" />;
      case 'INVESTMENT':
        return <FontAwesomeIcon icon={faChartLine} className="text-primary" />;
      default:
        return <FontAwesomeIcon icon={faTag} className="text-secondary" />;
    }
  };

  const getCategoryBadge = (type) => {
    let variant;
    switch (type) {
      case 'EXPENSE':
        variant = 'danger';
        break;
      case 'INCOME':
        variant = 'success';
        break;
      case 'INVESTMENT':
        variant = 'primary';
        break;
      default:
        variant = 'secondary';
    }
    return <Badge bg={variant}>{type}</Badge>;
  };
  
  // Filter categories by type and organize by parent/child
  const organizeCategories = (type) => {
    const typeCategories = categories.filter(cat => cat.type === type);
    
    // Get parent categories (those without a parentId)
    const parentCategories = typeCategories.filter(cat => !cat.parentId);
    
    // Create a map of parent categories with their children
    return parentCategories.map(parent => {
      const children = typeCategories.filter(cat => cat.parentId === parent.id);
      return {
        ...parent,
        children
      };
    });
  };
  
  const filteredCategories = organizeCategories(activeTab);
  
  return (
    <>
      <Card className="shadow-sm">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <Card.Title>Categories</Card.Title>
            <Button variant="primary" onClick={handleAddClick}>
              <FontAwesomeIcon icon={faPlus} className="me-1" /> Add Category
            </Button>
          </div>
          
          <Tabs
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k)}
            className="mb-3"
          >
            <Tab eventKey="EXPENSE" title="Expenses">
              {renderCategoriesTable('EXPENSE')}
            </Tab>
            <Tab eventKey="INCOME" title="Income">
              {renderCategoriesTable('INCOME')}
            </Tab>
            <Tab eventKey="INVESTMENT" title="Investments">
              {renderCategoriesTable('INVESTMENT')}
            </Tab>
          </Tabs>
        </Card.Body>
      </Card>
      
      {/* Add Category Modal */}
      <CategoryForm
        show={showAddModal}
        handleClose={() => setShowAddModal(false)}
        onSubmit={onAdd}
        title="Add Category"
        categories={categories}
      />
      
      {/* Edit Category Modal */}
      {currentCategory && (
        <CategoryForm
          show={showEditModal}
          handleClose={() => setShowEditModal(false)}
          initialValues={currentCategory}
          onSubmit={(values) => onEdit(currentCategory.id, values)}
          title="Edit Category"
          categories={categories}
        />
      )}
      
      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        show={showDeleteModal}
        handleClose={() => setShowDeleteModal(false)}
        handleConfirm={handleConfirmDelete}
        title="Delete Category"
        message="Are you sure you want to delete this category? This may affect transactions that use this category. This action cannot be undone."
      />
    </>
  );
  
  function renderCategoriesTable(type) {
    if (loading) {
      return <Loader />;
    }
    
    const typeCategories = organizeCategories(type);
    
    if (typeCategories.length === 0) {
      return (
        <div className="text-center p-5">
          <p className="text-muted">No {type.toLowerCase()} categories found</p>
          <Button variant="primary" onClick={handleAddClick}>
            <FontAwesomeIcon icon={faPlus} className="me-1" /> Add Your First {type} Category
          </Button>
        </div>
      );
    }
    
    return (
      <div className="table-responsive">
        <Table hover>
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {typeCategories.map((category) => (
              <React.Fragment key={category.id}>
                <tr>
                  <td>
                    <div className="d-flex align-items-center">
                      {getCategoryIcon(category.type)}
                      <span className="ms-2 fw-bold">{category.name}</span>
                    </div>
                  </td>
                  <td>{category.description || '-'}</td>
                  <td className="text-center">
                    <Dropdown>
                      <Dropdown.Toggle variant="light" size="sm" id={`dropdown-${category.id}`} className="btn-icon">
                        <FontAwesomeIcon icon={faEllipsisV} />
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item onClick={() => handleEditClick(category)}>
                          <FontAwesomeIcon icon={faEdit} className="me-2" /> Edit
                        </Dropdown.Item>
                        <Dropdown.Item 
                          onClick={() => handleDeleteClick(category)}
                          className="text-danger"
                        >
                          <FontAwesomeIcon icon={faTrash} className="me-2" /> Delete
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </td>
                </tr>
                {/* Render subcategories */}
                {category.children && category.children.map(child => (
                  <tr key={child.id} className="table-light">
                    <td>
                      <div className="d-flex align-items-center ps-4">
                        <FontAwesomeIcon icon={faTag} className="text-secondary" />
                        <span className="ms-2">{child.name}</span>
                      </div>
                    </td>
                    <td>{child.description || '-'}</td>
                    <td className="text-center">
                      <Dropdown>
                        <Dropdown.Toggle variant="light" size="sm" id={`dropdown-${child.id}`} className="btn-icon">
                          <FontAwesomeIcon icon={faEllipsisV} />
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item onClick={() => handleEditClick(child)}>
                            <FontAwesomeIcon icon={faEdit} className="me-2" /> Edit
                          </Dropdown.Item>
                          <Dropdown.Item 
                            onClick={() => handleDeleteClick(child)}
                            className="text-danger"
                          >
                            <FontAwesomeIcon icon={faTrash} className="me-2" /> Delete
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </Table>
      </div>
    );
  }
};

export default CategoryList;