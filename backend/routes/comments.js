const express = require('express');
const {
  getComments,
  getComment,
  updateComment,
  deleteComment
} = require('../controllers/comments');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router.route('/').get(protect, authorize('admin'), getComments);

router
  .route('/:id')
  .get(getComment)
  .put(protect, updateComment)
  .delete(protect, deleteComment);

module.exports = router;
