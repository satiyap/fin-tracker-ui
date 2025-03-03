import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import InvestmentList from '../components/investments/InvestmentList';
import Sidebar from '../components/common/Sidebar';
import { useInvestments } from '../hooks/useInvestments';
import Alert from '../components/common/Alert';

const InvestmentsPage = () => {
  const { 
    investments, 
    loading, 
    error, 
    addInvestment, 
    editInvestment, 
    removeInvestment,
    updateValue
  } = useInvestments();

  return (
    <Container fluid>
      <Row>
        <Col md={3} lg={2} className="d-none d-md-block">
          <Sidebar />
        </Col>
        <Col md={9} lg={10}>
          <h1 className="mb-4">Investments</h1>
          
          {error && (
            <Alert 
              variant="danger" 
              message={error} 
              dismissible={true}
            />
          )}
          
          <InvestmentList
            investments={investments}
            loading={loading}
            onAdd={addInvestment}
            onEdit={editInvestment}
            onDelete={removeInvestment}
            onUpdateValue={updateValue}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default InvestmentsPage;