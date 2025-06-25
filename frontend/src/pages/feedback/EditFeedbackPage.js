import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Alert, Button, Spinner } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import FeedbackForm from '../../components/feedback/FeedbackForm';
import { getAllCategories } from '../../services/categoryService';
import { getFeedbackById, updateFeedback } from '../../services/feedbackService';
import { useAuth } from '../../context/AuthContext';
import './FeedbackFormPage.css';

const EditFeedbackPage = () => {
  const { id } = useParams();
  const [feedback, setFeedback] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  // Load feedback and categories on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch feedback details
        const feedbackResponse = await getFeedbackById(id);
        setFeedback(feedbackResponse.data);
        
        // Fetch categories
        const categoriesResponse = await getAllCategories();
        setCategories(categoriesResponse.data);
        
        setError('');
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load feedback details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id]);

  // Check if user is authorized to edit this feedback
  useEffect(() => {
    if (!loading && feedback && isAuthenticated) {
      const isOwner = user && user.id === feedback.user._id;
      const isAdmin = user && user.role === 'admin';
      
      if (!isOwner && !isAdmin) {
        navigate(`/feedback/${id}`);
      }
    }
  }, [feedback, isAuthenticated, user, id, loading, navigate]);
  // Handle form submission
  const handleSubmit = async (values, formikBag) => {
    try {
      const response = await updateFeedback(id, values);
      
      if (response.success) {
        navigate(`/feedback/${id}`);
      }
    } catch (err) {
      console.error('Error updating feedback:', err);
      setError(
        err.response?.data?.message || 
        'Failed to update feedback. Please try again.'
      );
      if (typeof formikBag.setSubmitting === 'function') {
        formikBag.setSubmitting(false);
      }
    }
  };

  if (loading) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (!feedback) {
    return (
      <Container className="my-5">
        <Alert variant="warning">Feedback not found.</Alert>
        <Button as={Link} to="/feedback" variant="primary">
          Back to Feedback List
        </Button>
      </Container>
    );
  }

  const initialValues = {
    title: feedback.title,
    description: feedback.description,
    category: feedback.category._id,
    status: feedback.status
  };

  return (
    <Container className="feedback-form-page py-4">
      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <Button as={Link} to={`/feedback/${id}`} variant="outline-secondary">
              <i className="fas fa-arrow-left me-2"></i>
              Back to Feedback
            </Button>
          </div>
          
          <Card className="form-card">
            <Card.Body className="p-4 p-md-5">
              <h1 className="mb-4">Edit Feedback</h1>
              
              {error && <Alert variant="danger">{error}</Alert>}
              
              <FeedbackForm 
                initialValues={initialValues}
                onSubmit={handleSubmit} 
                categories={categories} 
                isEditing={true}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default EditFeedbackPage;
