import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { 
  Chart as ChartJS, 
  ArcElement, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  ArcElement, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend
);

const FeedbackCharts = ({ feedbackItems = [], categories = [] }) => {
  // Ensure all inputs are arrays
  const allFeedback = Array.isArray(feedbackItems) ? feedbackItems : [];
  const categoriesArray = Array.isArray(categories) ? categories : [];
  
  // Generate data for category distribution chart
  const categoryData = () => {
    const categoryCounts = allFeedback.reduce((acc, item) => {
      if (item && item.category) {
        const categoryId = item.category && typeof item.category === 'object' 
          ? item.category._id 
          : item.category;
        
        if (categoryId) {
          acc[categoryId] = (acc[categoryId] || 0) + 1;
        }
      }
      return acc;
    }, {});
    
    const categoryMap = categoriesArray.reduce((acc, cat) => {
      if (cat && cat._id) {
        acc[cat._id] = cat.name;
      }
      return acc;
    }, {});
    
    const sortedCategories = Object.entries(categoryCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 7); // Top 7 categories
    
    const labels = sortedCategories.map(([id]) => categoryMap[id] || 'Uncategorized');
    const data = sortedCategories.map(([, count]) => count);
    
    // Color palette for categories
    const backgroundColors = [
      'rgba(13, 110, 253, 0.7)',   // Primary blue
      'rgba(102, 16, 242, 0.7)',   // Purple
      'rgba(253, 126, 20, 0.7)',   // Orange
      'rgba(32, 201, 151, 0.7)',   // Teal
      'rgba(220, 53, 69, 0.7)',    // Red
      'rgba(255, 193, 7, 0.7)',    // Yellow
      'rgba(108, 117, 125, 0.7)',  // Gray
    ];
    
    const borderColors = backgroundColors.map(color => 
      color.replace('0.7', '1')    // Solid version of the same colors
    );
    
    return {
      labels,
      datasets: [{
        data,
        backgroundColor: backgroundColors,
        borderColor: borderColors,
        borderWidth: 1,
      }],
    };
  };
    // Generate data for monthly feedback chart
  const monthlyData = () => {
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    
    const currentYear = new Date().getFullYear();
    const monthCounts = new Array(12).fill(0);
    
    // Count feedback items by month for current year
    allFeedback.forEach(item => {
      if (item && item.createdAt) {
        try {
          const date = new Date(item.createdAt);
          if (date.getFullYear() === currentYear) {
            monthCounts[date.getMonth()]++;
          }
        } catch (err) {
          console.error("Error parsing date:", err);
        }
      }
    });
    
    return {
      labels: months,
      datasets: [
        {
          label: 'Feedback Submissions',
          data: monthCounts,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
      ],
    };
  };
  
  // Chart options
  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.formattedValue;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((context.raw / total) * 100);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
    layout: {
      padding: 20
    },
    maintainAspectRatio: false
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
      },
    },
  };
  
  return (
    <div className="feedback-analytics">
      <Row className="mb-4">
        <Col md={6} className="mb-4">
          <div className="chart-container">
            <h5 className="chart-title">
              <i className="fas fa-chart-pie me-2"></i>
              Category Distribution
            </h5>
            <div style={{ height: '300px' }}>
              <Pie data={categoryData()} options={pieOptions} />
            </div>
          </div>
        </Col>
        
        <Col md={6} className="mb-4">
          <div className="chart-container">
            <h5 className="chart-title">
              <i className="fas fa-chart-bar me-2"></i>
              Monthly Feedback (This Year)
            </h5>
            <div style={{ height: '300px' }}>
              <Bar data={monthlyData()} options={barOptions} />
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default FeedbackCharts;
