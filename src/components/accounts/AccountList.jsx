import React, { useState } from 'react';
import { Card, Table, Button, Badge, Dropdown } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus, 
  faEdit, 
  faTrash, 
  faEllipsisV, 
  faWallet, 
  faCreditCard, 
  faMoneyBillWave, 
  faChartLine 
} from '@fortawesome/free-solid-svg-icons';
import CurrencyDisplay from '../common/CurrencyDisplay';
import AccountForm from './AccountForm';
import ConfirmDialog from '../common/ConfirmDialog';
import { Link } from 'react-router-dom';
import Loader from '../common/Loader';

const AccountList = ({ 
  accounts, 
  loading, 
  onAdd, 
  onEdit, 
  onDelete 
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentAccount, setCurrentAccount] = useState(null);
  
  const handleAddClick = () => {
    setShowAddModal(true);
  };
  
  const handleEditClick = (account) => {
    setCurrentAccount(account);
    setShowEditModal(true);
  };
  
  const handleDeleteClick = (account) => {
    setCurrentAccount(account);
    setShowDeleteModal(true);
  };
  
  const handleConfirmDelete = async () => {
    if (currentAccount) {
      await onDelete(currentAccount.id);
      setShowDeleteModal(false);
    }
  };
  
  const getAccountIcon = (type) => {
    switch (type) {
      case 'SAVINGS':
        return <FontAwesomeIcon icon={faWallet} className="text-primary" />;
      case 'CHECKING':
        return <FontAwesomeIcon icon={faWallet} className="text-info" />;
      case 'CREDIT':
        return <FontAwesomeIcon icon={faCreditCard} className="text-danger" />;
      case 'INVESTMENT':
        return <FontAwesomeIcon icon={faChartLine} className="text-success" />;
      case 'CASH':
        return <FontAwesomeIcon icon={faMoneyBillWave} className="text-warning" />;
      default:
        return <FontAwesomeIcon icon={faWallet} className="text-secondary" />;
    }
  };

  const getAccountBadge = (type) => {
    let variant;
    switch (type) {
      case 'SAVINGS':
        variant = 'primary';
        break;
      case 'CHECKING':
        variant = 'info';
        break;
      case 'CREDIT':
        variant = 'danger';
        break;
      case 'INVESTMENT':
        variant = 'success';
        break;
      case 'CASH':
        variant = 'warning';
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
            <Card.Title>Accounts</Card.Title>
            <Button variant="primary" onClick={handleAddClick}>
              <FontAwesomeIcon icon={faPlus} className="me-1" /> Add Account
            </Button>
          </div>
          
          {loading ? (
            <Loader />
          ) : accounts.length > 0 ? (
            <div className="table-responsive">
              <Table hover>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Type</th>
                    <th className="text-end">Balance</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {accounts.map((account) => (
                    <tr key={account.id}>
                      <td>
                        <Link to={`/transactions?accountId=${account.id}`} className="text-decoration-none">
                          {account.name}
                        </Link>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          {getAccountIcon(account.accountType)}
                          <span className="ms-2">
                            {getAccountBadge(account.accountType)}
                          </span>
                        </div>
                      </td>
                      <td className="text-end">
                        <CurrencyDisplay 
                          amount={account.balance} 
                          negative={account.accountType === 'CREDIT'} 
                        />
                      </td>
                      <td className="text-center">
                        <Dropdown>
                          <Dropdown.Toggle variant="light" size="sm" id={`dropdown-${account.id}`} className="btn-icon">
                            <FontAwesomeIcon icon={faEllipsisV} />
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <Dropdown.Item onClick={() => handleEditClick(account)}>
                              <FontAwesomeIcon icon={faEdit} className="me-2" /> Edit
                            </Dropdown.Item>
                            <Dropdown.Item 
                              onClick={() => handleDeleteClick(account)}
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
              <p className="text-muted">No accounts found</p>
              <Button variant="primary" onClick={handleAddClick}>
                <FontAwesomeIcon icon={faPlus} className="me-1" /> Add Your First Account
              </Button>
            </div>
          )}
        </Card.Body>
      </Card>
      
      {/* Add Account Modal */}
      <AccountForm
        show={showAddModal}
        handleClose={() => setShowAddModal(false)}
        onSubmit={onAdd}
        title="Add Account"
      />
      
      {/* Edit Account Modal */}
      {currentAccount && (
        <AccountForm
          show={showEditModal}
          handleClose={() => setShowEditModal(false)}
          initialValues={currentAccount}
          onSubmit={(values) => onEdit(currentAccount.id, values)}
          title="Edit Account"
        />
      )}
      
      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        show={showDeleteModal}
        handleClose={() => setShowDeleteModal(false)}
        handleConfirm={handleConfirmDelete}
        title="Delete Account"
        message="Are you sure you want to delete this account? This will also delete all transactions associated with this account. This action cannot be undone."
      />
    </>
  );
};

export default AccountList;