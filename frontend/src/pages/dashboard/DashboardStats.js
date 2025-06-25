import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const DashboardStats = ({ feedbackItems = [], myFeedbackItems = [], categories = [] }) => {
  // Ensure all inputs are arrays
  const allFeedback = Array.isArray(feedbackItems) ? feedbackItems : [];
  const userFeedback = Array.isArray(myFeedbackItems) ? myFeedbackItems : [];
  const categoriesArray = Array.isArray(categories) ? categories : [];
  
  // Calculate statistics
  const totalFeedback = allFeedback.length;
  const totalUpvotes = allFeedback.reduce((sum, item) => sum + (item.upvotes || 0), 0);
  const totalMyFeedback = userFeedback.length;
  
  // Get most popular category
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
  
  let mostPopularCategory = { name: 'None', count: 0 };
  Object.entries(categoryCounts).forEach(([categoryId, count]) => {
    if (count > mostPopularCategory.count) {
      const category = categoriesArray.find(c => c._id === categoryId);
      if (category) {
        mostPopularCategory = { name: category.name, count };
      }
    }  });
  
  // Get newest feedback
  const newestFeedback = allFeedback.length > 0 
    ? [...allFeedback].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0]
    : null;
  
  // Get most upvoted feedback
  const mostUpvotedFeedback = allFeedback.length > 0
    ? [...allFeedback].sort((a, b) => b.upvotes - a.upvotes)[0]
    : null;

  const statsCards = [
    {
      title: 'Total Feedback',
      value: totalFeedback,
      icon: 'comments',
      color: 'primary'
    },
    {
      title: 'Total Upvotes',
      value: totalUpvotes,
      icon: 'thumbs-up',
      color: 'success'
    },
    {
      title: 'My Feedback',
      value: totalMyFeedback,
      icon: 'user-edit',
      color: 'info'
    }
  ];

  return (
    <div className="dashboard-stats">
      <Row className="mb-4">
        {statsCards.map((card, index) => (
          <Col key={index} md={3} className="mb-3 mb-md-0">
            <Card className={`stats-card bg-${card.color} text-white`}>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="stats-title">{card.title}</h6>
                    <h2 className="stats-value">{card.value}</h2>
                  </div>
                  <div className="stats-icon">
                    <i className={`fas fa-${card.icon}`}></i>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      
      <Row>
        <Col md={6} className="mb-4">
          <Card className="category-distribution-card h-100">
            <Card.Header>
              <i className="fas fa-chart-pie me-2"></i>
              Category Distribution
            </Card.Header>
            <Card.Body>
              <div className="category-progress">
                {categoriesArray.map(category => {
                  const count = categoryCounts[category._id] || 0;
                  const percentage = totalFeedback > 0 
                    ? Math.round((count / totalFeedback) * 100) 
                    : 0;
                    
                  return (
                    <div key={category._id} className="mb-3">
                      <div className="d-flex justify-content-between mb-1">
                        <span>{category.name}</span>
                        <span>{count} ({percentage}%)</span>
                      </div>
                      <div className="progress" style={{ height: '10px' }}>
                        <div 
                          className="progress-bar bg-info"
                          role="progressbar"
                          style={{ width: `${percentage}%` }}
                          aria-valuenow={percentage}
                          aria-valuemin="0"
                          aria-valuemax="100"
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6} className="mb-4">
          <Card className="highlights-card h-100">
            <Card.Header>
              <i className="fas fa-star me-2"></i>
              Highlights
            </Card.Header>
            <Card.Body>
              <div className="highlight-item mb-3">
                <h6>Most Popular Category</h6>
                <p className="mb-0">
                  <span className="badge bg-info me-2">{mostPopularCategory.name}</span>
                  <span className="text-muted">({mostPopularCategory.count} feedback items)</span>
                </p>
              </div>
              
              {/* Show top 3 most upvoted feedback */}
              <div className="highlight-item mb-4">
                <h6>Most Upvoted Feedback</h6>
                {[...allFeedback]
                  .sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0))
                  .slice(0, 3)
                  .map(feedback => (
                    <div key={feedback._id} className="mb-2">
                      <Link to={`/feedback/${feedback._id}`} className="highlight-link d-flex align-items-center justify-content-between">
                        <span className="text-truncate me-2">{feedback.title}</span>
                        <span className="badge bg-success">
                          <i className="fas fa-thumbs-up me-1"></i>
                          {feedback.upvotes || 0}
                        </span>
                      </Link>
                    </div>
                  ))}
              </div>
              
              {newestFeedback && (
                <div className="highlight-item">
                  <h6>Newest Feedback</h6>
                  <p className="mb-0">
                    <Link to={`/feedback/${newestFeedback._id}`} className="highlight-link">
                      {newestFeedback.title}
                    </Link>
                  </p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardStats;
