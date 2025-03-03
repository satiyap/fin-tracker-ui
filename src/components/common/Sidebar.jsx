import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTachometerAlt, 
  faWallet, 
  faExchangeAlt, 
  faCalendarAlt, 
  faChartLine, 
  faTags 
} from '@fortawesome/free-solid-svg-icons';

const Sidebar = () => {
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <div className="bg-light sidebar p-3 shadow-sm">
      <h5 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
        <span>Main Menu</span>
      </h5>
      <Nav className="flex-column">
        <Nav.Link 
          as={Link} 
          to="/dashboard" 
          className={`${isActive('/dashboard')} sidebar-item`}
        >
          <FontAwesomeIcon icon={faTachometerAlt} className="me-2" />
          Dashboard
        </Nav.Link>
        <Nav.Link 
          as={Link} 
          to="/accounts" 
          className={`${isActive('/accounts')} sidebar-item`}
        >
          <FontAwesomeIcon icon={faWallet} className="me-2" />
          Accounts
        </Nav.Link>
        <Nav.Link 
          as={Link} 
          to="/transactions" 
          className={`${isActive('/transactions')} sidebar-item`}
        >
          <FontAwesomeIcon icon={faExchangeAlt} className="me-2" />
          Transactions
        </Nav.Link>
        <Nav.Link 
          as={Link} 
          to="/scheduled-transactions" 
          className={`${isActive('/scheduled-transactions')} sidebar-item`}
        >
          <FontAwesomeIcon icon={faCalendarAlt} className="me-2" />
          Scheduled Transactions
        </Nav.Link>
        <Nav.Link 
          as={Link} 
          to="/categories" 
          className={`${isActive('/categories')} sidebar-item`}
        >
          <FontAwesomeIcon icon={faTags} className="me-2" />
          Categories
        </Nav.Link>
        <Nav.Link 
          as={Link} 
          to="/investments" 
          className={`${isActive('/investments')} sidebar-item`}
        >
          <FontAwesomeIcon icon={faChartLine} className="me-2" />
          Investments
        </Nav.Link>
      </Nav>
    </div>
  );
};

export default Sidebar;