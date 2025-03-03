import React, { useState, useEffect } from 'react';
import { Card, Form } from 'react-bootstrap';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { formatIndianRupee } from '../../utils/currencyFormatter';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const ExpenseChart = ({ transactions }) => {
  const [chartType, setChartType] = useState('category');
  const [chartData, setChartData] = useState(null);
  
  useEffect(() => {
    if (!transactions || transactions.length === 0) {
      setChartData(null);
      return;
    }
    
    if (chartType === 'category') {
      prepareDataByCategory();
    } else if (chartType === 'monthly') {
      prepareDataByMonth();
    }
  }, [transactions, chartType]);
  
  const prepareDataByCategory = () => {
    // Filter for expense transactions only
    const expenses = transactions.filter(t => t.transactionType === 'EXPENSE');
    
    // Group by category and sum amounts
    const categoryMap = expenses.reduce((acc, transaction) => {
      const categoryName = transaction.category?.name || 'Uncategorized';
      if (!acc[categoryName]) {
        acc[categoryName] = 0;
      }
      acc[categoryName] += parseFloat(transaction.amount);
      return acc;
    }, {});
    
    // Sort categories by amount (descending)
    const sortedCategories = Object.entries(categoryMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 7); // Take top 7 categories
    
    // Prepare data for pie chart
    const data = {
      labels: sortedCategories.map(([category]) => category),
      datasets: [
        {
          data: sortedCategories.map(([, amount]) => amount),
          backgroundColor: [
            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#C9CBCF'
          ],
          borderWidth: 1,
        },
      ],
    };
    
    setChartData(data);
  };
  
  const prepareDataByMonth = () => {
    // Filter for expense transactions only
    const expenses = transactions.filter(t => t.transactionType === 'EXPENSE');
    
    // Group by month and sum amounts
    const monthMap = expenses.reduce((acc, transaction) => {
      const date = new Date(transaction.transactionDate);
      const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
      
      if (!acc[monthYear]) {
        acc[monthYear] = 0;
      }
      acc[monthYear] += parseFloat(transaction.amount);
      return acc;
    }, {});
    
    // Convert to arrays for chart
    const months = Object.keys(monthMap);
    const amounts = Object.values(monthMap);
    
    // Prepare data for bar chart
    const data = {
      labels: months,
      datasets: [
        {
          label: 'Expenses',
          data: amounts,
          backgroundColor: '#36A2EB',
          borderColor: '#2993E0',
          borderWidth: 1,
        },
      ],
    };
    
    setChartData(data);
  };
  
  const handleChartTypeChange = (e) => {
    setChartType(e.target.value);
  };
  
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.label || '';
            if (label) {
              label += ': ';
            }
            label += formatIndianRupee(context.raw);
            return label;
          }
        }
      }
    },
  };
  
  return (
    <Card className="shadow-sm h-100">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <Card.Title>Expense Analysis</Card.Title>
          <Form.Select 
            value={chartType}
            onChange={handleChartTypeChange}
            style={{ width: 'auto' }}
          >
            <option value="category">By Category</option>
            <option value="monthly">By Month</option>
          </Form.Select>
        </div>
        
        {chartData ? (
          <div className="chart-container" style={{ height: '300px', position: 'relative' }}>
            {chartType === 'category' ? (
              <Pie data={chartData} options={options} />
            ) : (
              <Bar data={chartData} options={options} />
            )}
          </div>
        ) : (
          <div className="text-center p-5">
            <p className="text-muted">No expense data available</p>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default ExpenseChart;