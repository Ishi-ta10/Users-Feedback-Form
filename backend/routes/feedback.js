const express = require('express');
const {
  getAllFeedback,
  getFeedback,
  createFeedback,
  updateFeedback,
  deleteFeedback,
  upvoteFeedback,
  getFeedbackComments,
  addFeedbackComment,
  getMyFeedback
} = require('../controllers/feedback');

const router = express.Router();

const { protect } = require('../middleware/auth');

// My feedback route - must be before the generic routes
router.route('/my').get(protect, getMyFeedback);

// Public route to get all feedback
router
  .route('/')
  .get(getAllFeedback)  // Public access
  .post(protect, createFeedback);  // Protected access

router
  .route('/:id')
  .get(getFeedback) // Public access to view feedback
  .put(protect, updateFeedback)
  .delete(protect, deleteFeedback);

router.route('/:id/upvote').put(protect, upvoteFeedback);

router
  .route('/:id/comments')
  .get(getFeedbackComments)
  .post(protect, addFeedbackComment);

module.exports = router;
