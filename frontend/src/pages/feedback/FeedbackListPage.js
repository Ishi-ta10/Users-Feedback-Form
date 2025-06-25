import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import FeedbackCard from '../../components/feedback/FeedbackCard';
import { getAllFeedback, upvoteFeedback } from '../../services/feedbackService';
import { getAllCategories } from '../../services/categoryService';
import { useAuth } from '../../context/AuthContext';
import './FeedbackListPage.css';

const FeedbackListPage = () => {
  const [feedbackItems, setFeedbackItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    status: '',
    sort: '-upvotes'
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    hasMore: false
  });
  
  const { isAuthenticated, user } = useAuth();

  // Load feedback and categories on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch feedback with filters and pagination
        const params = {
          ...filters,
          page: pagination.page,
          limit: pagination.limit
        };
        
        const feedbackResponse = await getAllFeedback(params);
        setFeedbackItems(feedbackResponse.data);
        setPagination(prev => ({
          ...prev,
          hasMore: !!feedbackResponse.pagination?.next
        }));
        
        // Fetch categories
        const categoriesResponse = await getAllCategories();
        setCategories(categoriesResponse.data);
        
        setError('');
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load feedback. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [filters, pagination.page, pagination.limit]);

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page on filter change
  };

  // Handle upvote
  const handleUpvote = async (feedbackId) => {
    if (!isAuthenticated) {
      // Redirect to login or show a message
      return;
    }
    
    try {
      const response = await upvoteFeedback(feedbackId);
      
      // Update the feedback item in state
      setFeedbackItems(prev => 
        prev.map(item => 
          item._id === feedbackId ? response.data : item
        )
      );
    } catch (err) {
      console.error('Error upvoting feedback:', err);
      setError('Failed to upvote. Please try again.');
    }
  };

  // Load more feedback
  const loadMore = () => {
    setPagination(prev => ({ ...prev, page: prev.page + 1 }));
  };

  return (
    <Container className="feedback-list-page py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Feedback</h1>
        {isAuthenticated && (
          <Button as={Link} to="/feedback/new" variant="primary">
            <i className="fas fa-plus me-2"></i>
            Submit Feedback
          </Button>
        )}
      </div>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Row className="mb-4">
        <Col md={4} lg={3}>
          <Form.Group className="mb-3">
            <Form.Label>Category</Form.Label>
            <Form.Select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
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
        
        <Col md={4} lg={3}>
          <Form.Group className="mb-3">
            <Form.Label>Status</Form.Label>
            <Form.Select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
            >
              <option value="">All Statuses</option>
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
              <option value="implemented">Implemented</option>
              <option value="closed">Closed</option>
            </Form.Select>
          </Form.Group>
        </Col>
        
        <Col md={4} lg={3}>
          <Form.Group className="mb-3">
            <Form.Label>Sort By</Form.Label>
            <Form.Select
              name="sort"
              value={filters.sort}
              onChange={handleFilterChange}
            >
              <option value="-upvotes">Most Upvotes</option>
              <option value="upvotes">Least Upvotes</option>
              <option value="-createdAt">Newest</option>
              <option value="createdAt">Oldest</option>
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>
      
      {loading && <div className="text-center my-5"><Spinner animation="border" /></div>}
      
      {!loading && feedbackItems.length === 0 && (
        <div className="text-center my-5">
          <p className="text-muted">No feedback found matching your filters.</p>
        </div>
      )}
      
      {feedbackItems.map(feedback => (
        <FeedbackCard
          key={feedback._id}
          feedback={feedback}
          onUpvote={handleUpvote}
        />
      ))}
      
      {pagination.hasMore && (
        <div className="text-center mt-4">
          <Button 
            variant="outline-primary" 
            onClick={loadMore}
            disabled={loading}
          >
            {loading ? <Spinner animation="border" size="sm" /> : 'Load More'}
          </Button>
        </div>
      )}
    </Container>
  );
};

export default FeedbackListPage;
