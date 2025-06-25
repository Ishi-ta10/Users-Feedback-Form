# User Feedback System - Backend

A robust Node.js/Express backend for managing user feedback, comments, and upvotes.

## Repository
- [Frontend Repository](https://github.com/Ishi-ta10/User-Feedback-System)
- [Backend Repository](https://github.com/Ishi-ta10/Backend-User-Feedback-System/)

## Hosted API
[Backend API](https://backend-user-feedback-system.onrender.com)

## Frontend Hosted Link
[Frontend](https://feedbacksystem.ishitasingh.live/)

## Features
- User authentication and authorization
- CRUD operations for feedback
- Comment system
- Upvoting system
- Category management
- Rich filtering and sorting options
- Comprehensive error handling

## Tech Stack
- Node.js
- Express.js
- MongoDB
- JWT for authentication

## Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/ishita/user-feedback-system-backend.git
cd user-feedback-system-backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a .env file in the root directory with the following variables:
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=cloud_name
CLOUDINARY_API_KEY=api_key_cloudinary
CLOUDINARY_API_SECRET=api_secret_cloudinary

```

4. Start the development server:
```bash
npm run dev
```

The server will start on http://localhost:5000

## API Documentation

### Authentication Routes
- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login user

### Feedback Routes
- GET /api/feedback - Get all feedback
- POST /api/feedback - Create new feedback
- PUT /api/feedback/:id - Update feedback
- DELETE /api/feedback/:id - Delete feedback
- PUT /api/feedback/:id/upvote - Upvote feedback
- POST /api/feedback/:id/comments - Add comment

### Category Routes
- GET /api/categories - Get all categories

## Contributing
Please read CONTRIBUTING.md for details on our code of conduct and the process for submitting pull requests.

## License
This project is licensed under the MIT License - see the LICENSE.md file for details
