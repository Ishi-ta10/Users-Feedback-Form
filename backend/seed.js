const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

// Load models
const User = require('./models/User');
const Category = require('./models/Category');
const Feedback = require('./models/Feedback');
const Comment = require('./models/Comment');

// Load env vars
dotenv.config();

// Connect to DB
mongoose.connect(process.env.MONGO_URI);

// Generate salt for password hashing
const salt = bcrypt.genSaltSync(10);

// Create seed data
const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Category.deleteMany();
    await Feedback.deleteMany();
    await Comment.deleteMany();

    console.log('Data cleared...');

    // Create users
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: bcrypt.hashSync('123456', salt),
      role: 'admin'
    });

    const regularUser1 = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: bcrypt.hashSync('123456', salt)
    });

    const regularUser2 = await User.create({
      name: 'Jane Smith',
      email: 'jane@example.com',
      password: bcrypt.hashSync('123456', salt)
    });

    console.log('Users created...');

    // Create categories
    const featureCategory = await Category.create({
      name: 'Feature Request',
      description: 'Suggestions for new features or enhancements'
    });

    const bugCategory = await Category.create({
      name: 'Bug Report',
      description: 'Report issues or bugs in the application'
    });

    const uiCategory = await Category.create({
      name: 'UI Improvement',
      description: 'Suggestions to improve the user interface'
    });

    const positiveCategory = await Category.create({
      name: 'Positive Feedback',
      description: 'Share positive experiences or praise about the system'
    });

    console.log('Categories created...');

    // Create feedback
    const feedback1 = await Feedback.create({
      title: 'Add dark mode support',
      description: 'It would be great to have a dark mode option for better visibility in low light conditions.',
      category: uiCategory._id,
      user: regularUser1._id
    });

    const feedback2 = await Feedback.create({
      title: 'Login page error',
      description: 'Sometimes the login page shows an error when entering correct credentials.',
      category: bugCategory._id,
      user: regularUser2._id,
      status: 'in-progress'
    });

    const feedback3 = await Feedback.create({
      title: 'Add export to PDF feature',
      description: 'It would be useful to export the feedback reports to PDF format.',
      category: featureCategory._id,
      user: regularUser1._id
    });

    console.log('Feedback created...');

    // Create comments
    await Comment.create({
      text: 'I agree, dark mode would be a great addition!',
      user: regularUser2._id,
      feedback: feedback1._id
    });

    await Comment.create({
      text: 'We are working on fixing this issue. Thanks for reporting.',
      user: adminUser._id,
      feedback: feedback2._id
    });

    await Comment.create({
      text: 'This feature would be very helpful for our team.',
      user: regularUser2._id,
      feedback: feedback3._id
    });

    await Comment.create({
      text: 'We\'ll consider adding this in our next release.',
      user: adminUser._id,
      feedback: feedback3._id
    });

    console.log('Comments created...');
    console.log('Data seeding completed!');

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedData();
