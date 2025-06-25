import React from 'react';
import { Table, Badge, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { timeAgo, truncateText } from '../../utils/formatUtils';

const FeedbackTable = ({ feedback = [] }) => {
  // Ensure feedback is an array
  const feedbackArray = Array.isArray(feedback) ? feedback : [];
  // Determine status badge color
  const getBadgeVariant = (status) => {
    switch (status) {
      case 'open':
        return 'primary';
      case 'in-progress':
        return 'warning';
      case 'resolved':
        return 'success';
      case 'closed':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  // Format the status text for display
  const formatStatus = (status) => {
    return status
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="table-responsive">
      <Table hover className="table-feedback align-middle">
        <thead>
          <tr>
            <th>Title</th>
            <th className="category-col">Category</th>
            <th className="upvotes-col">Upvotes</th>
            <th className="date-col">Created</th>
          </tr>
        </thead>
        <tbody>
          {feedbackArray.map(item => (
            <tr key={item._id}>
              <td>
                <div>
                  <Link to={`/feedback/${item._id}`} className="fw-semibold text-decoration-none">
                    {truncateText(item.title || 'Untitled', 50)}
                  </Link>
                  <div className="text-muted small">
                    {truncateText(item.description || 'No description', 70)}
                  </div>                  <div className="small text-muted mt-1">
                    <span>By {item.user?.name || 'Anonymous'}</span>
                    <span className="ms-2">
                      <i className="far fa-comment me-1"></i>
                      {Array.isArray(item.comments) ? item.comments.length : 0}
                    </span>
                  </div>
                </div>
              </td><td className="category-col">
                <Badge bg="info" pill>
                  {item.category && typeof item.category === 'object' 
                    ? item.category.name 
                    : 'Uncategorized'}
                </Badge>
              </td>
              <td className="upvotes-col text-center">
                <span className="fw-semibold">
                  <i className="fas fa-arrow-up text-primary me-1"></i>
                  {item.upvotes || 0}
                </span>
              </td><td className="date-col small">
                {item.createdAt ? timeAgo(item.createdAt) : 'Unknown date'}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default FeedbackTable;
