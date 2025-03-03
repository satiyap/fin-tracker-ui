import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faWallet, 
  faCreditCard, 
  faMoneyBillWave, 
  faChartLine 
} from '@fortawesome/free-solid-svg-icons';
import CurrencyDisplay from '../common/CurrencyDisplay';

const AccountSummary = ({ accounts }) => {
  // Calculate total balance across all accounts
  const totalBalance = accounts.reduce((sum, account) => {
    // For credit accounts, subtract from total (they're liabilities)
    const amount = account.accountType === 'CREDIT' 
      ? -parseFloat(account.balance) 
      : parseFloat(account.balance);
    return sum + amount;
  }, 0);
  
  // Group accounts by type
  const accountsByType = accounts.reduce((acc, account) => {
    const type = account.accountType;
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(account);
    return acc;
  }, {});
  
  // Calculate balance by account type
  const balanceByType = Object.keys(accountsByType).reduce((acc, type) => {
    acc[type] = accountsByType[type].reduce((sum, account) => sum + parseFloat(account.balance), 0);
    return acc;
  }, {});

  // Get icon for account type
  const getIconForType = (type) => {
    switch (type) {
      case 'SAVINGS':
      case 'CHECKING':
        return faWallet;
      case 'CREDIT':
        return faCreditCard;
      case 'CASH':
        return faMoneyBillWave;
      case 'INVESTMENT':
        return faChartLine;
      default:
        return faWallet;
    }
  };

  // Get color for account type
  const getColorForType = (type) => {
    switch (type) {
      case 'SAVINGS':
        return 'primary';
      case 'CHECKING':
        return 'info';
      case 'CREDIT':
        return 'danger';
      case 'CASH':
        return 'warning';
      case 'INVESTMENT':
        return 'success';
      default:
        return 'secondary';
    }
  };

  return (
    <Card className="shadow-sm mb-4">
      <Card.Body>
        <Card.Title>Financial Overview</Card.Title>
        <Row className="mt-4">
          <Col md={3} className="text-center mb-3">
            <Card className="h-100 border-0 shadow-sm">
              <Card.Body>
                <h6 className="text-muted">Net Worth</h6>
                <div className="d-flex align-items-center justify-content-center">
                  <FontAwesomeIcon icon={faWallet} size="2x" className="me-2 text-primary" />
                  <h3 className="mb-0">
                    <CurrencyDisplay amount={totalBalance} />
                  </h3>
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          {Object.keys(balanceByType).map((type) => (
            <Col md={3} className="text-center mb-3" key={type}>
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body>
                  <h6 className="text-muted">{type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()}</h6>
                  <div className="d-flex align-items-center justify-content-center">
                    <FontAwesomeIcon 
                      icon={getIconForType(type)} 
                      size="2x" 
                      className={`me-2 text-${getColorForType(type)}`} 
                    />
                    <h3 className="mb-0">
                      <CurrencyDisplay 
                        amount={balanceByType[type]} 
                        negative={type === 'CREDIT'} 
                      />
                    </h3>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Card.Body>
    </Card>
  );
};

export default AccountSummary;