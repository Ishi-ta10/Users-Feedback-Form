import React, { useState } from 'react';
import { Card, Row, Col, Button, Badge } from 'react-bootstrap';
import './ProfileInfo.css';

const ProfileInfo = ({ user }) => {
  const [showEditForm, setShowEditForm] = useState(false);
  
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  return (
    <Card className="profile-card shadow-sm mb-4">
      <Card.Body className="p-4">
        <Row className="align-items-center">
          <Col md={2} className="text-center">
            <div className="profile-avatar">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="rounded-circle" />
              ) : (
                <div className="avatar-placeholder">
                  {getInitials(user.name)}
                </div>
              )}
            </div>
          </Col>
          <Col md={7}>
            <h2 className="profile-name mb-2">{user.name}</h2>
            <p className="text-muted mb-2">
              <i className="fas fa-envelope me-2"></i>
              {user.email}
            </p>
            <div className="profile-stats">
              <Badge bg="primary" className="me-2">
                <i className="fas fa-comment-dots me-1"></i>
                {user.feedbackCount || 0} Feedback
              </Badge>
              <Badge bg="success" className="me-2">
                <i className="fas fa-thumbs-up me-1"></i>
                {user.upvotesReceived || 0} Upvotes Received
              </Badge>
              <Badge bg="info">
                <i className="fas fa-clock me-1"></i>
                Joined {new Date(user.createdAt).toLocaleDateString()}
              </Badge>
            </div>
          </Col>
          <Col md={3} className="text-md-end mt-3 mt-md-0">
            <Button 
              variant="outline-primary" 
              className="profile-edit-btn"
              onClick={() => setShowEditForm(true)}
            >
              <i className="fas fa-user-edit me-2"></i>
              Edit Profile
            </Button>
          </Col>
        </Row>

        <div className="profile-summary mt-4">
          <Row>
            <Col md={4}>
              <div className="stat-card">
                <div className="stat-icon">
                  <i className="fas fa-star text-warning"></i>
                </div>
                <div className="stat-info">
                  <h3>{user.topCategory || 'N/A'}</h3>
                  <p>Top Category</p>
                </div>
              </div>
            </Col>
            <Col md={4}>
              <div className="stat-card">
                <div className="stat-icon">
                  <i className="fas fa-comment-alt text-primary"></i>
                </div>
                <div className="stat-info">
                  <h3>{user.commentsCount || 0}</h3>
                  <p>Comments Made</p>
                </div>
              </div>
            </Col>
            <Col md={4}>
              <div className="stat-card">
                <div className="stat-icon">
                  <i className="fas fa-heart text-danger"></i>
                </div>
                <div className="stat-info">
                  <h3>{user.upvotesGiven || 0}</h3>
                  <p>Upvotes Given</p>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProfileInfo;
