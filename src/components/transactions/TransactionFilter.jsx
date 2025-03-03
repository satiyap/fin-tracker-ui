import React, { useState } from 'react';
import { Form, Row, Col, Button, Card } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faTimes } from '@fortawesome/free-solid-svg-icons';

const TransactionFilter = ({ onFilter }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [transactionType, setTransactionType] = useState('');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  
  const handleFilter = () => {
    const filters = {
      startDate,
      endDate,
      transactionType: transactionType || null,
      minAmount: minAmount ? parseFloat(minAmount) : null,
      maxAmount: maxAmount ? parseFloat(maxAmount) : null
    };
    
    onFilter(filters);
  };
  
  const handleReset = () => {
    setStartDate(null);
    setEndDate(null);
    setTransactionType('');
    setMinAmount('');
    setMaxAmount('');
    
    onFilter({});
  };
  
  return (
    <Card className="mb-4 border-light shadow-sm">
      <Card.Body>
        <Row>
          <Col md={3}>
            <Form.Group className="mb-3">
              <Form.Label>Start Date</Form.Label>
              <DatePicker
                selected={startDate}
                onChange={date => setStartDate(date)}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                className="form-control"
                dateFormat="dd/MM/yyyy"
                placeholderText="From"
                isClearable
              />
            </Form.Group>
          </Col>
          
          <Col md={3}>
            <Form.Group className="mb-3">
              <Form.Label>End Date</Form.Label>
              <DatePicker
                selected={endDate}
                onChange={date => setEndDate(date)}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
                className="form-control"
                dateFormat="dd/MM/yyyy"
                placeholderText="To"
                isClearable
              />
            </Form.Group>
          </Col>
          
          <Col md={2}>
            <Form.Group className="mb-3">
              <Form.Label>Transaction Type</Form.Label>
              <Form.Select
                value={transactionType}
                onChange={e => setTransactionType(e.target.value)}
              >
                <option value="">All Types</option>
                <option value="EXPENSE">Expense</option>
                <option value="INCOME">Income</option>
                <option value="TRANSFER">Transfer</option>
              </Form.Select>
            </Form.Group>
          </Col>
          
          <Col md={2}>
            <Form.Group className="mb-3">
              <Form.Label>Min Amount</Form.Label>
              <Form.Control
                type="number"
                value={minAmount}
                onChange={e => setMinAmount(e.target.value)}
                placeholder="Min"
              />
            </Form.Group>
          </Col>
          
          <Col md={2}>
            <Form.Group className="mb-3">
              <Form.Label>Max Amount</Form.Label>
              <Form.Control
                type="number"
                value={maxAmount}
                onChange={e => setMaxAmount(e.target.value)}
                placeholder="Max"
              />
            </Form.Group>
          </Col>
        </Row>
        
        <div className="d-flex justify-content-end">
          <Button 
            variant="outline-secondary" 
            className="me-2"
            onClick={handleReset}
          >
            <FontAwesomeIcon icon={faTimes} className="me-1" /> Reset
          </Button>
          <Button 
            variant="primary"
            onClick={handleFilter}
          >
            <FontAwesomeIcon icon={faFilter} className="me-1" /> Apply Filters
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default TransactionFilter;