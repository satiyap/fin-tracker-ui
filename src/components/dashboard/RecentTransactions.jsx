import React from 'react';
import { Card, Table, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown, faExchangeAlt } from '@fortawesome/free-solid-svg-icons';
import CurrencyDisplay from '../common/CurrencyDisplay';
import { formatDate } from '../../utils/dateUtils';

const RecentTransactions = ({ transactions }) => {
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
    <Card className="shadow-sm">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <Card.Title>Recent Transactions</Card.Title>
          <Link to="/transactions" className="btn btn-sm btn-outline-primary">View All</Link>
        </div>
        
        {transactions && transactions.length > 0 ? (
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
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        ) : (
          <div className="text-center p-4">
            <p className="text-muted">No recent transactions</p>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default RecentTransactions;