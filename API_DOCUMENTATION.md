# 🔌 E-Learning Platform — API Documentation

## Base URL
```
Development: http://localhost:5000/api
Production: [Will be configured during deployment]
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

---

## 📌 Auth Endpoints

### 1. Register User

**POST** `/auth/register`

Create a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePassword123",
  "role": "student"
}
```

**Response (201 Created):**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student"
  }
}
```

**Error Responses:**
```json
// Missing fields
{ "error": "All fields are required" }

// Email already exists
{ "error": "Email already in use" }

// Server error
{ "error": "Error message" }
```

---

### 2. Login User

**POST** `/auth/login`

Authenticate and receive JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePassword123"
}
```

**Response (200 OK):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student"
  }
}
```

**Error Responses:**
```json
// Invalid credentials
{ "error": "Invalid credentials" }

// Missing fields
{ "error": "Email and password are required" }
```

---

### 3. Get Current User

**GET** `/auth/me`

Retrieve the current authenticated user's profile.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200 OK):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "student",
  "avatar": null,
  "isApproved": false,
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

**Error Responses:**
```json
// No token provided
{ "error": "No token provided" }

// Invalid token
{ "error": "Invalid token" }
```

---

## 📚 Course Endpoints

### 1. Get All Published Courses

**GET** `/courses`

Retrieve all published courses (public endpoint).

**Query Parameters:**
- `category` (optional): Filter by category
- `page` (optional): Pagination page number
- `limit` (optional): Items per page

**Response (200 OK):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Introduction to Web Development",
    "description": "Learn the basics of HTML, CSS, and JavaScript",
    "category": "Web Development",
    "thumbnail": "https://cloudinary.com/...",
    "price": 0,
    "status": "published",
    "teacher": {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Jane Smith"
    },
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
]
```

---

### 2. Get Course by ID

**GET** `/courses/:id`

Retrieve detailed information about a specific course.

**Response (200 OK):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "title": "Introduction to Web Development",
  "description": "Learn the basics of HTML, CSS, and JavaScript",
  "category": "Web Development",
  "thumbnail": "https://cloudinary.com/...",
  "price": 0,
  "status": "published",
  "teacher": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Jane Smith"
  },
  "sections": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "title": "Week 1: HTML Basics",
      "order": 1
    }
  ],
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

**Error Response:**
```json
// Course not found
{ "error": "Cast to ObjectId failed" }
```

---

### 3. Create Course

**POST** `/courses`

Create a new course (teacher only).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "title": "Advanced JavaScript",
  "description": "Master advanced JavaScript concepts",
  "category": "Programming",
  "price": 49.99
}
```

**Response (201 Created):**
```json
{
  "_id": "507f1f77bcf86cd799439014",
  "title": "Advanced JavaScript",
  "description": "Master advanced JavaScript concepts",
  "category": "Programming",
  "price": 49.99,
  "teacher": "507f1f77bcf86cd799439012",
  "status": "draft",
  "thumbnail": null,
  "createdAt": "2024-01-15T11:00:00.000Z",
  "updatedAt": "2024-01-15T11:00:00.000Z"
}
```

**Error Responses:**
```json
// Not a teacher
{ "error": "Access denied" }

// No token
{ "error": "No token provided" }
```

---

### 4. Update Course

**PUT** `/courses/:id`

Update course details (teacher who created it only).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "title": "Advanced JavaScript - Updated",
  "status": "published",
  "price": 59.99
}
```

**Response (200 OK):**
```json
{
  "_id": "507f1f77bcf86cd799439014",
  "title": "Advanced JavaScript - Updated",
  "description": "Master advanced JavaScript concepts",
  "category": "Programming",
  "price": 59.99,
  "teacher": "507f1f77bcf86cd799439012",
  "status": "published",
  "thumbnail": null,
  "createdAt": "2024-01-15T11:00:00.000Z",
  "updatedAt": "2024-01-15T11:30:00.000Z"
}
```

**Error Responses:**
```json
// Not authorized (not the course creator)
{ "error": "Not authorized" }

// Course not found
{ "error": "Cast to ObjectId failed" }
```

---

## 🎓 Enrollment Endpoints (To Be Implemented)

### Planned Endpoints:
- **POST** `/enrollments` — Enroll in a course
- **GET** `/enrollments` — Get user's enrollments
- **GET** `/enrollments/:courseId` — Get course enrollments (teacher)
- **DELETE** `/enrollments/:id` — Unenroll from course

---

## ❓ Quiz Endpoints (To Be Implemented)

### Planned Endpoints:
- **GET** `/quizzes/:lessonId` — Get quiz for a lesson
- **POST** `/quizzes` — Create quiz (teacher)
- **POST** `/quizzes/:quizId/attempt` — Submit quiz attempt
- **GET** `/quizzes/:quizId/attempts/:studentId` — Get quiz attempts

---

## 🏆 Certificate Endpoints (To Be Implemented)

### Planned Endpoints:
- **GET** `/certificates/:studentId` — Get student's certificates
- **POST** `/certificates/generate` — Generate certificate
- **GET** `/certificates/:code/verify` — Verify certificate

---

## 📊 Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - No/invalid token |
| 403 | Forbidden - Access denied |
| 404 | Not Found - Resource not found |
| 500 | Server Error - Internal server error |

---

## 🔒 Role-Based Access

| Endpoint | Student | Teacher | Admin |
|----------|---------|---------|-------|
| GET /courses | ✅ | ✅ | ✅ |
| POST /courses | ❌ | ✅ | ✅ |
| PUT /courses/:id | ❌ | ✅* | ✅ |
| POST /enrollments | ✅ | ✅ | ❌ |
| POST /quizzes | ❌ | ✅ | ✅ |

*Teacher can only update their own courses

---

## 🚨 Error Handling

All endpoints follow this error response format:

```json
{
  "error": "Description of the error"
}
```

Common error scenarios:
- **Authentication errors**: Include "No token provided" or "Invalid token"
- **Authorization errors**: Include "Access denied"
- **Validation errors**: Include field descriptions
- **Server errors**: Include error message

---

## 📝 Request/Response Examples

### Example: Complete User Journey

1. **Register**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "pass123",
    "role": "student"
  }'
```

2. **Login**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "pass123"
  }'
```

3. **Get Current User**
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer <token>"
```

4. **Get Courses**
```bash
curl -X GET http://localhost:5000/api/courses
```

---

## 🔄 Rate Limiting

Currently, no rate limiting is implemented. Consider adding:
- 100 requests per 15 minutes for unauthenticated endpoints
- 1000 requests per 15 minutes for authenticated endpoints

---

## 📖 Pagination

List endpoints support pagination:

```
GET /courses?page=1&limit=10
```

Response includes:
```json
{
  "data": [...],
  "page": 1,
  "limit": 10,
  "total": 45
}
```

---

## 🔐 Security Notes

1. Always include Authorization header for protected endpoints
2. Tokens expire after 7 days (configurable via JWT_EXPIRE)
3. Never expose JWT_SECRET in client code
4. Use HTTPS in production
5. Validate all input on the server side

---

**Last Updated:** 2024-01-15
**API Version:** v1.0
