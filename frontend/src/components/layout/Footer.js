import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer mt-auto py-3 bg-light">      <Container>
        <Row className="align-items-center">
          <Col className="text-center">
            <span className="text-muted">
              &copy; {currentYear} Feedback Hub. All rights reserved.
            </span>
          </Col>
          {/* <Col md={6} className="text-center text-md-end">
            <div className="social-links">
              <a href="#" className="me-3">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="me-3">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="me-3">
                <i className="fab fa-linkedin-in"></i>
              </a>
              <a href="#">
                <i className="fab fa-github"></i>
              </a>
            </div>
          </Col> */}
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
