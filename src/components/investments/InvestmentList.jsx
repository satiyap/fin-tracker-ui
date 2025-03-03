import React, { useState } from 'react';
import { Card, Table, Button, Badge, Dropdown, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus, 
  faEdit, 
  faTrash, 
  faEllipsisV, 
  faChartLine, 
  faMoneyBillWave, 
  faBuilding, 
  faLandmark, 
  faFileInvoiceDollar, 
  faHome, 
  faQuestion, 
  faSync 
} from '@fortawesome/free-solid-svg-icons';
import CurrencyDisplay from '../common/CurrencyDisplay';
import InvestmentForm from './InvestmentForm';
import ConfirmDialog from '../common/ConfirmDialog';
import { formatDate } from '../../utils/dateUtils';
import Loader from '../common/Loader';
import InvestmentPerformance from './InvestmentPerformance';

const InvestmentList = ({ 
  investments, 
  loading, 
  onAdd, 
  onEdit, 
  onDelete,
  onUpdateValue
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUpdateValueModal, setShowUpdateValueModal] = useState(false);
  const [showPerformanceModal, setShowPerformanceModal] = useState(false);
  const [currentInvestment, setCurrentInvestment] = useState(null);
  
  const handleAddClick = () => {
    setShowAddModal(true);
  };
  
  const handleEditClick = (investment) => {
    setCurrentInvestment(investment);
    setShowEditModal(true);
  };
  
  const handleDeleteClick = (investment) => {
    setCurrentInvestment(investment);
    setShowDeleteModal(true);
  };
  
  const handleUpdateValueClick = (investment) => {
    setCurrentInvestment(investment);
    setShowUpdateValueModal(true);
  };
  
  const handleViewPerformanceClick = (investment) => {
    setCurrentInvestment(investment);
    setShowPerformanceModal(true);
  };
  
  const handleConfirmDelete = async () => {
    if (currentInvestment) {
      await onDelete(currentInvestment.id);
      setShowDeleteModal(false);
    }
  };
  
  const getInvestmentIcon = (type) => {
    switch (type) {
      case 'SIP':
      case 'MUTUAL_FUND':
        return <FontAwesomeIcon icon={faChartLine} className="text-primary" />;
      case 'STOCK':
        return <FontAwesomeIcon icon={faChartLine} className="text-success" />;
      case 'FIXED_DEPOSIT':
        return <FontAwesomeIcon icon={faMoneyBillWave} className="text-warning" />;
      case 'BOND':
        return <FontAwesomeIcon icon={faFileInvoiceDollar} className="text-info" />;
      case 'REAL_ESTATE':
        return <FontAwesomeIcon icon={faHome} className="text-danger" />;
      default:
        return <FontAwesomeIcon icon={faQuestion} className="text-secondary" />;
    }
  };

  const getInvestmentBadge = (type) => {
    let variant;
    switch (type) {
      case 'SIP':
      case 'MUTUAL_FUND':
        variant = 'primary';
        break;
      case 'STOCK':
        variant = 'success';
        break;
      case 'FIXED_DEPOSIT':
        variant = 'warning';
        break;
      case 'BOND':
        variant = 'info';
        break;
      case 'REAL_ESTATE':
        variant = 'danger';
        break;
      default:
        variant = 'secondary';
    }
    return <Badge bg={variant}>{type.replace('_', ' ')}</Badge>;
  };
  
  // Calculate return percentage
  const calculateReturnPercentage = (investment) => {
    if (!investment.currentValue || !investment.initialAmount) {
      return null;
    }
    
    const initialAmount = parseFloat(investment.initialAmount);
    const currentValue = parseFloat(investment.currentValue);
    
    if (initialAmount === 0) {
      return null;
    }
    
    const returnPercentage = ((currentValue - initialAmount) / initialAmount) * 100;
    return returnPercentage.toFixed(2);
  };
  
  // Get return badge with color based on performance
  const getReturnBadge = (returnPercentage) => {
    if (returnPercentage === null) {
      return <Badge bg="secondary">N/A</Badge>;
    }
    
    const value = parseFloat(returnPercentage);
    let variant;
    
    if (value > 15) {
      variant = 'success';
    } else if (value > 0) {
      variant = 'info';
    } else if (value === 0) {
      variant = 'secondary';
    } else {
      variant = 'danger';
    }
    
    return <Badge bg={variant}>{returnPercentage}%</Badge>;
  };
  
  return (
    <>
      <Card className="shadow-sm">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <Card.Title>Investments</Card.Title>
            <Button variant="primary" onClick={handleAddClick}>
              <FontAwesomeIcon icon={faPlus} className="me-1" /> Add Investment
            </Button>
          </div>
          
          {loading ? (
            <Loader />
          ) : investments.length > 0 ? (
            <div className="table-responsive">
              <Table hover>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Start Date</th>
                    <th className="text-end">Initial Amount</th>
                    <th className="text-end">Current Value</th>
                    <th className="text-center">Return</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {investments.map((investment) => {
                    const returnPercentage = calculateReturnPercentage(investment);
                    
                    return (
                      <tr key={investment.id}>
                        <td>
                          <div className="d-flex align-items-center">
                            {getInvestmentIcon(investment.investmentType)}
                            <span className="ms-2">{investment.name}</span>
                          </div>
                          {investment.ticker && (
                            <small className="text-muted d-block">{investment.ticker}</small>
                          )}
                        </td>
                        <td>{getInvestmentBadge(investment.investmentType)}</td>
                        <td>{formatDate(investment.startDate)}</td>
                        <td className="text-end">
                          <CurrencyDisplay amount={investment.initialAmount} />
                        </td>
                        <td className="text-end">
                          <CurrencyDisplay amount={investment.currentValue || investment.initialAmount} />
                        </td>
                        <td className="text-center">
                          {getReturnBadge(returnPercentage)}
                        </td>
                        <td className="text-center">
                          <Dropdown>
                            <Dropdown.Toggle variant="light" size="sm" id={`dropdown-${investment.id}`} className="btn-icon">
                              <FontAwesomeIcon icon={faEllipsisV} />
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                              <Dropdown.Item onClick={() => handleUpdateValueClick(investment)}>
                                <FontAwesomeIcon icon={faSync} className="me-2 text-primary" /> Update Value
                              </Dropdown.Item>
                              <Dropdown.Item onClick={() => handleViewPerformanceClick(investment)}>
                                <FontAwesomeIcon icon={faChartLine} className="me-2 text-success" /> View Performance
                              </Dropdown.Item>
                              <Dropdown.Item onClick={() => handleEditClick(investment)}>
                                <FontAwesomeIcon icon={faEdit} className="me-2" /> Edit
                              </Dropdown.Item>
                              <Dropdown.Item 
                                onClick={() => handleDeleteClick(investment)}
                                className="text-danger"
                              >
                                <FontAwesomeIcon icon={faTrash} className="me-2" /> Delete
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
          ) : (
            <div className="text-center p-5">
              <p className="text-muted">No investments found</p>
              <Button variant="primary" onClick={handleAddClick}>
                <FontAwesomeIcon icon={faPlus} className="me-1" /> Add Your First Investment
              </Button>
            </div>
          )}
        </Card.Body>
      </Card>
      
      {/* Add Investment Modal */}
      <InvestmentForm
        show={showAddModal}
        handleClose={() => setShowAddModal(false)}
        onSubmit={onAdd}
        title="Add Investment"
      />
      
      {/* Edit Investment Modal */}
      {currentInvestment && (
        <InvestmentForm
          show={showEditModal}
          handleClose={() => setShowEditModal(false)}
          initialValues={currentInvestment}
          onSubmit={(values) => onEdit(currentInvestment.id, values)}
          title="Edit Investment"
        />
      )}
      
      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        show={showDeleteModal}
        handleClose={() => setShowDeleteModal(false)}
        handleConfirm={handleConfirmDelete}
        title="Delete Investment"
        message="Are you sure you want to delete this investment? This action cannot be undone."
      />
      
      {/* Update Value Modal */}
      {currentInvestment && (
        <UpdateValueModal
          show={showUpdateValueModal}
          handleClose={() => setShowUpdateValueModal(false)}
          investment={currentInvestment}
          onUpdate={onUpdateValue}
        />
      )}
      
      {/* Performance Modal */}
      {currentInvestment && (
        <InvestmentPerformance
          show={showPerformanceModal}
          handleClose={() => setShowPerformanceModal(false)}
          investment={currentInvestment}
        />
      )}
    </>
  );
};

// Update Value Modal Component
const UpdateValueModal = ({ show, handleClose, investment, onUpdate }) => {
  const [value, setValue] = useState(investment?.currentValue || investment?.initialAmount || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await onUpdate(investment.id, value);
      handleClose();
    } catch (error) {
      console.error('Error updating value:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Update Investment Value</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <p>
            Update the current value for <strong>{investment?.name}</strong>
          </p>
          <Form.Group className="mb-3">
            <Form.Label>Current Value</Form.Label>
            <Form.Control
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              required
              min="0"
              step="0.01"
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
                <FontAwesomeIcon icon={faSpinner} spin className="me-1" /> Updating...
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faSync} className="me-1" /> Update
              </>
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default InvestmentList;