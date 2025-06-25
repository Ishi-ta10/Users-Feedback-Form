const { cloudinary } = require('../config/cloudinary');

// @desc    Upload image
// @route   POST /api/uploads
// @access  Private
exports.uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an image file'
      });
    }

    // File uploaded successfully, return response
    res.status(200).json({
      success: true,
      data: {
        public_id: req.file.filename,
        url: req.file.path
      }
    });
  } catch (err) {
    console.error('Error uploading image:', err);
    next(err);
  }
};

// @desc    Delete image from cloudinary
// @access  Private (internal function)
exports.deleteImage = async (publicId) => {
  try {
    if (!publicId) return;
    
    await cloudinary.uploader.destroy(publicId);
    return true;
  } catch (err) {
    console.error('Error deleting image from cloudinary:', err);
    return false;
  }
};
