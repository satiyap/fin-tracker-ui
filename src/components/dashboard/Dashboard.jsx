import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { useAuth } from '../../hooks/useAuth';
import BalanceOverview from './BalanceOverview';
import ExpenseChart from './ExpenseChart';
import RecentTransactions from './RecentTransactions';
import UpcomingPayments from './UpcomingPayments';
import { getAccountsByUserId } from '../../api/accountApi';
import { getTransactionsByUserIdAndDateRange } from '../../api/transactionApi';
import { getUpcomingScheduledTransactions } from '../../api/scheduledTransactionApi';
import { formatDateForApi } from '../../utils/dateUtils';
import Loader from '../common/Loader';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [upcomingPayments, setUpcomingPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Get current date and 30 days ago for transaction range
        const now = new Date();
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        // Get next 7 days for upcoming payments
        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);
        
        // Format dates for API
        const startDate = formatDateForApi(thirtyDaysAgo);
        const endDate = formatDateForApi(now);
        const upcomingDate = formatDateForApi(nextWeek);
        
        // Fetch data in parallel
        const [accountsData, transactionsData, paymentsData] = await Promise.all([
          getAccountsByUserId(currentUser.id),
          getTransactionsByUserIdAndDateRange(currentUser.id, startDate, endDate),
          getUpcomingScheduledTransactions(upcomingDate)
        ]);
        
        setAccounts(accountsData);
        setTransactions(transactionsData);
        setUpcomingPayments(paymentsData);
        
      } catch (err) {
        setError(err.message || 'Failed to load dashboard data');
        console.error('Dashboard data error:', err);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser?.id) {
      fetchDashboardData();
    }
  }, [currentUser]);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <Container className="mt-4">
        <Card className="text-center p-4 shadow-sm">
          <Card.Body>
            <Card.Title className="text-danger">Error Loading Dashboard</Card.Title>
            <Card.Text>{error}</Card.Text>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  return (
    <Container fluid>
      <h1 className="mb-4">Dashboard</h1>
      
      <Row className="mb-4">
        <Col lg={12}>
          <BalanceOverview accounts={accounts} />
        </Col>
      </Row>
      
      <Row className="mb-4">
        <Col lg={8}>
          <ExpenseChart transactions={transactions} />
        </Col>
        <Col lg={4}>
          <UpcomingPayments scheduledTransactions={upcomingPayments} />
        </Col>
      </Row>
      
      <Row>
        <Col lg={12}>
          <RecentTransactions transactions={transactions.slice(0, 10)} />
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;