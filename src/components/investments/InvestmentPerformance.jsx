import React, { useState, useEffect } from 'react';
import { Modal, Card, Row, Col, Table } from 'react-bootstrap';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faCalendarAlt, faMoneyBillWave, faPercentage } from '@fortawesome/free-solid-svg-icons';
import CurrencyDisplay from '../common/CurrencyDisplay';
import { formatDate } from '../../utils/dateUtils';
import { calculateReturnRate } from '../../api/investmentApi';
import Loader from '../common/Loader';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const InvestmentPerformance = ({ show, handleClose, investment }) => {
  const [returnRate, setReturnRate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchReturnRate = async () => {
      if (investment && show) {
        try {
          setLoading(true);
          const rate = await calculateReturnRate(investment.id);
          setReturnRate(rate);
          setError(null);
        } catch (err) {
          console.error('Error fetching return rate:', err);
          setError('Failed to fetch return rate');
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchReturnRate();
  }, [investment, show]);
  
  // Calculate investment duration in years
  const calculateDuration = () => {
    if (!investment) return null;
    
    const startDate = new Date(investment.startDate);
    const endDate = investment.endDate ? new Date(investment.endDate) : new Date();
    
    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return (diffDays / 365).toFixed(1);
  };
  
  // Calculate absolute return
  const calculateAbsoluteReturn = () => {
    if (!investment || !investment.currentValue) return null;
    
    const initialAmount = parseFloat(investment.initialAmount);
    const currentValue = parseFloat(investment.currentValue);
    
    return currentValue - initialAmount;
  };
  
  // Calculate return percentage
  const calculateReturnPercentage = () => {
    if (!investment || !investment.currentValue) return null;
    
    const initialAmount = parseFloat(investment.initialAmount);
    const currentValue = parseFloat(investment.currentValue);
    
    if (initialAmount === 0) return null;
    
    return ((currentValue - initialAmount) / initialAmount) * 100;
  };
  
  // Prepare chart data
  const prepareChartData = () => {
    if (!investment) return null;
    
    // For a real app, this would use actual historical data
    // Here we're simulating data based on initial and current values
    
    const initialAmount = parseFloat(investment.initialAmount);
    const currentValue = parseFloat(investment.currentValue || initialAmount);
    const startDate = new Date(investment.startDate);
    const endDate = investment.endDate ? new Date(investment.endDate) : new Date();
    
    // Generate 6 data points between start and end dates
    const dataPoints = 6;
    const timeInterval = (endDate - startDate) / (dataPoints - 1);
    
    const labels = [];
    const data = [];
    
    // If we have a positive return, create an upward curve
    // If negative, create a downward curve
    const isPositiveReturn = currentValue >= initialAmount;
    
    for (let i = 0; i < dataPoints; i++) {
      const pointDate = new Date(startDate.getTime() + timeInterval * i);
      labels.push(formatDate(pointDate));
      
      if (i === 0) {
        data.push(initialAmount);
      } else if (i === dataPoints - 1) {
        data.push(currentValue);
      } else {
        // Create a curve using a simple quadratic function
        const progress = i / (dataPoints - 1);
        let value;
        
        if (isPositiveReturn) {
          // Upward curve for positive returns
          value = initialAmount + (currentValue - initialAmount) * (progress * progress);
        } else {
          // Downward curve for negative returns
          value = initialAmount - (initialAmount - currentValue) * (progress * progress);
        }
        
        data.push(value);
      }
    }
    
    return {
      labels,
      datasets: [
        {
          label: 'Investment Value',
          data,
          borderColor: isPositiveReturn ? 'rgba(75, 192, 192, 1)' : 'rgba(255, 99, 132, 1)',
          backgroundColor: isPositiveReturn ? 'rgba(75, 192, 192, 0.2)' : 'rgba(255, 99, 132, 0.2)',
          tension: 0.4
        }
      ]
    };
  };
  
  const chartData = prepareChartData();
  const duration = calculateDuration();
  const absoluteReturn = calculateAbsoluteReturn();
  const returnPercentage = calculateReturnPercentage();
  
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: 'INR'
              }).format(context.parsed.y);
            }
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        ticks: {
          callback: function(value) {
            return new Intl.NumberFormat('en-IN', {
              style: 'currency',
              currency: 'INR',
              maximumSignificantDigits: 3
            }).format(value);
          }
        }
      }
    }
  };
  
  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          <FontAwesomeIcon icon={faChartLine} className="me-2" />
          Investment Performance: {investment?.name}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <Loader />
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : (
          <>
            <Row className="mb-4">
              <Col md={3}>
                <Card className="text-center h-100">
                  <Card.Body>
                    <FontAwesomeIcon icon={faCalendarAlt} className="text-primary mb-2" size="2x" />
                    <h6>Duration</h6>
                    <h4>{duration} years</h4>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="text-center h-100">
                  <Card.Body>
                    <FontAwesomeIcon icon={faMoneyBillWave} className="text-success mb-2" size="2x" />
                    <h6>Absolute Return</h6>
                    <h4>
                      <CurrencyDisplay 
                        amount={absoluteReturn} 
                        negative={absoluteReturn < 0} 
                      />
                    </h4>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="text-center h-100">
                  <Card.Body>
                    <FontAwesomeIcon icon={faPercentage} className="text-warning mb-2" size="2x" />
                    <h6>Return %</h6>
                    <h4 className={returnPercentage >= 0 ? 'text-success' : 'text-danger'}>
                      {returnPercentage !== null ? returnPercentage.toFixed(2) + '%' : 'N/A'}
                    </h4>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="text-center h-100">
                  <Card.Body>
                    <FontAwesomeIcon icon={faChartLine} className="text-info mb-2" size="2x" />
                    <h6>Annualized Return</h6>
                    <h4 className={returnRate >= 0 ? 'text-success' : 'text-danger'}>
                      {returnRate !== null ? returnRate.toFixed(2) + '%' : 'N/A'}
                    </h4>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            
            <Card className="mb-4">
              <Card.Body>
                <Card.Title>Value Over Time</Card.Title>
                <div style={{ height: '300px' }}>
                  {chartData && <Line data={chartData} options={chartOptions} />}
                </div>
              </Card.Body>
            </Card>
            
            <Card>
              <Card.Body>
                <Card.Title>Investment Details</Card.Title>
                <Table bordered hover>
                  <tbody>
                    <tr>
                      <th width="30%">Investment Type</th>
                      <td>{investment?.investmentType.replace('_', ' ')}</td>
                    </tr>
                    <tr>
                      <th>Initial Amount</th>
                      <td><CurrencyDisplay amount={investment?.initialAmount} /></td>
                    </tr>
                    <tr>
                      <th>Current Value</th>
                      <td><CurrencyDisplay amount={investment?.currentValue || investment?.initialAmount} /></td>
                    </tr>
                    <tr>
                      <th>Start Date</th>
                      <td>{formatDate(investment?.startDate)}</td>
                    </tr>
                    {investment?.endDate && (
                      <tr>
                        <th>End Date</th>
                        <td>{formatDate(investment?.endDate)}</td>
                      </tr>
                    )}
                    {investment?.expectedReturnRate && (
                      <tr>
                        <th>Expected Return Rate</th>
                        <td>{investment?.expectedReturnRate}%</td>
                      </tr>
                    )}
                    {investment?.ticker && (
                      <tr>
                        <th>Ticker Symbol</th>
                        <td>{investment?.ticker}</td>
                      </tr>
                    )}
                    {investment?.notes && (
                      <tr>
                        <th>Notes</th>
                        <td>{investment?.notes}</td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default InvestmentPerformance;