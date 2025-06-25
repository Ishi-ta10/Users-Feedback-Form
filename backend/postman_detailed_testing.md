# User Feedback System API Testing Documentation
# ==========================================

## Base URL: http://localhost:5000

## Environment Setup
1. Create a new Environment in Postman
2. Add the following variables:
   - base_url: http://localhost:5000
   - token: (leave empty initially)

## Authentication Endpoints

### 1. Register User
**Request:**
- Method: POST
- URL: {{base_url}}/api/users/register
- Body (JSON):
```json
{
    "name": "Test User",
    "email": "testuser@example.com",
    "password": "123456"
}
```
**Expected Response (201 Created):**
```json
{
    "success": true,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
        "id": "60a1b2c3d4e5f6a7b8c9d0e1",
        "name": "Test User",
        "email": "testuser@example.com",
        "role": "user"
    }
}
```
**Notes:** 
- Save the token to your environment variable "token"
- This endpoint creates a regular user with limited permissions

### 2. Register Admin User
**Request:**
- Method: POST
- URL: {{base_url}}/api/users/register
- Body (JSON):
```json
{
    "name": "Admin User",
    "email": "admin@example.com",
    "password": "123456",
    "role": "admin"
}
```
**Expected Response (201 Created):**
```json
{
    "success": true,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
        "id": "60a1b2c3d4e5f6a7b8c9d0e1",
        "name": "Admin User",
        "email": "admin@example.com",
        "role": "admin"
    }
}
```
**Notes:** 
- Save the admin token separately for testing admin-only routes
- Admin has full access to all endpoints

### 3. Login
**Request:**
- Method: POST
- URL: {{base_url}}/api/users/login
- Body (JSON):
```json
{
    "email": "testuser@example.com",
    "password": "123456"
}
```
**Expected Response (200 OK):**
```json
{
    "success": true,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
        "id": "60a1b2c3d4e5f6a7b8c9d0e1",
        "name": "Test User",
        "email": "testuser@example.com",
        "role": "user"
    }
}
```
**Notes:**
- Save the token to your environment variable "token"
- To login as admin, use admin credentials

### 4. Get Current User
**Request:**
- Method: GET
- URL: {{base_url}}/api/users/me
- Headers:
  - Authorization: Bearer {{token}}
**Expected Response (200 OK):**
```json
{
    "success": true,
    "data": {
        "_id": "60a1b2c3d4e5f6a7b8c9d0e1",
        "name": "Test User",
        "email": "testuser@example.com",
        "role": "user",
        "createdAt": "2023-05-13T15:34:23.494Z"
    }
}
```
**Notes:**
- Requires authentication
- Returns the currently logged in user's details

### 5. Logout
**Request:**
- Method: GET
- URL: {{base_url}}/api/users/logout
**Expected Response (200 OK):**
```json
{
    "success": true,
    "data": {}
}
```
**Notes:**
- Clears the token on the client side (you'll need to manually clear the token in Postman)

## Category Endpoints

### 1. Create Category (Admin Only)
**Request:**
- Method: POST
- URL: {{base_url}}/api/categories
- Headers:
  - Authorization: Bearer {{admin_token}}
- Body (JSON):
```json
{
    "name": "Feature Request",
    "description": "Suggestions for new features or enhancements"
}
```
**Expected Response (201 Created):**
```json
{
    "success": true,
    "data": {
        "_id": "60a1b2c3d4e5f6a7b8c9d0e1",
        "name": "Feature Request",
        "description": "Suggestions for new features or enhancements",
        "createdAt": "2023-05-13T15:34:23.494Z"
    }
}
```
**Notes:**
- Requires admin role
- Save the category ID for use in creating feedback

### 2. Get All Categories
**Request:**
- Method: GET
- URL: {{base_url}}/api/categories
**Expected Response (200 OK):**
```json
{
    "success": true,
    "count": 1,
    "data": [
        {
            "_id": "60a1b2c3d4e5f6a7b8c9d0e1",
            "name": "Feature Request",
            "description": "Suggestions for new features or enhancements",
            "createdAt": "2023-05-13T15:34:23.494Z"
        }
    ]
}
```
**Notes:**
- Public endpoint, no authentication required
- Can be used to populate category dropdown in feedback form

### 3. Get Single Category
**Request:**
- Method: GET
- URL: {{base_url}}/api/categories/60a1b2c3d4e5f6a7b8c9d0e1
**Expected Response (200 OK):**
```json
{
    "success": true,
    "data": {
        "_id": "60a1b2c3d4e5f6a7b8c9d0e1",
        "name": "Feature Request",
        "description": "Suggestions for new features or enhancements",
        "createdAt": "2023-05-13T15:34:23.494Z"
    }
}
```
**Notes:**
- Replace the ID in the URL with an actual category ID
- Public endpoint, no authentication required

### 4. Update Category (Admin Only)
**Request:**
- Method: PUT
- URL: {{base_url}}/api/categories/60a1b2c3d4e5f6a7b8c9d0e1
- Headers:
  - Authorization: Bearer {{admin_token}}
- Body (JSON):
```json
{
    "name": "Feature Request",
    "description": "Updated description for feature requests"
}
```
**Expected Response (200 OK):**
```json
{
    "success": true,
    "data": {
        "_id": "60a1b2c3d4e5f6a7b8c9d0e1",
        "name": "Feature Request",
        "description": "Updated description for feature requests",
        "createdAt": "2023-05-13T15:34:23.494Z"
    }
}
```
**Notes:**
- Replace the ID in the URL with an actual category ID
- Requires admin role

### 5. Delete Category (Admin Only)
**Request:**
- Method: DELETE
- URL: {{base_url}}/api/categories/60a1b2c3d4e5f6a7b8c9d0e1
- Headers:
  - Authorization: Bearer {{admin_token}}
**Expected Response (200 OK):**
```json
{
    "success": true,
    "data": {}
}
```
**Notes:**
- Replace the ID in the URL with an actual category ID
- Requires admin role
- Be careful with deletion as it may affect existing feedback

## Feedback Endpoints

### 1. Create Feedback
**Request:**
- Method: POST
- URL: {{base_url}}/api/feedback
- Headers:
  - Authorization: Bearer {{token}}
- Body (JSON):
```json
{
    "title": "Add dark mode support",
    "description": "It would be great to have a dark mode option for better visibility in low light conditions.",
    "category": "60a1b2c3d4e5f6a7b8c9d0e1",
    "image": {
        "public_id": "user-feedback-system/abcdef123456",
        "url": "https://res.cloudinary.com/your-cloud-name/image/upload/v1234567890/user-feedback-system/abcdef123456.jpg"
    }
}
```
**Expected Response (201 Created):**
```json
{
    "success": true,
    "data": {
        "_id": "60a1b2c3d4e5f6a7b8c9d0e2",
        "title": "Add dark mode support",
        "description": "It would be great to have a dark mode option for better visibility in low light conditions.",
        "category": "60a1b2c3d4e5f6a7b8c9d0e1",
        "image": {
            "public_id": "user-feedback-system/abcdef123456",
            "url": "https://res.cloudinary.com/your-cloud-name/image/upload/v1234567890/user-feedback-system/abcdef123456.jpg"
        },
        "status": "open",
        "upvotes": 0,
        "upvotedBy": [],
        "user": "60a1b2c3d4e5f6a7b8c9d0e3",
        "createdAt": "2023-05-13T15:34:23.494Z"
    }
}
```
**Notes:**
- Replace the category ID with an actual category ID
- The `image` field is optional
- To include an image, first upload it using the Image Upload endpoint below
- Requires authentication
- The user ID is automatically added from the token

### 2. Get All Feedback
**Request:**
- Method: GET
- URL: {{base_url}}/api/feedback
**Expected Response (200 OK):**
```json
{
    "success": true,
    "count": 1,
    "pagination": {
        "next": {
            "page": 2,
            "limit": 25
        }
    },
    "data": [
        {
            "_id": "60a1b2c3d4e5f6a7b8c9d0e2",
            "title": "Add dark mode support",
            "description": "It would be great to have a dark mode option for better visibility in low light conditions.",
            "category": {
                "_id": "60a1b2c3d4e5f6a7b8c9d0e1",
                "name": "Feature Request"
            },
            "status": "open",
            "upvotes": 0,
            "upvotedBy": [],
            "user": {
                "_id": "60a1b2c3d4e5f6a7b8c9d0e3",
                "name": "Test User"
            },
            "createdAt": "2023-05-13T15:34:23.494Z"
        }
    ]
}
```
**Notes:**
- Public endpoint, no authentication required
- Supports filtering, sorting, and pagination with query parameters:
  - `?category=60a1b2c3d4e5f6a7b8c9d0e1` (Filter by category)
  - `?status=open` (Filter by status)
  - `?sort=upvotes,-createdAt` (Sort by upvotes and then by creation date descending)
  - `?page=1&limit=10` (Pagination)

### 3. Get Single Feedback
**Request:**
- Method: GET
- URL: {{base_url}}/api/feedback/60a1b2c3d4e5f6a7b8c9d0e2
**Expected Response (200 OK):**
```json
{
    "success": true,
    "data": {
        "_id": "60a1b2c3d4e5f6a7b8c9d0e2",
        "title": "Add dark mode support",
        "description": "It would be great to have a dark mode option for better visibility in low light conditions.",
        "category": {
            "_id": "60a1b2c3d4e5f6a7b8c9d0e1",
            "name": "Feature Request"
        },
        "status": "open",
        "upvotes": 0,
        "upvotedBy": [],
        "user": {
            "_id": "60a1b2c3d4e5f6a7b8c9d0e3",
            "name": "Test User"
        },
        "createdAt": "2023-05-13T15:34:23.494Z"
    }
}
```
**Notes:**
- Replace the ID in the URL with an actual feedback ID
- Public endpoint, no authentication required

### 4. Update Feedback
**Request:**
- Method: PUT
- URL: {{base_url}}/api/feedback/60a1b2c3d4e5f6a7b8c9d0e2
- Headers:
  - Authorization: Bearer {{token}}
- Body (JSON):
```json
{
    "title": "Add dark mode support",
    "description": "Updated description for this feedback.",
    "status": "in-progress"
}
```
**Expected Response (200 OK):**
```json
{
    "success": true,
    "data": {
        "_id": "60a1b2c3d4e5f6a7b8c9d0e2",
        "title": "Add dark mode support",
        "description": "Updated description for this feedback.",
        "category": "60a1b2c3d4e5f6a7b8c9d0e1",
        "status": "in-progress",
        "upvotes": 0,
        "upvotedBy": [],
        "user": "60a1b2c3d4e5f6a7b8c9d0e3",
        "createdAt": "2023-05-13T15:34:23.494Z"
    }
}
```
**Notes:**
- Replace the ID in the URL with an actual feedback ID
- Requires authentication
- Only the owner or an admin can update the feedback
- You don't need to include all fields, only the ones you want to update

### 5. Delete Feedback
**Request:**
- Method: DELETE
- URL: {{base_url}}/api/feedback/60a1b2c3d4e5f6a7b8c9d0e2
- Headers:
  - Authorization: Bearer {{token}}
**Expected Response (200 OK):**
```json
{
    "success": true,
    "data": {}
}
```
**Notes:**
- Replace the ID in the URL with an actual feedback ID
- Requires authentication
- Only the owner or an admin can delete the feedback

### 6. Upvote Feedback
**Request:**
- Method: PUT
- URL: {{base_url}}/api/feedback/60a1b2c3d4e5f6a7b8c9d0e2/upvote
- Headers:
  - Authorization: Bearer {{token}}
**Expected Response (200 OK):**
```json
{
    "success": true,
    "data": {
        "_id": "60a1b2c3d4e5f6a7b8c9d0e2",
        "title": "Add dark mode support",
        "description": "Updated description for this feedback.",
        "category": "60a1b2c3d4e5f6a7b8c9d0e1",
        "status": "in-progress",
        "upvotes": 1,
        "upvotedBy": ["60a1b2c3d4e5f6a7b8c9d0e3"],
        "user": "60a1b2c3d4e5f6a7b8c9d0e3",
        "createdAt": "2023-05-13T15:34:23.494Z"
    }
}
```
**Notes:**
- Replace the ID in the URL with an actual feedback ID
- Requires authentication
- Calling this endpoint toggles the upvote (adds if not upvoted, removes if already upvoted)

## Comment Endpoints

### 1. Add Comment to Feedback
**Request:**
- Method: POST
- URL: {{base_url}}/api/feedback/60a1b2c3d4e5f6a7b8c9d0e2/comments
- Headers:
  - Authorization: Bearer {{token}}
- Body (JSON):
```json
{
    "text": "This is a great suggestion. I've been waiting for this feature."
}
```
**Expected Response (201 Created):**
```json
{
    "success": true,
    "data": {
        "_id": "60a1b2c3d4e5f6a7b8c9d0e4",
        "text": "This is a great suggestion. I've been waiting for this feature.",
        "user": "60a1b2c3d4e5f6a7b8c9d0e3",
        "feedback": "60a1b2c3d4e5f6a7b8c9d0e2",
        "createdAt": "2023-05-13T15:34:23.494Z"
    }
}
```
**Notes:**
- Replace the feedback ID in the URL with an actual feedback ID
- Requires authentication
- The user ID is automatically added from the token

### 2. Get All Comments for a Feedback
**Request:**
- Method: GET
- URL: {{base_url}}/api/feedback/60a1b2c3d4e5f6a7b8c9d0e2/comments
**Expected Response (200 OK):**
```json
{
    "success": true,
    "count": 1,
    "data": [
        {
            "_id": "60a1b2c3d4e5f6a7b8c9d0e4",
            "text": "This is a great suggestion. I've been waiting for this feature.",
            "user": {
                "_id": "60a1b2c3d4e5f6a7b8c9d0e3",
                "name": "Test User"
            },
            "feedback": "60a1b2c3d4e5f6a7b8c9d0e2",
            "createdAt": "2023-05-13T15:34:23.494Z"
        }
    ]
}
```
**Notes:**
- Replace the feedback ID in the URL with an actual feedback ID
- Public endpoint, no authentication required

### 3. Get All Comments (Admin Only)
**Request:**
- Method: GET
- URL: {{base_url}}/api/comments
- Headers:
  - Authorization: Bearer {{admin_token}}
**Expected Response (200 OK):**
```json
{
    "success": true,
    "count": 1,
    "data": [
        {
            "_id": "60a1b2c3d4e5f6a7b8c9d0e4",
            "text": "This is a great suggestion. I've been waiting for this feature.",
            "user": {
                "_id": "60a1b2c3d4e5f6a7b8c9d0e3",
                "name": "Test User"
            },
            "feedback": {
                "_id": "60a1b2c3d4e5f6a7b8c9d0e2",
                "title": "Add dark mode support"
            },
            "createdAt": "2023-05-13T15:34:23.494Z"
        }
    ]
}
```
**Notes:**
- Requires admin role
- Returns all comments across all feedback

### 4. Get Single Comment
**Request:**
- Method: GET
- URL: {{base_url}}/api/comments/60a1b2c3d4e5f6a7b8c9d0e4
**Expected Response (200 OK):**
```json
{
    "success": true,
    "data": {
        "_id": "60a1b2c3d4e5f6a7b8c9d0e4",
        "text": "This is a great suggestion. I've been waiting for this feature.",
        "user": {
            "_id": "60a1b2c3d4e5f6a7b8c9d0e3",
            "name": "Test User"
        },
        "feedback": {
            "_id": "60a1b2c3d4e5f6a7b8c9d0e2",
            "title": "Add dark mode support"
        },
        "createdAt": "2023-05-13T15:34:23.494Z"
    }
}
```
**Notes:**
- Replace the ID in the URL with an actual comment ID
- Public endpoint, no authentication required

### 5. Update Comment
**Request:**
- Method: PUT
- URL: {{base_url}}/api/comments/60a1b2c3d4e5f6a7b8c9d0e4
- Headers:
  - Authorization: Bearer {{token}}
- Body (JSON):
```json
{
    "text": "Updated comment text"
}
```
**Expected Response (200 OK):**
```json
{
    "success": true,
    "data": {
        "_id": "60a1b2c3d4e5f6a7b8c9d0e4",
        "text": "Updated comment text",
        "user": "60a1b2c3d4e5f6a7b8c9d0e3",
        "feedback": "60a1b2c3d4e5f6a7b8c9d0e2",
        "createdAt": "2023-05-13T15:34:23.494Z"
    }
}
```
**Notes:**
- Replace the ID in the URL with an actual comment ID
- Requires authentication
- Only the comment owner can update their comment

### 6. Delete Comment
**Request:**
- Method: DELETE
- URL: {{base_url}}/api/comments/60a1b2c3d4e5f6a7b8c9d0e4
- Headers:
  - Authorization: Bearer {{token}}
**Expected Response (200 OK):**
```json
{
    "success": true,
    "data": {}
}
```
**Notes:**
- Replace the ID in the URL with an actual comment ID
- Requires authentication
- Only the comment owner or an admin can delete the comment

## User Endpoints (Admin Only)

### 1. Get All Users
**Request:**
- Method: GET
- URL: {{base_url}}/api/users
- Headers:
  - Authorization: Bearer {{admin_token}}
**Expected Response (200 OK):**
```json
{
    "success": true,
    "count": 2,
    "data": [
        {
            "_id": "60a1b2c3d4e5f6a7b8c9d0e3",
            "name": "Test User",
            "email": "testuser@example.com",
            "role": "user",
            "createdAt": "2023-05-13T15:34:23.494Z"
        },
        {
            "_id": "60a1b2c3d4e5f6a7b8c9d0e5",
            "name": "Admin User",
            "email": "admin@example.com",
            "role": "admin",
            "createdAt": "2023-05-13T15:34:23.494Z"
        }
    ]
}
```
**Notes:**
- Requires admin role

### 2. Get Single User
**Request:**
- Method: GET
- URL: {{base_url}}/api/users/60a1b2c3d4e5f6a7b8c9d0e3
- Headers:
  - Authorization: Bearer {{admin_token}}
**Expected Response (200 OK):**
```json
{
    "success": true,
    "data": {
        "_id": "60a1b2c3d4e5f6a7b8c9d0e3",
        "name": "Test User",
        "email": "testuser@example.com",
        "role": "user",
        "createdAt": "2023-05-13T15:34:23.494Z"
    }
}
```
**Notes:**
- Replace the ID in the URL with an actual user ID
- Requires admin role

### 3. Create User (Admin Only)
**Request:**
- Method: POST
- URL: {{base_url}}/api/users
- Headers:
  - Authorization: Bearer {{admin_token}}
- Body (JSON):
```json
{
    "name": "New User",
    "email": "newuser@example.com",
    "password": "123456",
    "role": "user"
}
```
**Expected Response (201 Created):**
```json
{
    "success": true,
    "data": {
        "_id": "60a1b2c3d4e5f6a7b8c9d0e6",
        "name": "New User",
        "email": "newuser@example.com",
        "role": "user",
        "createdAt": "2023-05-13T15:34:23.494Z"
    }
}
```
**Notes:**
- Requires admin role

### 4. Update User (Admin Only)
**Request:**
- Method: PUT
- URL: {{base_url}}/api/users/60a1b2c3d4e5f6a7b8c9d0e6
- Headers:
  - Authorization: Bearer {{admin_token}}
- Body (JSON):
```json
{
    "name": "Updated User Name"
}
```
**Expected Response (200 OK):**
```json
{
    "success": true,
    "data": {
        "_id": "60a1b2c3d4e5f6a7b8c9d0e6",
        "name": "Updated User Name",
        "email": "newuser@example.com",
        "role": "user",
        "createdAt": "2023-05-13T15:34:23.494Z"
    }
}
```
**Notes:**
- Replace the ID in the URL with an actual user ID
- Requires admin role
- You don't need to include all fields, only the ones you want to update

### 5. Delete User (Admin Only)
**Request:**
- Method: DELETE
- URL: {{base_url}}/api/users/60a1b2c3d4e5f6a7b8c9d0e6
- Headers:
  - Authorization: Bearer {{admin_token}}
**Expected Response (200 OK):**
```json
{
    "success": true,
    "data": {}
}
```
**Notes:**
- Replace the ID in the URL with an actual user ID
- Requires admin role
- Be careful with deletion as it may affect feedback and comments associated with the user

## Image Upload Endpoints

### 1. Upload Image
**Request:**
- Method: POST
- URL: {{base_url}}/api/uploads
- Headers:
  - Authorization: Bearer {{token}}
- Body (form-data):
  - Key: image
  - Value: [Select a file]
  - Type: File

**Expected Response (200 OK):**
```json
{
    "success": true,
    "data": {
        "public_id": "user-feedback-system/abcdef123456",
        "url": "https://res.cloudinary.com/your-cloud-name/image/upload/v1234567890/user-feedback-system/abcdef123456.jpg"
    }
}
```
**Notes:**
- Requires authentication
- Supports JPG, JPEG, PNG, and GIF files
- Maximum file size: 5MB
- The returned `public_id` and `url` should be saved and included when creating feedback
- Images are stored in Cloudinary

## Additional Testing Tips

### Testing Authentication Flow
1. Register a user
2. Save the token
3. Use the token to access protected routes
4. Logout (and remove the token from your environment variables)

### Testing Admin Routes
1. Register an admin user
2. Save the admin token
3. Try to access admin-only routes with the admin token
4. Try to access admin-only routes with a regular user token (should be unauthorized)

### Testing Upvotes
1. Upvote a feedback (should increase to 1)
2. Upvote the same feedback again (should decrease to 0)
3. Login with another user and upvote (should increase to 1)

### Testing Filtering and Pagination
1. Create multiple feedback items with different categories and statuses
2. Test filtering by category, status, etc.
3. Test sorting by different fields
4. Test pagination with different page and limit values

### Error Testing
1. Try to register with an email that already exists
2. Try to access a resource that doesn't exist
3. Try to update or delete a resource that you don't own
4. Try to access protected routes without a token
