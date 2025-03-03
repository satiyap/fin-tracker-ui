import React, { useState } from 'react';
import { Card, Table, Button, Badge, Dropdown, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus, 
  faEdit, 
  faTrash, 
  faEllipsisV, 
  faCalendarAlt, 
  faArrowUp, 
  faArrowDown, 
  faPlay, 
  faCheck, 
  faTimes 
} from '@fortawesome/free-solid-svg-icons';
import CurrencyDisplay from '../common/CurrencyDisplay';
import ScheduledTransactionForm from './ScheduledTransactionForm';
import ConfirmDialog from '../common/ConfirmDialog';
import { formatDate } from '../../utils/dateUtils';
import Loader from '../common/Loader';

const ScheduledTransactionList = ({ 
  scheduledTransactions, 
  loading, 
  onAdd, 
  onEdit, 
  onDelete,
  onExecute
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showExecuteModal, setShowExecuteModal] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState(null);
  
  const handleAddClick = () => {
    setShowAddModal(true);
  };
  
  const handleEditClick = (transaction) => {
    setCurrentTransaction(transaction);
    setShowEditModal(true);
  };
  
  const handleDeleteClick = (transaction) => {
    setCurrentTransaction(transaction);
    setShowDeleteModal(true);
  };
  
  const handleExecuteClick = (transaction) => {
    setCurrentTransaction(transaction);
    setShowExecuteModal(true);
  };
  
  const handleConfirmDelete = async () => {
    if (currentTransaction) {
      await onDelete(currentTransaction.id);
      setShowDeleteModal(false);
    }
  };
  
  const handleConfirmExecute = async () => {
    if (currentTransaction) {
      await onExecute(currentTransaction.id);
      setShowExecuteModal(false);
    }
  };
  
  const getTransactionIcon = (type) => {
    switch (type) {
      case 'EXPENSE':
        return <FontAwesomeIcon icon={faArrowUp} className="text-danger" />;
      case 'INCOME':
        return <FontAwesomeIcon icon={faArrowDown} className="text-success" />;
      default:
        return null;
    }
  };

  const getTransactionBadge = (type) => {
    let variant;
    switch (type) {
      case 'EXPENSE':
        variant = 'danger';
        break;
      case 'INCOME':
        variant = 'success';
        break;
      default:
        variant = 'secondary';
    }
    return <Badge bg={variant}>{type}</Badge>;
  };
  
  const getFrequencyBadge = (frequency) => {
    let variant;
    switch (frequency) {
      case 'DAILY':
        variant = 'info';
        break;
      case 'WEEKLY':
        variant = 'primary';
        break;
      case 'MONTHLY':
        variant = 'warning';
        break;
      case 'YEARLY':
        variant = 'dark';
        break;
      default:
        variant = 'secondary';
    }
    return <Badge bg={variant}>{frequency}</Badge>;
  };
  
  const getStatusBadge = (active) => {
    return active ? 
      <Badge bg="success">Active</Badge> : 
      <Badge bg="secondary">Inactive</Badge>;
  };
  
  return (
    <>
      <Card className="shadow-sm">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <Card.Title>Scheduled Transactions</Card.Title>
            <Button variant="primary" onClick={handleAddClick}>
              <FontAwesomeIcon icon={faPlus} className="me-1" /> Add Scheduled Transaction
            </Button>
          </div>
          
          {loading ? (
            <Loader />
          ) : scheduledTransactions.length > 0 ? (
            <div className="table-responsive">
              <Table hover>
                <thead>
                  <tr>
                    <th>Description</th>
                    <th>Next Due Date</th>
                    <th>Frequency</th>
                    <th>Account</th>
                    <th>Category</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th className="text-end">Amount</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {scheduledTransactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td>{transaction.description}</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <FontAwesomeIcon icon={faCalendarAlt} className="me-2 text-primary" />
                          {formatDate(transaction.nextDueDate)}
                        </div>
                      </td>
                      <td>{getFrequencyBadge(transaction.frequency)}</td>
                      <td>{transaction.account?.name || 'Unknown'}</td>
                      <td>{transaction.category?.name || 'Uncategorized'}</td>
                      <td>
                        <div className="d-flex align-items-center">
                          {getTransactionIcon(transaction.transactionType)}
                          <span className="ms-2">
                            {getTransactionBadge(transaction.transactionType)}
                          </span>
                        </div>
                      </td>
                      <td>{getStatusBadge(transaction.active)}</td>
                      <td className="text-end">
                        <CurrencyDisplay 
                          amount={transaction.amount} 
                          negative={transaction.transactionType === 'EXPENSE'} 
                        />
                      </td>
                      <td className="text-center">
                        <Dropdown>
                          <Dropdown.Toggle variant="light" size="sm" id={`dropdown-${transaction.id}`} className="btn-icon">
                            <FontAwesomeIcon icon={faEllipsisV} />
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <Dropdown.Item onClick={() => handleExecuteClick(transaction)}>
                              <FontAwesomeIcon icon={faPlay} className="me-2 text-success" /> Execute Now
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => handleEditClick(transaction)}>
                              <FontAwesomeIcon icon={faEdit} className="me-2" /> Edit
                            </Dropdown.Item>
                            <Dropdown.Item 
                              onClick={() => handleDeleteClick(transaction)}
                              className="text-danger"
                            >
                              <FontAwesomeIcon icon={faTrash} className="me-2" /> Delete
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          ) : (
            <div className="text-center p-5">
              <p className="text-muted">No scheduled transactions found</p>
              <Button variant="primary" onClick={handleAddClick}>
                <FontAwesomeIcon icon={faPlus} className="me-1" /> Add Your First Scheduled Transaction
              </Button>
            </div>
          )}
        </Card.Body>
      </Card>
      
      {/* Add Scheduled Transaction Modal */}
      <ScheduledTransactionForm
        show={showAddModal}
        handleClose={() => setShowAddModal(false)}
        onSubmit={onAdd}
        title="Add Scheduled Transaction"
      />
      
      {/* Edit Scheduled Transaction Modal */}
      {currentTransaction && (
        <ScheduledTransactionForm
          show={showEditModal}
          handleClose={() => setShowEditModal(false)}
          initialValues={currentTransaction}
          onSubmit={(values) => onEdit(currentTransaction.id, values)}
          title="Edit Scheduled Transaction"
        />
      )}
      
      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        show={showDeleteModal}
        handleClose={() => setShowDeleteModal(false)}
        handleConfirm={handleConfirmDelete}
        title="Delete Scheduled Transaction"
        message="Are you sure you want to delete this scheduled transaction? This action cannot be undone."
      />
      
      {/* Execute Confirmation Modal */}
      <ConfirmDialog
        show={showExecuteModal}
        handleClose={() => setShowExecuteModal(false)}
        handleConfirm={handleConfirmExecute}
        title="Execute Scheduled Transaction"
        message="Are you sure you want to execute this scheduled transaction now? This will create a transaction record and update the next due date."
        confirmText="Execute"
        confirmVariant="success"
      />
    </>
  );
};

export default ScheduledTransactionList;