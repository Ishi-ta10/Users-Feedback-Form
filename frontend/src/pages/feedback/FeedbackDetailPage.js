import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Badge, Card, Alert, Spinner } from 'react-bootstrap';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { getFeedbackById, upvoteFeedback, deleteFeedback } from '../../services/feedbackService';
import { getCommentsByFeedbackId, addComment, updateComment, deleteComment } from '../../services/commentService';
import CommentItem from '../../components/feedback/CommentItem';
import CommentForm from '../../components/feedback/CommentForm';
import { useAuth } from '../../context/AuthContext';
import { formatDate } from '../../utils/formatUtils';
import './FeedbackDetailPage.css';

const FeedbackDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  const [feedback, setFeedback] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Check if the current user is the owner of the feedback
  const isOwner = user && feedback && user.id === feedback.user._id;
    
  // Load feedback and comments
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Fetch feedback details
        const feedbackResponse = await getFeedbackById(id);
        if (feedbackResponse.success) {
          setFeedback(feedbackResponse.data);
          
          // Fetch comments for this feedback
          const commentsResponse = await getCommentsByFeedbackId(id);
          setComments(commentsResponse.data);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load feedback details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id]);

  // Handle upvote
  const handleUpvote = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    try {
      const response = await upvoteFeedback(id);
      setFeedback(response.data);
    } catch (err) {
      console.error('Error upvoting feedback:', err);
      setError('Failed to upvote. Please try again.');
    }
  };

  // Handle delete feedback
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this feedback?')) {
      return;
    }
    
    try {
      await deleteFeedback(id);
      navigate('/my-feedback');
    } catch (err) {
      console.error('Error deleting feedback:', err);
      setError('Failed to delete feedback. Please try again.');
    }
  };

  // Handle submit comment
  const handleCommentSubmit = async (commentData) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      const response = await addComment(id, commentData);
      setComments([...comments, response.data]);
    } catch (err) {
      console.error('Error posting comment:', err);
      throw err;
    }
  };

  // Handle update comment
  const handleCommentUpdate = async (commentId, commentData) => {
    try {
      const response = await updateComment(commentId, commentData);
      setComments(comments.map(comment => 
        comment._id === commentId ? response.data : comment
      ));
    } catch (err) {
      console.error('Error updating comment:', err);
      setError('Failed to update comment. Please try again.');
    }
  };

  // Handle delete comment
  const handleCommentDelete = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) {
      return;
    }
    
    try {
      await deleteComment(commentId);
      setComments(comments.filter(comment => comment._id !== commentId));
    } catch (err) {
      console.error('Error deleting comment:', err);
      setError('Failed to delete comment. Please try again.');
    }
  };

  if (loading) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" variant="primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="text-muted mt-3">Loading feedback details...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="my-5">
        <Alert variant="danger">
          <i className="fas fa-exclamation-circle me-2"></i>
          {error}
        </Alert>
        <Button as={Link} to="/feedback" variant="outline-primary">
          <i className="fas fa-arrow-left me-2"></i>
          Back to Feedback List
        </Button>
      </Container>
    );
  }

  if (!feedback) {
    return (
      <Container className="my-5">
        <Alert variant="warning">Feedback not found.</Alert>
        <Button as={Link} to="/feedback" variant="outline-primary">
          <i className="fas fa-arrow-left me-2"></i>
          Back to Feedback List
        </Button>
      </Container>
    );
  }

  return (
    <Container className="feedback-detail-page py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <Button as={Link} to="/feedback" variant="outline-primary">
          <i className="fas fa-arrow-left me-2"></i>
          Back to Feedback
        </Button>
        
        {isOwner && (
          <div>
            <Button 
              as={Link} 
              to={`/feedback/${id}/edit`} 
              variant="outline-primary" 
              className="me-2"
            >
              <i className="fas fa-edit me-1"></i>
              Edit
            </Button>
            <Button 
              variant="outline-danger" 
              onClick={handleDelete}
            >
              <i className="fas fa-trash me-1"></i>
              Delete
            </Button>
          </div>
        )}
      </div>
      
      <Card className="feedback-detail-card mb-4">
        <Card.Body>
          <Row>
            <Col md={9}>
              <h1 className="feedback-title mb-3">{feedback.title}</h1>
              
              <div className="feedback-meta mb-3">
                <span className="me-3">
                  <i className="fas fa-user me-1"></i>
                  <strong>By:</strong> {feedback.user.name}
                </span>
                <span className="me-3">
                  <i className="fas fa-calendar me-1"></i>
                  <strong>Date:</strong> {formatDate(feedback.createdAt)}
                </span>
              </div>
              
              <div className="mb-4">
                <Badge bg="info" className="me-2 category-badge">
                  <i className="fas fa-tag me-1"></i>
                  {feedback.category.name}
                </Badge>
              </div>
              
              <div className="feedback-content">
                <p className="mb-0">{feedback.description}</p>
              </div>
            </Col>
            <Col md={3} className="text-md-end">
              <div className="d-flex flex-column align-items-end">
                <Button
                  variant="outline-primary"
                  onClick={handleUpvote}
                  disabled={!isAuthenticated}
                  className="mb-2 upvote-btn"
                >
                  <i className="fas fa-arrow-up me-1"></i>
                  Upvote ({feedback.upvotes || 0})
                </Button>
                
                {!isAuthenticated && (
                  <small className="text-muted">
                    <Link to="/login">Login</Link> to upvote
                  </small>
                )}
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>
      
      <div className="comments-section">
        <h3 className="mb-4">
          <i className="fas fa-comments me-2"></i>
          Comments {comments.length > 0 && `(${comments.length})`}
        </h3>
        
        {isAuthenticated ? (
          <Card className="mb-4">
            <Card.Body>
              <CommentForm onSubmit={handleCommentSubmit} />
            </Card.Body>
          </Card>
        ) : (
          <Alert variant="info" className="mb-4">
            <Link to="/login">Login</Link> to add a comment
          </Alert>
        )}
        
        {comments.length === 0 ? (
          <Alert variant="light" className="text-center">
            <i className="far fa-comment-dots mb-2 fs-4"></i>
            <p className="mb-0">No comments yet. Be the first to comment!</p>
          </Alert>
        ) : (
          <div className="comment-list">
            {comments.map(comment => (
              <CommentItem
                key={comment._id}
                comment={comment}
                onDelete={handleCommentDelete}
                onUpdate={handleCommentUpdate}
                isUserComment={user && comment.user._id === user.id}
              />
            ))}
          </div>
        )}
      </div>
    </Container>
  );
};

export default FeedbackDetailPage;
