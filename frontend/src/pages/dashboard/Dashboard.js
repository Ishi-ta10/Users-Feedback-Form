import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Badge, Spinner, Alert, Tabs, Tab } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getAllFeedback, getMyFeedback } from '../../services/feedbackService';
import { getAllCategories } from '../../services/categoryService';
import api from '../../services/api';
import FeedbackCard from '../../components/feedback/FeedbackCard';
import { useAuth } from '../../context/AuthContext';
import DashboardStats from './DashboardStats';
import FeedbackTable from './FeedbackTable';
import FeedbackCharts from './FeedbackCharts';
import './Dashboard.css';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('feedback'); // Default to All Feedback tab
  const [allFeedback, setAllFeedback] = useState([]);
  const [userFeedback, setUserFeedback] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');  const [filters, setFilters] = useState({
    category: '',
    dateRange: '',
    search: '',
  });
  const [sortOption, setSortOption] = useState('-createdAt');
  const [viewMode, setViewMode] = useState('cards'); // 'cards' or 'table'
  
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);
  // Load feedback and categories on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Prepare filter parameters
        const params = {
          sort: sortOption
        };
        
        // Only add non-empty filters
        if (filters.category) {
          params.category = filters.category;
        }
        
        // Format date range filter
        if (filters.dateRange) {
          const now = new Date();
          const startDate = new Date();
          
          switch (filters.dateRange) {
            case 'today':
              startDate.setHours(0, 0, 0, 0);
              params.createdAt = { gte: startDate.toISOString() };
              break;
            case 'week':
              startDate.setDate(now.getDate() - 7);
              params.createdAt = { gte: startDate.toISOString() };
              break;
            case 'month':
              startDate.setMonth(now.getMonth() - 1);
              params.createdAt = { gte: startDate.toISOString() };
              break;
            case 'year':
              startDate.setFullYear(now.getFullYear() - 1);
              params.createdAt = { gte: startDate.toISOString() };
              break;
          }
        }
        
        // Add search filter
        if (filters.search) {
          params.search = filters.search;
        }
        
        // Fetch ALL feedback from ALL users
        const allFeedbackResponse = await getAllFeedback(params);
        if (allFeedbackResponse?.success && Array.isArray(allFeedbackResponse.data)) {
          setAllFeedback(allFeedbackResponse.data);
        } else {
          throw new Error('Invalid response format from server');
        }
        
        // Fetch user's feedback
        if (isAuthenticated) {
          const userFeedbackResponse = await getMyFeedback();
          if (userFeedbackResponse?.success && Array.isArray(userFeedbackResponse.data)) {
            setUserFeedback(userFeedbackResponse.data);
          } else {
            setUserFeedback([]);
          }
        }
        
        // Fetch categories
        const categoriesResponse = await getAllCategories();
        if (categoriesResponse?.data && Array.isArray(categoriesResponse.data)) {
          setCategories(categoriesResponse.data);
        } else {
          setCategories([]);
        }
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch data';
        if (errorMessage.includes('500')) {
          setError('Server error. Please try again later or contact support.');
        } else if (errorMessage.includes('404')) {
          setError('Resource not found. Please check your request.');
        } else {
          setError(`Error: ${errorMessage}`);
        }
      } finally {
        setLoading(false);
      }
    };
    
    if (isAuthenticated) {
      fetchData();
    }
  }, [filters, sortOption, isAuthenticated]);
  
  
  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // Handle search input
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setFilters(prev => ({ ...prev, search: value }));
  };

  // Handle sort change
  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  // Handle view mode toggle
  const toggleViewMode = () => {
    setViewMode(prev => prev === 'cards' ? 'table' : 'cards');
  };
  // Reset all filters
  const resetFilters = () => {
    setFilters({
      category: '',
      dateRange: '',
      search: ''
    });
    setSortOption('-createdAt');
  };
  // Handle upvote
  const handleUpvote = async (feedbackId) => {
    try {
      const response = await api.put(`/feedback/${feedbackId}/upvote`);
      if (response.data.success) {
        // Update all feedback state
        setAllFeedback(prevFeedback => 
          prevFeedback.map(item => 
            item._id === feedbackId 
              ? { ...item, upvotes: (item.upvotes || 0) + 1 }
              : item
          )
        );
        
        // Also update user feedback if it exists there
        setUserFeedback(prevFeedback => 
          prevFeedback.map(item => 
            item._id === feedbackId 
              ? { ...item, upvotes: (item.upvotes || 0) + 1 }
              : item
          )
        );
      }
    } catch (error) {
      console.error('Error upvoting feedback:', error);
      // Show specific error message to user
      const errorMessage = error.response?.data?.message || 'Failed to upvote. Please try again.';
      setError(errorMessage);
    }
  };

  
  return (
    <Container fluid className="dashboard-container py-4">
      <h1 className="dashboard-title mb-4">Feedback Dashboard</h1>      <Card className="welcome-card mb-4 bg-primary text-white">
        <Card.Body>
          <Row className="align-items-center">
            <Col md={8}>
              <h4 className="mb-2"><i className="fas fa-comment-dots me-2"></i>Welcome to the Feedback Hub!</h4>
              <p className="mb-0 opacity-75">Track, manage, and analyze feedback from across the organization. Use the filters below to find specific feedback or switch between different views.</p>
            </Col>
            <Col md={4} className="text-md-end mt-3 mt-md-0">
              <div className="d-flex justify-content-md-end align-items-center">
                <div className="me-4">
                  <div className="small opacity-75">Total Feedback</div>
                  <h3 className="mb-0">{allFeedback.length}</h3>
                </div>
                <div>
                  <div className="small opacity-75">My Feedback</div>
                  <h3 className="mb-0">{userFeedback.length}</h3>
                </div>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>
        {error && (
        <Card className="border-danger mb-4">
          <Card.Body>
            <div className="d-flex align-items-center mb-3">
              <div className="error-icon-wrapper me-3">
                <i className="fas fa-exclamation-circle text-danger fa-2x"></i>
              </div>
              <div>
                <h5 className="mb-1 text-danger">Unable to Load Data</h5>
                <p className="mb-0 text-muted">{error}</p>
              </div>
            </div>
            <Button 
              variant="danger" 
              size="sm"
              className="me-2"
              onClick={() => window.location.reload()}
            >
              <i className="fas fa-sync-alt me-2"></i>
              Retry
            </Button>
            <Button 
              variant="outline-secondary" 
              size="sm"
              onClick={resetFilters}
            >
              <i className="fas fa-filter-circle-xmark me-2"></i>
              Reset Filters
            </Button>
          </Card.Body>
        </Card>
      )}
      
      {process.env.NODE_ENV === 'development' && (
        <div className="mb-3">
          <Alert variant="light" className="p-2">
            <small className="text-muted">
              <strong>Debug Info:</strong> {allFeedback.length} total feedback items, {userFeedback.length} personal feedback items, {categories.length} categories
              {allFeedback.length > 0 && (
                <div>
                  <strong>Feedback from users:</strong> {[...new Set(allFeedback.map(f => f.user?.name).filter(Boolean))].join(', ')}
                </div>
              )}
            </small>
          </Alert>
        </div>
      )}
      
      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="mb-4 dashboard-tabs"
      >
        <Tab eventKey="overview" title="Overview">
          <DashboardStats 
            feedbackItems={allFeedback} 
            myFeedbackItems={userFeedback} 
            categories={categories}
          />
        </Tab>
        <Tab eventKey="feedback" title={<span><i className="fas fa-list me-1"></i> All Feedback <Badge bg="info">{allFeedback.length}</Badge></span>}>          <Card className="mb-4 filter-card shadow-sm">
            <Card.Body className="p-4">
              <h5 className="text-muted mb-4">
                <i className="fas fa-filter me-2"></i>
                Filter & Sort Feedback
              </h5>
              <Row className="align-items-end gx-4">
                <Col md={3} className="mb-3 mb-md-0">
                  <Form.Group>
                    <Form.Label className="text-muted small">
                      <i className="fas fa-search me-2"></i>Search
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Search by title or description..."
                      name="search"
                      value={filters.search}
                      onChange={handleSearchChange}
                      className="border-0 border-bottom rounded-0"
                    />
                  </Form.Group>
                </Col>
                  <Col md={2} className="mb-3 mb-md-0">
                  <Form.Group>
                    <Form.Label className="text-muted small">
                      <i className="fas fa-tag me-2"></i>Category
                    </Form.Label>
                    <Form.Select
                      name="category"
                      value={filters.category}
                      onChange={handleFilterChange}
                      className="border-0 border-bottom rounded-0"
                    >
                      <option value="">All Categories</option>
                      {categories.map(category => (
                        <option key={category._id} value={category._id}>
                          {category.name}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                
                <Col md={2} className="mb-3 mb-md-0">
                  <Form.Group>
                    <Form.Label className="text-muted small">
                      <i className="fas fa-calendar me-2"></i>Time Period
                    </Form.Label>
                    <Form.Select
                      name="dateRange"
                      value={filters.dateRange}
                      onChange={handleFilterChange}
                      className="border-0 border-bottom rounded-0"
                    >
                      <option value="">All Time</option>
                      <option value="today">Today</option>
                      <option value="week">This Week</option>
                      <option value="month">This Month</option>
                      <option value="year">This Year</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                
                <Col md={2} className="mb-3 mb-md-0">
                  <Form.Group>
                    <Form.Label className="text-muted small">
                      <i className="fas fa-sort me-2"></i>Sort By
                    </Form.Label>
                    <Form.Select
                      name="sort"
                      value={sortOption}
                      onChange={handleSortChange}
                      className="border-0 border-bottom rounded-0"
                    >
                      <option value="-createdAt">Newest First</option>
                      <option value="createdAt">Oldest First</option>
                      <option value="-upvotes">Most Upvotes</option>
                      <option value="upvotes">Least Upvotes</option>
                      <option value="title">Title (A-Z)</option>
                      <option value="-title">Title (Z-A)</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                  <Col md={3} className="d-flex justify-content-end align-items-end">
                  <div className="btn-group">
                    <Button
                      variant="light"
                      className="d-flex align-items-center"
                      onClick={resetFilters}
                      title="Reset all filters"
                    >
                      <i className="fas fa-filter-circle-xmark me-2"></i>
                      Reset
                    </Button>
                    <Button
                      variant={viewMode === 'cards' ? 'primary' : 'light'}
                      className="d-flex align-items-center"
                      onClick={() => setViewMode('cards')}
                      title="Card view"
                    >
                      <i className="fas fa-th-large"></i>
                    </Button>
                    <Button
                      variant={viewMode === 'table' ? 'primary' : 'light'}
                      className="d-flex align-items-center"
                      onClick={() => setViewMode('table')}
                      title="Table view"
                    >
                      <i className="fas fa-list"></i>
                    </Button>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
            {loading ? (
            <div className="text-center my-5 py-5">
              <div className="loading-animation mb-3">
                <Spinner animation="border" variant="primary" role="status" className="me-2">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </div>
              <p className="text-muted">Loading feedback data...</p>
            </div>
          ) : (
            <>
              {allFeedback.length === 0 ? (<Alert variant="info">
                  <p>No feedback items found matching your current filters.</p>
                  <p className="mb-0">
                    Try adjusting your search criteria or resetting the filters.
                  </p>
                  <Button variant="outline-secondary" className="mt-3" onClick={resetFilters}>
                    <i className="fas fa-sync-alt me-2"></i>Reset Filters
                  </Button>
                </Alert>
              ) : (
                <div className="feedback-container">
                  {viewMode === 'cards' ? (
                    <Row xs={1} md={2} lg={3} className="g-4">
                      {allFeedback.map(feedback => (
                        <Col key={feedback._id}>
                          <FeedbackCard 
                            feedback={feedback} 
                            onUpvote={handleUpvote}
                          />
                        </Col>
                      ))}
                    </Row>
                  ) : (
                    <FeedbackTable 
                      feedback={allFeedback}
                      onUpvote={handleUpvote}
                    />
                  )}
                </div>
              )}
            </>
          )}
        </Tab>
        <Tab eventKey="analytics" title="Analytics">
          <FeedbackCharts 
            feedbackItems={allFeedback} 
            categories={categories} 
          />
        </Tab>
        <Tab eventKey="my-feedback" title={<span><i className="fas fa-user me-1"></i> My Feedback <Badge bg="secondary">{userFeedback.length}</Badge></span>}>
          {loading ? (
            <div className="text-center my-5">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : (
            <>
              {userFeedback.length === 0 ? (
                <Alert variant="info">
                  You haven't submitted any feedback yet.
                </Alert>
              ) : (
                <Row xs={1} md={2} lg={3} className="g-4">
                  {userFeedback.map(feedback => (
                    <Col key={feedback._id}>
                      <FeedbackCard feedback={feedback} />
                    </Col>
                  ))}
                </Row>
              )}
            </>
          )}
        </Tab>
      </Tabs>
    </Container>
  );
};

export default Dashboard;


// and in overview also, show category distribution instead of status distribution and make the highlights most upvoted feedback and please implement a feature where user can upvote the feedback from the /dashboard under all feedback.