const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://user-feedback-system-eosin.vercel.app',
    'https://feedbacksystem.ishitasingh.live'
  ],
  credentials: true,
  optionsSuccessStatus: 200
};



// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Error handler middleware
const errorHandler = require('./middleware/error');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
const userRoutes = require('./routes/users');
const feedbackRoutes = require('./routes/feedback');
const categoryRoutes = require('./routes/categories');
const commentRoutes = require('./routes/comments');
const uploadRoutes = require('./routes/uploads');

app.use('/api/users', userRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/uploads', uploadRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('User Feedback System API is running');
});

// Use error handler middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
