import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Alert, Button, Badge } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import FeedbackForm from '../../components/feedback/FeedbackForm';
import { getAllCategories } from '../../services/categoryService';
import { createFeedback } from '../../services/feedbackService';
import { useAuth } from '../../context/AuthContext';
import './FeedbackFormPage.css';

const NewFeedbackPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Load categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await getAllCategories();
        setCategories(response.data);
        setError('');
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to load categories. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCategories();
  }, []);

  // Handle form submission
  const handleSubmit = async (values, formikBag) => {
    try {
      setSuccessMessage('');
      const response = await createFeedback(values);
      
      if (response.success) {
        setSuccessMessage('Feedback submitted successfully! Redirecting...');
        
        // If resetForm is available, use it
        if (typeof formikBag.resetForm === 'function') {
          formikBag.resetForm();
        }
        
        // Navigate after a short delay to show the success message
        setTimeout(() => {
          navigate(`/feedback/${response.data._id}`);
        }, 1500);
      }
    } catch (err) {
      console.error('Error creating feedback:', err);
      setError(
        err.response?.data?.message || 
        'Failed to submit feedback. Please try again.'
      );
      if (typeof formikBag.setSubmitting === 'function') {
        formikBag.setSubmitting(false);
      }
    }
  };

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return (
    <Container className="feedback-form-page py-4 animate__animated animate__fadeIn">
      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <Button 
              as={Link} 
              to="/feedback" 
              variant="outline-secondary"
              className="back-button"
            >
              <i className="fas fa-arrow-left me-2"></i>
              Back to Feedback
            </Button>
            
            <Badge bg="primary" className="d-none d-sm-block">
              New Submission
            </Badge>
          </div>
          
          <Card className="form-card">
            <Card.Body className="p-4 p-md-5">
              <div className="text-center mb-4">
                <div className="d-inline-block p-3 rounded-circle bg-primary bg-opacity-10 mb-3">
                  <i className="fas fa-lightbulb text-primary" style={{ fontSize: '2rem' }}></i>
                </div>
                <h1 className="mb-2">Share Your Feedback</h1>
                <p className="text-muted">
                  Your ideas help us improve our products and services.
                  We appreciate your input!
                </p>
                {user && (
                  <div className="submitted-by mt-2">
                    <small className="text-muted">
                      Submitting as <span className="fw-bold">{user.name || user.email}</span>
                    </small>
                  </div>
                )}
              </div>
              
              {error && (
                <Alert 
                  variant="danger" 
                  dismissible 
                  onClose={() => setError('')}
                  className="animate__animated animate__fadeIn"
                >
                  <i className="fas fa-exclamation-circle me-2"></i>
                  {error}
                </Alert>
              )}
              
              {successMessage && (
                <Alert 
                  variant="success"
                  className="animate__animated animate__fadeIn"
                >
                  <i className="fas fa-check-circle me-2"></i>
                  {successMessage}
                </Alert>
              )}
              
              {loading ? (
                <div className="text-center py-5 animate__animated animate__fadeIn">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <div className="mt-3">Loading categories...</div>
                </div>
              ) : (
                <FeedbackForm 
                  onSubmit={handleSubmit} 
                  categories={categories} 
                  isEditing={false}
                />
              )}
            </Card.Body>
          </Card>
          
          <div className="text-center text-muted mt-4">
            <small>
              <i className="fas fa-shield-alt me-1"></i>
              Your feedback is secure and will only be visible to authorized personnel.
            </small>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default NewFeedbackPage;
