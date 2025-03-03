import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import TransactionList from '../components/transactions/TransactionList';
import Sidebar from '../components/common/Sidebar';
import { useTransactions } from '../hooks/useTransactions';
import { formatDateForApi } from '../utils/dateUtils';
import { toast } from 'react-toastify';

const TransactionsPage = () => {
  const [filters, setFilters] = useState({});
  const { 
    transactions, 
    loading, 
    error, 
    fetchTransactions, 
    addTransaction, 
    editTransaction, 
    removeTransaction 
  } = useTransactions();

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleFilter = (newFilters) => {
    setFilters(newFilters);
    
    // Format dates for API
    const formattedFilters = {
      ...newFilters,
      startDate: newFilters.startDate ? formatDateForApi(newFilters.startDate) : null,
      endDate: newFilters.endDate ? formatDateForApi(newFilters.endDate) : null
    };
    
    // Call API with filters
    // This is a simplified example - in a real app, you'd need to implement
    // filtering logic in your API or client-side
    fetchTransactions(formattedFilters);
  };

  return (
    <Container fluid>
      <Row>
        <Col md={3} lg={2} className="d-none d-md-block">
          <Sidebar />
        </Col>
        <Col md={9} lg={10}>
          <h1 className="mb-4">Transactions</h1>
          <TransactionList
            transactions={transactions}
            loading={loading}
            onAdd={addTransaction}
            onEdit={editTransaction}
            onDelete={removeTransaction}
            onFilter={handleFilter}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default TransactionsPage;