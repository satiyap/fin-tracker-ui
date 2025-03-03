import React, { useState } from 'react';
import { Card, Table, Button, Badge, Dropdown, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus, 
  faEdit, 
  faTrash, 
  faEllipsisV, 
  faArrowUp, 
  faArrowDown, 
  faExchangeAlt 
} from '@fortawesome/free-solid-svg-icons';
import CurrencyDisplay from '../common/CurrencyDisplay';
import TransactionForm from './TransactionForm';
import ConfirmDialog from '../common/ConfirmDialog';
import TransactionFilter from './TransactionFilter';
import { formatDate } from '../../utils/dateUtils';
import Loader from '../common/Loader';

const TransactionList = ({ 
  transactions, 
  loading, 
  onAdd, 
  onEdit, 
  onDelete,
  onFilter
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  
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
  
  const handleConfirmDelete = async () => {
    if (currentTransaction) {
      await onDelete(currentTransaction.id);
      setShowDeleteModal(false);
    }
  };
  
  const getTransactionIcon = (type) => {
    switch (type) {
      case 'EXPENSE':
        return <FontAwesomeIcon icon={faArrowUp} className="text-danger" />;
      case 'INCOME':
        return <FontAwesomeIcon icon={faArrowDown} className="text-success" />;
      case 'TRANSFER':
        return <FontAwesomeIcon icon={faExchangeAlt} className="text-primary" />;
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
      case 'TRANSFER':
        variant = 'primary';
        break;
      default:
        variant = 'secondary';
    }
    return <Badge bg={variant}>{type}</Badge>;
  };
  
  return (
    <>
      <Card className="shadow-sm">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <Card.Title>Transactions</Card.Title>
            <div>
              <Button 
                variant="outline-secondary" 
                className="me-2"
                onClick={() => setShowFilters(!showFilters)}
              >
                Filters
              </Button>
              <Button variant="primary" onClick={handleAddClick}>
                <FontAwesomeIcon icon={faPlus} className="me-1" /> Add Transaction
              </Button>
            </div>
          </div>
          
          {showFilters && (
            <TransactionFilter onFilter={onFilter} />
          )}
          
          {loading ? (
            <Loader />
          ) : transactions.length > 0 ? (
            <div className="table-responsive">
              <Table hover>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Description</th>
                    <th>Category</th>
                    <th>Account</th>
                    <th>Type</th>
                    <th className="text-end">Amount</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td>{formatDate(transaction.transactionDate)}</td>
                      <td>{transaction.description}</td>
                      <td>{transaction.category?.name || 'Uncategorized'}</td>
                      <td>{transaction.account?.name || 'Unknown'}</td>
                      <td>
                        <div className="d-flex align-items-center">
                          {getTransactionIcon(transaction.transactionType)}
                          <span className="ms-2">
                            {getTransactionBadge(transaction.transactionType)}
                          </span>
                        </div>
                      </td>
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
              <p className="text-muted">No transactions found</p>
              <Button variant="primary" onClick={handleAddClick}>
                <FontAwesomeIcon icon={faPlus} className="me-1" /> Add Your First Transaction
              </Button>
            </div>
          )}
        </Card.Body>
      </Card>
      
      {/* Add Transaction Modal */}
      <TransactionForm
        show={showAddModal}
        handleClose={() => setShowAddModal(false)}
        onSubmit={onAdd}
        title="Add Transaction"
      />
      
      {/* Edit Transaction Modal */}
      {currentTransaction && (
        <TransactionForm
          show={showEditModal}
          handleClose={() => setShowEditModal(false)}
          initialValues={currentTransaction}
          onSubmit={(values) => onEdit(currentTransaction.id, values)}
          title="Edit Transaction"
        />
      )}
      
      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        show={showDeleteModal}
        handleClose={() => setShowDeleteModal(false)}
        handleConfirm={handleConfirmDelete}
        title="Delete Transaction"
        message="Are you sure you want to delete this transaction? This action cannot be undone."
      />
    </>
  );
};

export default TransactionList;