import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import AccountList from '../components/accounts/AccountList';
import AccountSummary from '../components/accounts/AccountSummary';
import Sidebar from '../components/common/Sidebar';
import { useAccounts } from '../hooks/useAccounts';
import Alert from '../components/common/Alert';

const AccountsPage = () => {
  const { 
    accounts, 
    loading, 
    error, 
    addAccount, 
    editAccount, 
    removeAccount 
  } = useAccounts();

  return (
    <Container fluid>
      <Row>
        <Col md={3} lg={2} className="d-none d-md-block">
          <Sidebar />
        </Col>
        <Col md={9} lg={10}>
          <h1 className="mb-4">Accounts</h1>
          
          {error && (
            <Alert 
              variant="danger" 
              message={error} 
              dismissible={true}
            />
          )}
          
          <AccountSummary accounts={accounts} />
          
          <AccountList
            accounts={accounts}
            loading={loading}
            onAdd={addAccount}
            onEdit={editAccount}
            onDelete={removeAccount}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default AccountsPage;