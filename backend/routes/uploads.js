const express = require('express');
const router = express.Router();
const { upload } = require('../config/cloudinary');
const { protect } = require('../middleware/auth');
const { uploadImage } = require('../controllers/uploads');

// Upload image route
router.post('/', protect, upload.single('image'), uploadImage);

module.exports = router;
