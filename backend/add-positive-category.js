const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('./models/Category');

// Load env vars
dotenv.config();

// Connect to DB
mongoose.connect(process.env.MONGO_URI);

const addPositiveFeedbackCategory = async () => {
  try {
    // Check if the category already exists
    const existingCategory = await Category.findOne({ name: 'Positive Feedback' });
    
    if (existingCategory) {
      console.log('Positive Feedback category already exists.');
      process.exit();
    }
    
    // Create the new category
    await Category.create({
      name: 'Positive Feedback',
      description: 'Share positive experiences or praise about the system'
    });
    
    console.log('Positive Feedback category created successfully!');
    process.exit();
  } catch (err) {
    console.error('Error adding category:', err);
    process.exit(1);
  }
};

addPositiveFeedbackCategory();
