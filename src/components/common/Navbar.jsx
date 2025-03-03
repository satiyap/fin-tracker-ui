import React from 'react';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHome, 
  faWallet, 
  faExchangeAlt, 
  faCalendarAlt, 
  faChartLine, 
  faSignOutAlt, 
  faUser 
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../hooks/useAuth';

const AppNavbar = () => {
  const { currentUser, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Navbar bg="primary" variant="dark" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand as={Link} to="/">
          <FontAwesomeIcon icon={faWallet} className="me-2" />
          Fin-Tracker
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          {isAuthenticated ? (
            <>
              <Nav className="me-auto">
                <Nav.Link as={Link} to="/dashboard">
                  <FontAwesomeIcon icon={faHome} className="me-1" /> Dashboard
                </Nav.Link>
                <Nav.Link as={Link} to="/accounts">
                  <FontAwesomeIcon icon={faWallet} className="me-1" /> Accounts
                </Nav.Link>
                <Nav.Link as={Link} to="/transactions">
                  <FontAwesomeIcon icon={faExchangeAlt} className="me-1" /> Transactions
                </Nav.Link>
                <Nav.Link as={Link} to="/scheduled-transactions">
                  <FontAwesomeIcon icon={faCalendarAlt} className="me-1" /> Scheduled
                </Nav.Link>
                <Nav.Link as={Link} to="/investments">
                  <FontAwesomeIcon icon={faChartLine} className="me-1" /> Investments
                </Nav.Link>
              </Nav>
              <Nav>
                <NavDropdown 
                  title={
                    <span>
                      <FontAwesomeIcon icon={faUser} className="me-1" />
                      {currentUser?.username}
                    </span>
                  } 
                  id="user-dropdown"
                >
                  <NavDropdown.Item onClick={handleLogout}>
                    <FontAwesomeIcon icon={faSignOutAlt} className="me-1" /> Logout
                  </NavDropdown.Item>
                </NavDropdown>
              </Nav>
            </>
          ) : (
            <Nav className="ms-auto">
              <Nav.Link as={Link} to="/login">Login</Nav.Link>
              <Nav.Link as={Link} to="/register">Register</Nav.Link>
            </Nav>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;