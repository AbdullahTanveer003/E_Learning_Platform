# 📖 Development Guidelines — E-Learning Platform

## Code Standards

### Backend (Node.js/Express)

#### File Organization
```javascript
// 1. Imports
const express = require('express');
const Model = require('../models/Model');
const middleware = require('../middleware/middleware');

// 2. Router setup
const router = express.Router();

// 3. Routes
router.post('/', middleware, async (req, res) => {
  // Logic here
});

// 4. Export
module.exports = router;
```

#### Error Handling Pattern
```javascript
try {
  // Operation
  const result = await Model.find();
  res.json(result);
} catch (error) {
  console.error(error);
  res.status(500).json({ error: error.message });
}
```

#### Validation Pattern
```javascript
if (!field || !field.trim()) {
  return res.status(400).json({ error: 'Field is required' });
}
```

### Frontend (React)

#### Component Structure
```javascript
// 1. Imports
import React, { useState } from 'react';

// 2. Component definition
function MyComponent({ prop1, prop2 }) {
  // Logic here
  return (
    <div>Content</div>
  );
}

// 3. Export
export default MyComponent;
```

#### Naming Conventions
- Components: `PascalCase` (e.g., `UserProfile.js`)
- Functions: `camelCase` (e.g., `getUserData()`)
- Constants: `UPPER_SNAKE_CASE` (e.g., `API_BASE_URL`)
- Files: Match component name (e.g., `UserProfile.js`)

---

## API Development Guidelines

### Creating New Routes

1. **Create route file** in `src/routes/`
```javascript
// src/routes/example.js
const express = require('express');
const Model = require('../models/Model');
const authMiddleware = require('../middleware/auth');
const roleMiddleware = require('../middleware/role');

const router = express.Router();

router.post('/', authMiddleware, roleMiddleware(['admin']), async (req, res) => {
  try {
    const item = new Model(req.body);
    await item.save();
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
```

2. **Register route** in `server.js`
```javascript
app.use('/api/example', require('./src/routes/example'));
```

3. **Document endpoint** in API_DOCUMENTATION.md

### Response Format

**Success (2xx):**
```json
{
  "data": { /* actual data */ },
  "message": "Operation successful"
}
```

**Error (4xx/5xx):**
```json
{
  "error": "Error message"
}
```

---

## Database Naming Conventions

### Collections
- Plural lowercase: `users`, `courses`, `enrollments`

### Fields
- camelCase: `firstName`, `courseId`, `createdAt`

### MongoDB ObjectIds
- Always use `_id` field (MongoDB default)
- Reference as `userId`, `courseId` in foreign keys

### Timestamps
- Always include: `createdAt`, `updatedAt`
- Use `new Date()` or set with Mongoose defaults

---

## Common Patterns

### Authentication Flow

```javascript
// 1. Register
POST /api/auth/register
→ Hash password with bcryptjs
→ Save user to DB
→ Generate JWT token
→ Return token & user data

// 2. Login
POST /api/auth/login
→ Find user by email
→ Compare password
→ Generate JWT token
→ Return token & user data

// 3. Protected Route
GET /api/auth/me
→ Auth middleware verifies token
→ Extract userId from token
→ Fetch user data
→ Return user profile
```

### CRUD Pattern

```javascript
// Create
POST /api/resource
→ Validate input
→ Create document
→ Save to DB
→ Return created resource (201)

// Read
GET /api/resource/:id
→ Fetch from DB
→ Return resource (200)

// Update
PUT /api/resource/:id
→ Validate input
→ Update document
→ Save to DB
→ Return updated resource (200)

// Delete
DELETE /api/resource/:id
→ Delete from DB
→ Return success message (200)
```

### Role-Based Authorization

```javascript
// Usage in routes
router.post('/', 
  authMiddleware,                    // Verify token
  roleMiddleware(['teacher', 'admin']), // Check role
  async (req, res) => {
    // Only teachers and admins reach here
  }
);
```

---

## Testing Endpoints

### Using cURL

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"pass","role":"student"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"pass"}'

# Protected endpoint
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer <token>"
```

### Using Postman

1. Create new request
2. Set method (GET/POST/PUT/DELETE)
3. Enter URL
4. Set headers:
   - `Content-Type: application/json`
   - `Authorization: Bearer <token>` (for protected)
5. Add body (JSON for POST/PUT)
6. Click Send

---

## Common Errors & Solutions

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017

Solution:
- Start MongoDB: mongod (Windows) or brew services start mongodb-community (Mac)
- Or use MongoDB Atlas with connection string
```

### JWT Token Errors
```
Error: Invalid token / No token provided

Solution:
- Include Authorization header: Authorization: Bearer <token>
- Ensure token hasn't expired
- Check JWT_SECRET matches in .env
```

### CORS Errors
```
Error: Cross-Origin Request Blocked

Solution:
- CORS is already configured in server.js
- Ensure frontend runs on localhost:3000
- Check that backend is running on localhost:5000
```

### Mongoose Validation Error
```
Error: User validation failed

Solution:
- Check required fields in request
- Validate email format, password strength
- Review model schema requirements
```

---

## Performance Tips

1. **Use `.select()`** to limit fields:
```javascript
User.findById(id).select('name email');
```

2. **Use `.lean()`** for read-only queries:
```javascript
Course.find().lean();
```

3. **Add `.populate()`** for related data:
```javascript
Course.findById(id).populate('teacher');
```

4. **Use pagination** for large datasets:
```javascript
const page = req.query.page || 1;
const limit = 10;
const skip = (page - 1) * limit;
Model.find().skip(skip).limit(limit);
```

---

## Security Best Practices

1. **Never commit .env** — Already in .gitignore ✓
2. **Hash passwords** — Using bcryptjs ✓
3. **Validate input** — Check all req.body fields
4. **Use HTTPS** — In production
5. **Protect secrets** — Keep JWT_SECRET safe
6. **Rate limiting** — Add for production
7. **Input sanitization** — Validate all inputs

---

## Git Workflow

### Branch Naming
```
feature/user-authentication
bugfix/login-error
docs/api-documentation
```

### Commit Messages
```
Good:
- "Add user authentication endpoints"
- "Fix course creation validation"
- "Update API documentation"

Avoid:
- "fixed stuff"
- "update"
- "working code"
```

### Typical Flow
```bash
git checkout -b feature/new-feature
# Make changes
git add .
git commit -m "Add new feature"
git push origin feature/new-feature
# Open pull request on GitHub
```

---

## Environment Setup

### Development
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/elearning
JWT_SECRET=dev_secret_key
DEBUG=true
```

### Production
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=<production_atlas_uri>
JWT_SECRET=<secure_random_string>
DEBUG=false
```

---

## Code Review Checklist

Before submitting code:

- [ ] Code follows naming conventions
- [ ] Error handling is implemented
- [ ] Input validation is present
- [ ] Comments explain complex logic
- [ ] No console.logs left behind
- [ ] .env secrets are not hardcoded
- [ ] Functions are not too long
- [ ] Related logic is grouped together
- [ ] Documentation is updated
- [ ] Tested locally

---

## Useful Resources

- [Express.js Documentation](https://expressjs.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [MongoDB Manual](https://docs.mongodb.com/manual/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs/)
- [JWT Introduction](https://jwt.io/introduction)

---

## Questions or Issues?

1. Check the README.md for overview
2. Check API_DOCUMENTATION.md for endpoint details
3. Check console errors
4. Review similar existing code
5. Test with curl/Postman first

**Happy coding! 🚀**
