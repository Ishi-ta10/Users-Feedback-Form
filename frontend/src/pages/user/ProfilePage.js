import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Tabs, Tab } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../context/AuthContext';
import { updateProfile } from '../../services/authService';
import { getMyFeedback } from '../../services/feedbackService';
import FeedbackCard from '../../components/feedback/FeedbackCard';
import './ProfilePage.css';

// Validation schema for profile form
const validationSchema = Yup.object({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .required('Name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
});

const ProfilePage = () => {
  const { user, isAuthenticated, login: updateAuthUser } = useAuth();
  const [userFeedback, setUserFeedback] = useState([]);
  const [error, setError] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const navigate = useNavigate();
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);  // Fetch user's feedback
  useEffect(() => {
    const fetchUserFeedback = async () => {
      if (user) {
        try {
          const response = await getMyFeedback();
          if (response.success) {
            setUserFeedback(response.data);
          }
        } catch (err) {
          console.error('Error fetching user feedback:', err);
        }
      }
    };
    
    fetchUserFeedback();
  }, [user]);

  // Handle profile update
  const handleProfileUpdate = async (values, { setSubmitting }) => {
    try {
      // Only include password if it's provided
      const updateData = {
        name: values.name,
        email: values.email
      };
      
      if (values.password) {
        updateData.password = values.password;
      }
      
      const response = await updateProfile(updateData);
      
      if (response.success) {
        // Update the user in auth context
        updateAuthUser(response.data, localStorage.getItem('token'));
        setUpdateSuccess(true);
        
        // Reset success message after 3 seconds
        setTimeout(() => {
          setUpdateSuccess(false);
        }, 3000);
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(
        err.response?.data?.message || 
        'Failed to update profile. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Handle upvote
  const handleUpvote = async (feedbackId) => {
    // This would be implemented similar to other pages
    // Omitted for brevity
  };

  if (!isAuthenticated || !user) {
    return null; // Will redirect in useEffect
  }

  return (
    <Container className="profile-page py-4">
      <h1 className="mb-4">My Profile</h1>
      
      <Tabs defaultActiveKey="profile" className="mb-4">
        <Tab eventKey="profile" title="Profile Information">
          <Card className="profile-card">
            <Card.Body className="p-4">
              <Row>
                <Col md={3} className="text-center mb-4 mb-md-0">
                  <div className="profile-avatar">
                    <span>{user.name.charAt(0)}</span>
                  </div>
                </Col>
                
                <Col md={9}>
                  {error && <Alert variant="danger">{error}</Alert>}
                  {updateSuccess && <Alert variant="success">Profile updated successfully!</Alert>}
                  
                  <Formik
                    initialValues={{
                      name: user.name,
                      email: user.email,
                      password: '',
                      confirmPassword: ''
                    }}
                    validationSchema={validationSchema}
                    onSubmit={handleProfileUpdate}
                  >
                    {({
                      values,
                      errors,
                      touched,
                      handleChange,
                      handleBlur,
                      handleSubmit,
                      isSubmitting
                    }) => (
                      <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                          <Form.Label>Name</Form.Label>
                          <Form.Control
                            type="text"
                            name="name"
                            value={values.name}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={touched.name && errors.name}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.name}
                          </Form.Control.Feedback>
                        </Form.Group>
                        
                        <Form.Group className="mb-3">
                          <Form.Label>Email</Form.Label>
                          <Form.Control
                            type="email"
                            name="email"
                            value={values.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={touched.email && errors.email}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.email}
                          </Form.Control.Feedback>
                        </Form.Group>
                        
                        <Form.Group className="mb-3">
                          <Form.Label>New Password (leave blank to keep current)</Form.Label>
                          <Form.Control
                            type="password"
                            name="password"
                            value={values.password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={touched.password && errors.password}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.password}
                          </Form.Control.Feedback>
                        </Form.Group>
                        
                        <Form.Group className="mb-4">
                          <Form.Label>Confirm New Password</Form.Label>
                          <Form.Control
                            type="password"
                            name="confirmPassword"
                            value={values.confirmPassword}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={touched.confirmPassword && errors.confirmPassword}
                            disabled={!values.password}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.confirmPassword}
                          </Form.Control.Feedback>
                        </Form.Group>
                        
                        <Button 
                          variant="primary" 
                          type="submit" 
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? 'Updating...' : 'Update Profile'}
                        </Button>
                      </Form>
                    )}
                  </Formik>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Tab>
        
        <Tab eventKey="feedback" title="My Feedback">
          <div className="user-feedback-list">
            {userFeedback.length === 0 ? (
              <Card className="text-center p-4">
                <p className="mb-3">You haven't submitted any feedback yet.</p>
                <Button href="/feedback/new" variant="primary">
                  Submit Your First Feedback
                </Button>
              </Card>
            ) : (
              userFeedback.map(feedback => (
                <FeedbackCard
                  key={feedback._id}
                  feedback={feedback}
                  onUpvote={handleUpvote}
                />
              ))
            )}
          </div>
        </Tab>
      </Tabs>
    </Container>
  );
};

export default ProfilePage;
