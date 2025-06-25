import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { getMyFeedback } from '../../services/feedbackService';
import { getAllCategories } from '../../services/categoryService';
import FeedbackCard from '../../components/feedback/FeedbackCard';
import ProfileInfo from '../../components/profile/ProfileInfo';
import './MyFeedbackPage.css';

const MyFeedbackPage = () => {
  const [feedback, setFeedback] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    search: '',
    sortBy: 'newest'
  });

  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');

        const [feedbackResponse, categoriesResponse] = await Promise.all([
          getMyFeedback(),
          getAllCategories()
        ]);

        setFeedback(feedbackResponse.data);
        setCategories(categoriesResponse.data);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load your feedback. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const filteredFeedback = feedback
    .filter(item => {
      const matchesCategory = !filters.category || item.category._id === filters.category;
      const matchesSearch = !filters.search || 
        item.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        item.description.toLowerCase().includes(filters.search.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      switch (filters.sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'most-upvotes':
          return (b.upvotes || 0) - (a.upvotes || 0);
        case 'least-upvotes':
          return (a.upvotes || 0) - (b.upvotes || 0);
        default:
          return 0;
      }
    });

  return (
    <Container className="my-feedback-page py-4">
      <ProfileInfo user={user} />

      <Card className="filter-card shadow-sm mb-4">
        <Card.Body>
          <h5 className="text-muted mb-3">
            <i className="fas fa-filter me-2"></i>
            Filter Your Feedback
          </h5>
          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Search</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Search by title or description..."
                  name="search"
                  value={filters.search}
                  onChange={handleFilterChange}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
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
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Sort By</Form.Label>
                <Form.Select
                  name="sortBy"
                  value={filters.sortBy}
                  onChange={handleFilterChange}
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="most-upvotes">Most Upvotes</option>
                  <option value="least-upvotes">Least Upvotes</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {error && (
        <Alert variant="danger" className="mb-4">
          <i className="fas fa-exclamation-circle me-2"></i>
          {error}
        </Alert>
      )}

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="text-muted mt-3">Loading your feedback...</p>
        </div>
      ) : (
        <>
          {filteredFeedback.length === 0 ? (
            <Alert variant="info" className="text-center">
              <i className="fas fa-info-circle me-2"></i>
              No feedback found matching your filters.
            </Alert>
          ) : (
            <Row xs={1} md={2} lg={3} className="g-4">
              {filteredFeedback.map(item => (
                <Col key={item._id}>
                  <FeedbackCard feedback={item} />
                </Col>
              ))}
            </Row>
          )}
        </>
      )}
    </Container>
  );
};

export default MyFeedbackPage;
