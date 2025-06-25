import React from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="home-page">
      <section className="hero-section text-center py-5">
        <Container>
          <Row className="justify-content-center">
            <Col md={8} lg={6}>
              <h1 className="hero-title mb-4">
                Your Voice <span className="text-primary">Matters</span>
              </h1>
              <p className="hero-subtitle mb-4">
                Welcome to Feedback Hub, where your ideas shape our future. 
                Share feedback, suggest features, and help us build a better product together.
              </p>              <div className="hero-buttons">
                <Button 
                  as={Link} 
                  to="/my-feedback" 
                  variant="primary" 
                  size="lg" 
                  className="me-3"
                >
                  My Feedback
                </Button>
                <Button 
                  as={Link} 
                  to="/feedback/new" 
                  variant="outline-primary" 
                  size="lg"
                >
                  Submit Feedback
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="features-section py-5 bg-light">
        <Container>
          <h2 className="text-center mb-5">How It Works</h2>
          <Row>
            <Col md={4} className="mb-4">
              <Card className="feature-card h-100">
                <Card.Body className="text-center">
                  <div className="feature-icon mb-3">
                    <i className="fas fa-lightbulb"></i>
                  </div>
                  <Card.Title>Share Your Ideas</Card.Title>
                  <Card.Text>
                    Submit your feedback, feature requests, and suggestions to help us improve.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={4} className="mb-4">
              <Card className="feature-card h-100">
                <Card.Body className="text-center">
                  <div className="feature-icon mb-3">
                    <i className="fas fa-thumbs-up"></i>
                  </div>
                  <Card.Title>Vote and Comment</Card.Title>
                  <Card.Text>
                    Upvote ideas you like and engage in discussions with other community members.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={4} className="mb-4">
              <Card className="feature-card h-100">
                <Card.Body className="text-center">
                  <div className="feature-icon mb-3">
                    <i className="fas fa-check-circle"></i>
                  </div>
                  <Card.Title>See Implementation</Card.Title>
                  <Card.Text>
                    Watch as your top-voted ideas get implemented and make a real impact.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="cta-section py-5">
        <Container className="text-center">
          <h2 className="mb-4">Ready to Share Your Feedback?</h2>
          <p className="mb-4">
            Join our community and help shape the future of our product with your valuable input.
          </p>
          <Button 
            as={Link} 
            to="/register" 
            variant="primary" 
            size="lg"
          >
            Get Started
          </Button>
        </Container>
      </section>
    </div>
  );
};

export default HomePage;
