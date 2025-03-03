import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import ScheduledTransactionList from '../components/scheduled-transactions/ScheduledTransactionList';
import Sidebar from '../components/common/Sidebar';
import { useScheduledTransactions } from '../hooks/useScheduledTransactions';
import Alert from '../components/common/Alert';

const ScheduledTransactionsPage = () => {
  const { 
    scheduledTransactions, 
    loading, 
    error, 
    addScheduledTransaction, 
    editScheduledTransaction, 
    removeScheduledTransaction,
    executeTransaction
  } = useScheduledTransactions();

  return (
    <Container fluid>
      <Row>
        <Col md={3} lg={2} className="d-none d-md-block">
          <Sidebar />
        </Col>
        <Col md={9} lg={10}>
          <h1 className="mb-4">Scheduled Transactions</h1>
          
          {error && (
            <Alert 
              variant="danger" 
              message={error} 
              dismissible={true}
            />
          )}
          
          <ScheduledTransactionList
            scheduledTransactions={scheduledTransactions}
            loading={loading}
            onAdd={addScheduledTransaction}
            onEdit={editScheduledTransaction}
            onDelete={removeScheduledTransaction}
            onExecute={executeTransaction}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default ScheduledTransactionsPage;