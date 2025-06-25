const Feedback = require('../models/Feedback');
const Comment = require('../models/Comment');

// @desc    Get all feedback
// @route   GET /api/feedback
// @access  Public
exports.getAllFeedback = async (req, res, next) => {
  try {
    console.log('Received request for all feedback with query params:', req.query);
    console.log('This endpoint returns ALL feedback from ALL users without any filtering by user');
    let query;
    
    // Copy req.query
    const reqQuery = { ...req.query };
    
    // Fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit', 'search'];
    
    // Loop over removeFields and delete them from reqQuery
    removeFields.forEach(param => delete reqQuery[param]);
    
    // Remove empty string or 'all' values to prevent CastError
    Object.keys(reqQuery).forEach(key => {
      if (reqQuery[key] === '' || reqQuery[key] === 'all') {
        delete reqQuery[key];
      }
    });
    
    // Handle createdAt date ranges if they exist
    if (req.query.createdAt) {
      const createdAtQuery = {};
      const createdAt = JSON.parse(req.query.createdAt);
      
      if (createdAt.gte) createdAtQuery.$gte = new Date(createdAt.gte);
      if (createdAt.lte) createdAtQuery.$lte = new Date(createdAt.lte);
      
      reqQuery.createdAt = createdAtQuery;
    }

    // Create query string
    let queryStr = JSON.stringify(reqQuery);
    
    // Create operators ($gt, $gte, etc)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
    
    console.log('Query parameters after processing:', JSON.parse(queryStr));
    
    // Create base query
    const baseQuery = JSON.parse(queryStr);
    
    // Add search functionality if search parameter exists
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      baseQuery.$or = [
        { title: searchRegex },
        { description: searchRegex }
      ];
    }
    
    // Finding resource with all filters applied
    query = Feedback.find(baseQuery)
      .populate({
        path: 'user',
        select: 'name avatar email'
      })
      .populate('category', 'name')
      .populate({
        path: 'comments',
        populate: {
          path: 'user',
          select: 'name avatar'
        }
      });
    
    // Select Fields
    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ');
      query = query.select(fields);
    }
    
    // Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }
    
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Feedback.countDocuments(baseQuery);
    query = query.skip(startIndex).limit(limit);
    
    // Executing query
    const feedback = await query;
    
    // Log the number of feedback items found
    console.log(`Found ${feedback.length} feedback items`);
    console.log('Feedback users:', feedback.map(f => f.user?.name || 'Unknown').slice(0, 5));
    console.log('Sample feedback titles:', feedback.map(f => f.title).slice(0, 5));
    
    // Pagination result
    const pagination = {};
    
    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }
    
    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }
    
    // Return the successful response with all feedback data
    res.status(200).json({
      success: true,
      count: feedback.length,
      pagination,
      data: feedback
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single feedback
// @route   GET /api/feedback/:id
// @access  Private
exports.getFeedback = async (req, res, next) => {
  try {
    console.log(`Fetching single feedback with ID: ${req.params.id}`);
    const feedback = await Feedback.findById(req.params.id)
      .populate({
        path: 'user',
        select: 'name avatar email'
      })
      .populate('category', 'name')
      .populate({
        path: 'comments',
        select: 'text createdAt',
        populate: {
          path: 'user',
          select: 'name avatar'
        }
      });
    
    if (!feedback) {
      console.log(`No feedback found with id ${req.params.id}`);
      return res.status(404).json({
        success: false,
        message: `No feedback found with id ${req.params.id}`
      });
    }
    
    console.log(`Successfully found feedback: ${feedback.title}`);
      // Anyone can view feedback details
    return res.status(200).json({
      success: true,
      data: feedback
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new feedback
// @route   POST /api/feedback
// @access  Private
exports.createFeedback = async (req, res, next) => {
  try {
    // Add user to req.body
    req.body.user = req.user.id;
    
    const feedback = await Feedback.create(req.body);
    
    res.status(201).json({
      success: true,
      data: feedback
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update feedback
// @route   PUT /api/feedback/:id
// @access  Private
exports.updateFeedback = async (req, res, next) => {
  try {
    let feedback = await Feedback.findById(req.params.id);
    
    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: `No feedback found with id ${req.params.id}`
      });
    }
    
    // Make sure user is feedback owner or admin
    if (feedback.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: `User ${req.user.id} is not authorized to update this feedback`
      });
    }
    
    feedback = await Feedback.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      data: feedback
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete feedback
// @route   DELETE /api/feedback/:id
// @access  Private
exports.deleteFeedback = async (req, res, next) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    
    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: `No feedback found with id ${req.params.id}`
      });
    }
    
    // Make sure user is feedback owner or admin
    if (feedback.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: `User ${req.user.id} is not authorized to delete this feedback`
      });
    }
    
    // Delete associated image if exists
    if (feedback.image && feedback.image.public_id) {
      const { deleteImage } = require('./uploads');
      await deleteImage(feedback.image.public_id);
    }
    
    await feedback.deleteOne();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Upvote a feedback
// @route   POST /api/feedback/:id/upvote
// @access  Private
exports.upvoteFeedback = async (req, res, next) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    
    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      });
    }

    // Check if user has already upvoted
    if (feedback.upvotedBy && feedback.upvotedBy.includes(req.user.id)) {
      return res.status(400).json({
        success: false,
        message: 'You have already upvoted this feedback'
      });
    }

    // Add user to upvotedBy array and increment upvotes
    feedback.upvotedBy = [...(feedback.upvotedBy || []), req.user.id];
    feedback.upvotes = (feedback.upvotes || 0) + 1;
    
    await feedback.save();

    res.status(200).json({
      success: true,
      data: feedback
    });
  } catch (error) {
    console.error('Error in upvoteFeedback:', error);
    res.status(500).json({
      success: false,
      message: 'Error upvoting feedback'
    });
  }
};

// @desc    Get all comments for a feedback
// @route   GET /api/feedback/:id/comments
// @access  Public
exports.getFeedbackComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ feedback: req.params.id })
      .populate({
        path: 'user',
        select: 'name'
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

// @desc    Add comment to feedback
// @route   POST /api/feedback/:id/comments
// @access  Private
exports.addFeedbackComment = async (req, res, next) => {
  try {
    req.body.feedback = req.params.id;
    req.body.user = req.user.id;
    
    const feedback = await Feedback.findById(req.params.id);
    
    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: `No feedback found with id ${req.params.id}`
      });
    }
    
    const comment = await Comment.create(req.body);
    
    res.status(201).json({
      success: true,
      data: comment
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get logged in user's feedback
// @route   GET /api/feedback/my
// @access  Private
exports.getMyFeedback = async (req, res, next) => {
  try {
    console.log('Fetching feedback for user ID:', req.user.id);
    
    const feedback = await Feedback.find({ user: req.user.id })
      .populate({
        path: 'user',
        select: 'name avatar email'
      })
      .populate('category', 'name')
      .populate({
        path: 'comments',
        populate: {
          path: 'user',
          select: 'name avatar'
        }
      })
      .sort('-createdAt');

    console.log(`Found ${feedback.length} feedback items`);
    
    res.status(200).json({
      success: true,
      count: feedback.length,
      data: feedback
    });
  } catch (err) {
    console.error('Error in getMyFeedback:', err);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};
