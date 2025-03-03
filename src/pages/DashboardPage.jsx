import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Dashboard from '../components/dashboard/Dashboard';
import Sidebar from '../components/common/Sidebar';

const DashboardPage = () => {
  return (
    <Container fluid>
      <Row>
        <Col md={3} lg={2} className="d-none d-md-block">
          <Sidebar />
        </Col>
        <Col md={9} lg={10}>
          <Dashboard />
        </Col>
      </Row>
    </Container>
  );
};

export default DashboardPage;