import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { login, googleLogin } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
import { auth, googleProvider } from '../../config/firebase';
import { signInWithPopup } from 'firebase/auth';
import './AuthPages.css';

// Validation schema for login form
const validationSchema = Yup.object({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .required('Password is required')
});

const LoginPage = () => {
  const [error, setError] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await login(values);
      
      if (response.success) {
        authLogin(response.user, response.token);
        navigate('/');
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 
        'Login failed. Please check your credentials and try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setError('');
      setGoogleLoading(true);
      
      // Sign in with Google using Firebase Authentication
      const result = await signInWithPopup(auth, googleProvider);
      
      // Get the ID token
      const idToken = await result.user.getIdToken();
      
      // Send the token to your backend
      const response = await googleLogin(idToken);
      
      if (response.success) {
        authLogin(response.user, response.token);
        navigate('/');
      }
    } catch (err) {
      console.error('Google login error:', err);
      setError(
        err.response?.data?.message || 
        'Google login failed. Please try again.'
      );
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <Container className="auth-container">
      <Row className="justify-content-center">
        <Col md={6} lg={5}>
          <Card className="auth-card">
            <Card.Body className="p-4 p-md-5">
              <div className="text-center mb-4">
                <h2 className="auth-title">Welcome Back!</h2>
                <p className="auth-subtitle">Login to your account</p>
              </div>

              {error && <Alert variant="danger">{error}</Alert>}

              <Formik
                initialValues={{ email: '', password: '' }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
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
                      <Form.Label>Email address</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.email && errors.email}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.email}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="password"
                        placeholder="Enter your password"
                        value={values.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.password && errors.password}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.password}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Button 
                      variant="primary" 
                      type="submit" 
                      className="w-100 mb-3"
                      disabled={isSubmitting || googleLoading}
                    >
                      {isSubmitting ? 'Logging in...' : 'Login'}
                    </Button>
                    
                    <div className="or-divider my-3">
                      <span>OR</span>
                    </div>
                    
                    <Button 
                      variant="outline-danger" 
                      className="w-100 d-flex align-items-center justify-content-center" 
                      onClick={handleGoogleLogin}
                      disabled={isSubmitting || googleLoading}
                      type="button"
                    >
                      <i className="fab fa-google me-2"></i>
                      {googleLoading ? 'Connecting...' : 'Sign in with Google'}
                    </Button>

                    <div className="text-center mt-3">
                      <p className="mb-0">
                        Don't have an account? <Link to="/register">Register now</Link>
                      </p>
                    </div>
                  </Form>
                )}
              </Formik>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;
