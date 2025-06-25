import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import './CommentForm.css';

const CommentForm = ({ onSubmit, feedbackId }) => {
  const [commentText, setCommentText] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isAuthenticated } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!commentText.trim()) {
      setError('Comment cannot be empty');
      return;
    }
    
    try {
      setIsSubmitting(true);
      await onSubmit({ text: commentText.trim() });
      setCommentText('');
      setError('');
    } catch (err) {
      setError('Failed to post comment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="comment-form-container">
        <Alert variant="info">
          Please <a href="/login">login</a> to leave a comment.
        </Alert>
      </div>
    );
  }

  return (
    <div className="comment-form-container">
      <h5 className="mb-3">Leave a Comment</h5>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Share your thoughts..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
        </Form.Group>
        
        <div className="d-flex justify-content-end">
          <Button 
            variant="primary" 
            type="submit" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Posting...' : 'Post Comment'}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default CommentForm;
