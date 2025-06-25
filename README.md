# User Feedback System

A comprehensive platform for collecting, managing, and analyzing user feedback. This system allows users to submit feedback, comment on existing feedback, and enables administrators to track and respond to user suggestions efficiently.

## Project Overview

The User Feedback System is designed to bridge the gap between users and product teams by providing a structured way to gather, organize, and act on user feedback. The system features user authentication (including Google OAuth), feedback submission with categories, commenting functionality, admin dashboard with analytics, and user profile management.

## Live Demo:

- **Frontend**: [https://userfeedbacksystem.ishitasingh.live/](https://userfeedbacksystem.ishitasingh.live/)
- **Backend**: [https://users-feedback-form.onrender.com](https://users-feedback-form.onrender.com)
- **Dashboard (Need to login to access this page)**: [https://userfeedbacksystem.ishitasingh.live/dashboard](https://userfeedbacksystem.ishitasingh.live/dashboard)

## Backend Status:

- **Status**: [Check backend status here](https://stats.uptimerobot.com/d6PzmCF86x)

## Key Features

- **User Authentication**
  - Traditional email/password registration and login
  - Google OAuth integration for seamless sign-in
  - JWT-based authentication
  - User profile management

- **Feedback Management**
  - Submit feedback with categorization (Bug Report, Feature Request, Improvement, Positive Feedback)
  - Upvote/downvote feedback
  - Filter feedback by categories
  - Detailed feedback view with comments
  - Comment count indicators

- **Admin Features**
  - Comprehensive dashboard with analytics
  - User management
  - Feedback statistics and charts
  - Category management

- **User Experience**
  - Responsive design for mobile and desktop
  - Intuitive interface with real-time updates
  - Profile customization with avatar uploads

## Application Flow

1. **Authentication Flow**
   - Users can register with email/password or sign in with Google
   - JWT tokens are used for secure session management
   - Protected routes require authentication

2. **Feedback Submission Flow**
   - Authenticated users create new feedback
   - Users select appropriate category
   - Optional image attachments can be uploaded
   - Feedback is stored and displayed on main feedback list

3. **Feedback Interaction Flow**
   - Users can view all feedback or filter by category
   - Detailed view shows full feedback content and comments
   - Users can add comments to existing feedback
   - Comment counts are displayed on feedback cards

4. **Admin Flow**
   - Admins have access to dashboard with usage statistics
   - Can manage users, feedback, and categories
   - View analytics on feedback trends and user engagement

## User Journey

### New User Experience
1. **First Visit**
   - User lands on the homepage and sees existing feedback
   - Notices they need an account to participate
   - Clicks "Register" or "Login" button in the navigation bar

2. **Account Creation**
   - User chooses between traditional registration or "Sign in with Google"
   - For traditional registration:
     - Fills out the registration form (name, email, password)
     - Submits form and account is created
   - For Google sign-in:
     - Clicks the Google button
     - Approves the authentication request
     - Account is created or linked automatically

3. **Submitting First Feedback**
   - Navigates to "New Feedback" page
   - Fills out feedback form:
     - Enters a descriptive title
     - Selects appropriate category (Bug Report, Feature Request, Improvement, Positive Feedback)
     - Writes detailed description
     - Optionally uploads a screenshot or image
   - Submits the feedback

4. **Exploring Feedback**
   - Browses the feedback list page
   - Uses category filters to find relevant feedback
   - Sorts by popularity, recency, or other criteria
   - Clicks on feedback items to view details

5. **Engagement**
   - Reads comments on feedback items
   - Adds their own comments to participate in discussions
   - Upvotes or downvotes feedback to indicate agreement
   - Checks comment counts to find active discussions

### Regular User Experience
1. **Return Visits**
   - User logs in (remembers credentials or uses Google)
   - Sees their previously submitted feedback on "My Feedback" page
   - Receives notifications about new comments on their feedback

2. **Profile Management**
   - Updates profile information as needed
   - Changes profile picture
   - Views their feedback and comment history

3. **Ongoing Participation**
   - Regularly checks for new feedback
   - Follows discussions on interesting topics
   - Submits additional feedback as needed

## Tech Stack

### Frontend
- **React** (v19.1.0) - UI library for building the user interface
- **React Router** (v7.6.2) - For application routing
- **React Bootstrap** (v2.10.10) - UI component library
- **Chart.js** & **React-Chartjs-2** - For data visualization
- **Axios** - For API requests
- **Formik** & **Yup** - For form handling and validation
- **Firebase** - For Google OAuth authentication
- **Font Awesome** - For icons and visual elements

### Backend
- **Node.js** - JavaScript runtime
- **Express** (v5.1.0) - Web framework
- **MongoDB** - Database (accessed via Mongoose)
- **Mongoose** (v8.16.0) - MongoDB object modeling
- **JWT** - For authentication
- **Bcrypt** - For password hashing
- **Firebase Admin** - For Google OAuth verification
- **Cloudinary** - For image storage
- **Multer** - For file uploads

## Setup Instructions

### Prerequisites
- Node.js and npm installed
- MongoDB instance (local or Atlas)
- Cloudinary account (for image uploads)
- Firebase project (for Google OAuth)

### Firebase Setup (for Google OAuth)

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Add a web app to your project
   - Click on the web icon (</>) on the project overview page
   - Register your app with a nickname
   - Copy the Firebase configuration
4. Set up Authentication
   - Go to Authentication → Sign-in method
   - Enable Google as a sign-in provider
   - Configure the OAuth consent screen
5. Generate a service account for backend integration
   - Go to Project Settings → Service accounts
   - Click "Generate new private key"
   - Save the JSON file securely

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory with the following variables:
```
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Firebase Admin Configuration (from the service account JSON)
FIREBASE_TYPE=service_account
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_PRIVATE_KEY_ID=your_private_key_id
FIREBASE_PRIVATE_KEY="your_private_key"
FIREBASE_CLIENT_EMAIL=your_client_email
FIREBASE_CLIENT_ID=your_client_id
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_AUTH_PROVIDER_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
FIREBASE_CLIENT_CERT_URL=your_client_cert_url
```

4. Run the database check:
```bash
npm run db-check
```

5. Seed the database with initial data (including categories):
```bash
npm run seed
```

6. Start the backend server:
```bash
npm run dev
```

The backend will run on http://localhost:5000.

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the frontend directory with the following variables:
```
# Firebase Configuration (from your web app settings)
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_firebase_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_firebase_app_id
```

4. Start the frontend development server:
```bash
npm start
```

The frontend will run on http://localhost:3000.

## Detailed Features

### User Authentication
- **Multiple Sign-in Options**: Traditional email/password registration and Google OAuth integration
- **Secure Authentication**: JWT-based authentication with HTTP-only cookies
- **User Roles**: Support for regular users and admin roles with different permissions
- **Profile Management**: Users can update their profiles and upload profile pictures

### Feedback System
- **Categorized Feedback**: Feedback is organized into categories (Bug Report, Feature Request, Improvement, Positive Feedback)
- **Rich Content**: Support for text descriptions and image attachments
- **Voting System**: Users can upvote or downvote feedback to indicate priority
- **Comments**: Users can discuss feedback items through threaded comments
- **Comment Counters**: Visual indicators showing the number of comments on each feedback item

### Admin Dashboard
- **User Management**: Admins can view, edit, and manage user accounts
- **Feedback Overview**: Comprehensive view of all feedback across the system
- **Analytics**: Charts and statistics showing feedback trends, category distribution, and user engagement
- **Category Management**: Ability to manage feedback categories

### User Interface
- **Responsive Design**: Fully responsive interface that works on mobile, tablet, and desktop devices
- **Intuitive Navigation**: Clean, user-friendly navigation with clear visual cues
- **Real-time Updates**: Dynamic content updates without full page reloads
- **Accessibility**: Designed with accessibility best practices in mind

## API Endpoints

### Authentication
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login with email/password
- `POST /api/users/google` - Login/Register with Google OAuth
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update user profile

### Feedback
- `GET /api/feedback` - Get all feedback (with filtering options)
- `GET /api/feedback/:id` - Get a specific feedback item with comments
- `POST /api/feedback` - Create new feedback
- `PUT /api/feedback/:id` - Update feedback
- `DELETE /api/feedback/:id` - Delete feedback

### Comments
- `GET /api/feedback/:feedbackId/comments` - Get comments for a feedback
- `POST /api/feedback/:feedbackId/comments` - Add a comment to feedback
- `PUT /api/comments/:id` - Update a comment
- `DELETE /api/comments/:id` - Delete a comment

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create a new category (admin only)
- `PUT /api/categories/:id` - Update a category (admin only)
- `DELETE /api/categories/:id` - Delete a category (admin only)

## Future Enhancements

- **Email Notifications**: Notify users of replies to their feedback or comments
- **Advanced Filtering**: Enhanced search and filtering capabilities
- **Feedback Status Workflow**: Track feedback through different stages (e.g., Under Review, Planned, In Progress, Completed)
- **User Reputation System**: Reward active users with reputation points and badges
- **Internationalization**: Support for multiple languages
- **Dark Mode**: Toggle between light and dark UI themes
- **Mobile App**: Native mobile applications for iOS and Android

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- The React team for the amazing UI library
- MongoDB for the flexible database solution
- The open-source community for the various tools and libraries used in this project
