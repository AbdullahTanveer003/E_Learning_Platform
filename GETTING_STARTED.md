# 🚀 Quick Start Guide — E-Learning Platform

## ✅ Project Setup Complete!

Your E-Learning Platform is now fully initialized and ready for development.

---

## 📂 What's Inside

### Root Level Files
- **README.md** — Complete project documentation
- **PROJECT_SETUP_SUMMARY.md** — Setup overview & next steps
- **API_DOCUMENTATION.md** — Detailed API reference
- **.gitignore** — Git configuration
- **GETTING_STARTED.md** — This file!

### Backend (`/backend`)
```
✅ Express.js server configured
✅ MongoDB connection setup
✅ 7 Database models created
✅ Authentication system (JWT + bcrypt)
✅ Role-based middleware
✅ 2 Route modules (auth, courses)
✅ Utils for JWT & helpers
✅ .env file ready for configuration
```

### Frontend (`/frontend`)
```
✅ React app created
✅ Tailwind CSS configured
✅ PostCSS setup
✅ Folder structure ready
✅ Styling pipeline ready
```

---

## 🏃 How to Run

### Option 1: Run Both Servers (Development)

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
✅ Server runs at: `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```
✅ App opens at: `http://localhost:3000`

### Option 2: Run Only Backend (API Testing)

```bash
cd backend
npm run dev
```

Test the API with curl or Postman:
```bash
curl http://localhost:5000/api/health
# Response: { "message": "Server is running" }
```

---

## 🔧 Configuration

### Backend Setup (.env)

1. Open `backend/.env`
2. Update these fields:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/elearning
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRE=7d
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NODE_ENV=development
```

### MongoDB Setup

**Option A: Local MongoDB**
```bash
# Windows
mongod

# Mac
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

**Option B: MongoDB Atlas (Cloud)**
```
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create cluster
3. Get connection string
4. Update MONGODB_URI in .env
```

---

## 📝 First API Test

### 1. Register a User

**Request:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123",
    "role": "student"
  }'
```

**Response:**
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

### 2. Login

**Request:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

### 3. Get Current User

**Request:**
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer <your_token_here>"
```

---

## 📚 Project Structure Understanding

### Backend Architecture

```
backend/
├── server.js              # Main entry point
├── src/
│   ├── models/           # Database schemas
│   │   ├── User.js       # User model with password hashing
│   │   ├── Course.js     # Course model
│   │   ├── Section.js    # Course sections
│   │   ├── Lesson.js     # Video lessons
│   │   ├── Enrollment.js # Student enrollments
│   │   ├── Quiz.js       # Quiz questions
│   │   └── Certificate.js # Completion certificates
│   │
│   ├── routes/           # API endpoints
│   │   ├── auth.js       # User authentication endpoints
│   │   └── courses.js    # Course CRUD endpoints
│   │
│   ├── middleware/       # Request handlers
│   │   ├── auth.js       # JWT verification
│   │   └── role.js       # Role-based access control
│   │
│   └── utils/            # Helper functions
│       ├── jwt.js        # Token generation
│       └── helpers.js    # Utility functions
```

### Frontend Architecture

```
frontend/
├── src/
│   ├── components/       # Reusable React components
│   ├── pages/           # Page-level components
│   ├── utils/           # Helper functions & API calls
│   ├── App.js           # Main app component
│   ├── index.js         # React entry point
│   └── index.css        # Global styles (Tailwind)
```

---

## 🛠️ Available Commands

### Backend

```bash
# Start development server (auto-reload with nodemon)
npm run dev

# Start production server
npm start

# Run tests (when configured)
npm test
```

### Frontend

```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Eject (NOT recommended - irreversible)
npm run eject
```

---

## 🔑 Key Technologies

| Component | Technology | Purpose |
|-----------|-----------|---------|
| Server | Express.js | Web framework |
| Database | MongoDB + Mongoose | Data storage & modeling |
| Auth | JWT + bcryptjs | Secure authentication |
| Frontend UI | React + Tailwind | User interface |
| Routing | Express Router | API routes |
| Password Security | bcryptjs | Hashing passwords |
| Token Security | jsonwebtoken | Creating/verifying tokens |

---

## 📖 Documentation Files

1. **README.md** — Full project overview
   - Tech stack, user roles, modules, roadmap
   
2. **API_DOCUMENTATION.md** — Complete API reference
   - All endpoints, request/response formats, examples
   
3. **PROJECT_SETUP_SUMMARY.md** — What's been set up
   - Completed tasks, next steps
   
4. **GETTING_STARTED.md** — This file
   - Quick setup, first tests, key info

---

## 🚨 Troubleshooting

### Backend won't start?

```
Error: connect ECONNREFUSED 127.0.0.1:27017

✓ Solution: MongoDB is not running
  - Windows: Run 'mongod' in another terminal
  - Mac: brew services start mongodb-community
  - Cloud: Update MONGODB_URI in .env
```

### Frontend shows errors?

```
Error: Cannot find module 'tailwindcss'

✓ Solution: Run 'npm install' in frontend folder
```

### Token not working?

```
Error: Invalid token

✓ Solution: Token has expired or JWT_SECRET is different
  - Generate new token with login endpoint
  - Ensure same JWT_SECRET in .env
```

---

## 📊 Testing the API with Postman

1. **Download Postman** from https://www.postman.com/downloads/

2. **Create a new request:**
   - Method: POST
   - URL: `http://localhost:5000/api/auth/register`
   - Body (JSON):
   ```json
   {
     "name": "Test User",
     "email": "test@example.com",
     "password": "TestPass123",
     "role": "student"
   }
   ```

3. **Save the token** from response

4. **Use token in next requests:**
   - Go to Headers tab
   - Add: `Authorization: Bearer <token>`

---

## 🎯 Next Steps

### Week 1 (This Week)
- [x] Project setup ✅
- [x] Database models ✅
- [x] Auth system ✅
- [ ] **TODO:** Test auth endpoints

### Week 2 (Next)
- [ ] Create dashboards (student, teacher)
- [ ] Implement role-based routing
- [ ] Connect frontend to backend

### Weeks 3-8
- See PROJECT_SETUP_SUMMARY.md for full roadmap

---

## 💡 Pro Tips

1. **Hot Reload**: Changes to backend files auto-reload with `npm run dev`
2. **CORS**: Backend allows requests from `localhost:3000`
3. **Error Logs**: Check terminal for detailed error messages
4. **DB Inspection**: Use MongoDB Compass to view collections
5. **API Testing**: Use Postman for endpoint testing before building frontend

---

## 📞 Quick Reference

| Need | Command |
|------|---------|
| Start backend | `cd backend && npm run dev` |
| Start frontend | `cd frontend && npm start` |
| Install deps | `npm install` |
| Update deps | `npm update` |
| Clear cache | `npm cache clean --force` |
| Check syntax | `node -c file.js` |

---

## ✨ Ready to Code!

You now have:
- ✅ Backend API server
- ✅ Database models & schemas
- ✅ Authentication system
- ✅ Frontend setup with Tailwind
- ✅ Complete documentation

**Start implementing Week 2 tasks:**
1. Build teacher dashboard
2. Build student dashboard
3. Implement role-based routing
4. Connect frontend to backend

Good luck! 🎉

---

**Questions?** Check the API_DOCUMENTATION.md or README.md files.
