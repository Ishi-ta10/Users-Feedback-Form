const Comment = require('../models/Comment');
const Feedback = require('../models/Feedback');

// @desc    Get all comments
// @route   GET /api/comments
// @access  Private/Admin
exports.getComments = async (req, res, next) => {
  try {
    const comments = await Comment.find().populate({
      path: 'user',
      select: 'name'
    }).populate({
      path: 'feedback',
      select: 'title'
    });

    res.status(200).json({
      success: true,
      count: comments.length,
      data: comments
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single comment
// @route   GET /api/comments/:id
// @access  Public
exports.getComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id).populate({
      path: 'user',
      select: 'name'
    }).populate({
      path: 'feedback',
      select: 'title'
    });

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: `No comment found with id ${req.params.id}`
      });
    }

    res.status(200).json({
      success: true,
      data: comment
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update comment
// @route   PUT /api/comments/:id
// @access  Private
exports.updateComment = async (req, res, next) => {
  try {
    let comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: `No comment found with id ${req.params.id}`
      });
    }

    // Make sure user is comment owner or admin
    if (comment.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: `User ${req.user.id} is not authorized to update this comment`
      });
    }

    comment = await Comment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: comment
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete comment
// @route   DELETE /api/comments/:id
// @access  Private
exports.deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: `No comment found with id ${req.params.id}`
      });
    }

    // Make sure user is comment owner or admin
    if (comment.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: `User ${req.user.id} is not authorized to delete this comment`
      });
    }

    await comment.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};
