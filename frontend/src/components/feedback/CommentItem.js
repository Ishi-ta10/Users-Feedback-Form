import React, { useState } from 'react';
import { Card, Button, Form } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { timeAgo } from '../../utils/formatUtils';
import './CommentItem.css';

const CommentItem = ({ 
  comment, 
  onDelete, 
  onUpdate,
  isUserComment
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.text);
  const { user } = useAuth();

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditText(comment.text);
    setIsEditing(false);
  };

  const handleSave = () => {
    onUpdate(comment._id, { text: editText });
    setIsEditing(false);
  };

  return (
    <Card className="comment-item mb-3">
      <Card.Body>
        <div className="d-flex">
          <div className="comment-avatar me-3">
            <div className="avatar-circle">
              {comment.user?.name?.charAt(0) || 'U'}
            </div>
          </div>
          <div className="comment-content flex-grow-1">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <div>
                <h6 className="mb-0 comment-author">
                  {comment.user?.name || 'Anonymous'}
                  {isUserComment && <span className="comment-author-badge ms-2">You</span>}
                </h6>
                <small className="text-muted">{timeAgo(comment.createdAt)}</small>
              </div>
              
              {isUserComment && (
                <div className="comment-actions">
                  {!isEditing ? (
                    <>
                      <Button 
                        variant="link" 
                        size="sm" 
                        className="p-0 me-3 text-primary" 
                        onClick={handleEdit}
                      >
                        <i className="fas fa-edit"></i> Edit
                      </Button>
                      <Button 
                        variant="link" 
                        size="sm" 
                        className="p-0 text-danger" 
                        onClick={() => onDelete(comment._id)}
                      >
                        <i className="fas fa-trash"></i> Delete
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button 
                        variant="link" 
                        size="sm" 
                        className="p-0 me-3 text-success" 
                        onClick={handleSave}
                      >
                        <i className="fas fa-check"></i> Save
                      </Button>
                      <Button 
                        variant="link" 
                        size="sm" 
                        className="p-0 text-secondary" 
                        onClick={handleCancel}
                      >
                        <i className="fas fa-times"></i> Cancel
                      </Button>
                    </>
                  )}
                </div>
              )}
            </div>
            
            {isEditing ? (
              <Form.Group>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                />
              </Form.Group>
            ) : (
              <p className="mb-0 comment-text">{comment.text}</p>
            )}
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default CommentItem;
