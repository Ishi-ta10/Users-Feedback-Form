import React from 'react';
import { Card, Badge, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { timeAgo } from '../../utils/formatUtils';
import './FeedbackCard.css';

const FeedbackCard = ({ feedback, onUpvote }) => {
  return (
    <Card className="feedback-card h-100 shadow-sm hover-effect">
      <Card.Body className="d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <Badge bg="info" className="category-badge">
            {feedback.category?.name || 'Uncategorized'}
          </Badge>
          <div className="upvote-button">
            <Button
              variant="outline-primary"
              size="sm"
              onClick={() => onUpvote(feedback._id)}
              className="d-flex align-items-center"
            >
              <i className="fas fa-arrow-up me-1"></i>
              {feedback.upvotes || 0}
            </Button>
          </div>
        </div>

        <Link to={`/feedback/${feedback._id}`} className="text-decoration-none">
          <Card.Title className="feedback-title text-primary mb-3">
            {feedback.title}
          </Card.Title>
        </Link>

        <Card.Text className="text-muted feedback-description mb-3">
          {feedback.description?.length > 150
            ? `${feedback.description.substring(0, 150)}...`
            : feedback.description}
        </Card.Text>

        <div className="mt-auto">
          <div className="d-flex justify-content-between align-items-center">
            <div className="user-info d-flex align-items-center">
              <div className="user-avatar me-2">
                {feedback.user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="small">
                <div className="fw-bold">{feedback.user?.name}</div>
                <div className="text-muted">{timeAgo(feedback.createdAt)}</div>
              </div>
            </div>
            <div className="d-flex align-items-center">
              <span className="text-muted small me-3">
                <i className="far fa-comment me-1"></i>
                {feedback.comments?.length || 0}
              </span>
            </div>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default FeedbackCard;
