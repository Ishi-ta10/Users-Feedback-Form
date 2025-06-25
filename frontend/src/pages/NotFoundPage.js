import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './NotFoundPage.css';

const NotFoundPage = () => {
  return (
    <Container className="not-found-page text-center py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <div className="error-code">404</div>
          <h1 className="mb-4">Page Not Found</h1>
          <p className="mb-4">
            Oops! The page you are looking for doesn't exist or has been moved.
          </p>
          <Button as={Link} to="/" variant="primary" size="lg">
            Go to Homepage
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default NotFoundPage;
