import React from 'react';
import { Card, ListGroup, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import CurrencyDisplay from '../common/CurrencyDisplay';
import { formatDate } from '../../utils/dateUtils';

const UpcomingPayments = ({ scheduledTransactions }) => {
  return (
    <Card className="shadow-sm h-100">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <Card.Title>Upcoming Payments</Card.Title>
          <Link to="/scheduled-transactions" className="btn btn-sm btn-outline-primary">View All</Link>
        </div>
        
        {scheduledTransactions && scheduledTransactions.length > 0 ? (
          <ListGroup variant="flush">
            {scheduledTransactions.map((payment) => (
              <ListGroup.Item key={payment.id} className="d-flex justify-content-between align-items-center py-3">
                <div>
                  <div className="fw-bold">{payment.description}</div>
                  <div className="text-muted small">
                    <FontAwesomeIcon icon={faCalendarAlt} className="me-1" />
                    {formatDate(payment.nextDueDate)}
                  </div>
                  <Badge 
                    bg={payment.transactionType === 'EXPENSE' ? 'danger' : 'success'} 
                    className="mt-1"
                  >
                    {payment.transactionType}
                  </Badge>
                </div>
                <CurrencyDisplay 
                  amount={payment.amount} 
                  negative={payment.transactionType === 'EXPENSE'} 
                  className="fw-bold"
                />
              </ListGroup.Item>
            ))}
          </ListGroup>
        ) : (
          <div className="text-center p-4">
            <p className="text-muted">No upcoming payments</p>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default UpcomingPayments;