<<<<<<< HEAD
# 🎓 E-Learning Platform

A full-stack e-learning platform built with React, Node.js, Express, and MongoDB. Features course creation, video streaming, quiz engine, progress tracking, and certificate generation.

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React.js + Tailwind CSS |
| Backend | Node.js + Express.js |
| Database | MongoDB (Mongoose ODM) |
| Auth | JWT + bcrypt |
| Video Storage | Cloudinary / AWS S3 |
| Video Streaming | HLS / Cloudinary player |
| Payments | Stripe (optional) |
| Deployment | Vercel (frontend) + Render/Railway (backend) |

## 👥 User Roles

### 🧑‍🎓 Student
- Register and login
- Browse and enroll in courses
- Watch video lessons
- Take quizzes
- Track progress
- Download certificates

### 🧑‍🏫 Teacher
- Create and manage courses
- Upload video lessons
- Create quizzes with MCQs
- View student enrollment & progress
- Requires admin approval

### 🛡️ Admin
- Approve/reject teacher accounts
- Manage all users and courses
- View platform analytics
- Ban/remove users or courses

## 📁 Project Structure

```
E-Learning Platform/
├── backend/
│   ├── src/
│   │   ├── models/          # Mongoose schemas
│   │   │   ├── User.js
│   │   │   ├── Course.js
│   │   │   ├── Section.js
│   │   │   ├── Lesson.js
│   │   │   ├── Enrollment.js
│   │   │   ├── Quiz.js
│   │   │   └── Certificate.js
│   │   ├── routes/          # API endpoints
│   │   │   ├── auth.js
│   │   │   ├── courses.js
│   │   │   ├── enrollments.js
│   │   │   ├── quizzes.js
│   │   │   └── certificates.js
│   │   ├── middleware/      # Custom middleware
│   │   │   ├── auth.js
│   │   │   └── role.js
│   │   └── utils/           # Utility functions
│   │       ├── jwt.js
│   │       └── helpers.js
│   ├── server.js
│   ├── .env
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/      # Reusable components
    │   ├── pages/          # Page components
    │   ├── utils/          # Helper functions
    │   ├── App.js
    │   └── index.js
    ├── public/
    └── package.json
```

## 📚 Core Modules

### Module 1 — Authentication System
- Register / Login / Logout
- Role-based access (student, teacher, admin)
- Protected routes per role
- Password hashing with bcrypt
- JWT token with refresh tokens

### Module 2 — Course Management
- Teacher creates courses (title, description, thumbnail, category)
- Adds sections and lessons
- Upload video lessons
- Marks course as draft or published

### Module 3 — Video Streaming
- Videos uploaded to Cloudinary or S3
- Secure streaming (not downloadable directly)
- Resume playback functionality
- Lesson marked as "completed" after watching 80%+

### Module 4 — Quiz Engine
- Teacher creates MCQ quizzes per lesson
- Student attempts quizzes after watching lessons
- Auto-graded with score saved
- Pass requirement (e.g., 70%) to unlock next section

### Module 5 — Progress Tracking
- Visual progress bar per course
- Lessons completed counter
- Quiz scores history
- "Continue where you left off" on dashboard

### Module 6 — Certificate Generation
- Auto-generated PDF on course completion
- Student's name + course name + date + unique ID
- Downloadable and verifiable via public link

### Module 7 — Admin Dashboard
- Total users, teachers, students chart
- Most enrolled courses
- Pending teacher approvals
- Ability to ban/remove users or courses

## 🚀 Getting Started

### Prerequisites
- Node.js v16+
- MongoDB (local or cloud)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file with the following:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/elearning
JWT_SECRET=your_jwt_secret_key_change_this
JWT_EXPIRE=7d
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NODE_ENV=development
```

4. Start the server:
```bash
npm run dev
```

The backend will run at `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Install Tailwind CSS:
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

4. Start the development server:
```bash
npm start
```

The frontend will run at `http://localhost:3000`

## 📊 Database Schema

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: 'student' | 'teacher' | 'admin',
  avatar: String,
  isApproved: Boolean,
  createdAt: Date
}
```

### Course
```javascript
{
  title: String,
  description: String,
  teacher: ObjectId (ref: User),
  category: String,
  thumbnail: String,
  price: Number,
  status: 'draft' | 'published',
  createdAt: Date,
  updatedAt: Date
}
```

### Section
```javascript
{
  course: ObjectId (ref: Course),
  title: String,
  order: Number,
  createdAt: Date
}
```

### Lesson
```javascript
{
  section: ObjectId (ref: Section),
  title: String,
  videoUrl: String,
  duration: Number,
  order: Number,
  createdAt: Date
}
```

### Enrollment
```javascript
{
  student: ObjectId (ref: User),
  course: ObjectId (ref: Course),
  progress: Number,
  completedLessons: [ObjectId],
  enrolledAt: Date
}
```

### Quiz
```javascript
{
  lesson: ObjectId (ref: Lesson),
  title: String,
  questions: [{
    question: String,
    options: [String],
    correct: Number
  }],
  createdAt: Date
}
```

### Certificate
```javascript
{
  student: ObjectId (ref: User),
  course: ObjectId (ref: Course),
  uniqueCode: String,
  issueDate: Date
}
```

## 🗓️ 8-Week Development Roadmap

| Week | Tasks |
|------|-------|
| Week 1 | Project setup, DB connection, User auth (register/login/JWT) |
| Week 2 | Role-based routing, Teacher & Student dashboards (UI) |
| Week 3 | Course creation — CRUD for courses, sections, lessons |
| Week 4 | Video upload + streaming integration (Cloudinary) |
| Week 5 | Quiz engine — create, attempt, auto-grade |
| Week 6 | Progress tracking + resume playback |
| Week 7 | Certificate generation (PDF) + Admin dashboard |
| Week 8 | Testing, bug fixes, deployment + README |

## 📋 API Endpoints (Core)

### Auth
- `POST /api/auth/register` — Register a new user
- `POST /api/auth/login` — Login user
- `GET /api/auth/me` — Get current user (requires auth)

### Courses
- `GET /api/courses` — Get all published courses
- `GET /api/courses/:id` — Get course by ID
- `POST /api/courses` — Create course (teacher only)
- `PUT /api/courses/:id` — Update course (teacher only)

### Enrollments (to be implemented)
- `POST /api/enrollments` — Enroll in a course
- `GET /api/enrollments/:courseId` — Get course enrollments

### Quizzes (to be implemented)
- `GET /api/quizzes/:lessonId` — Get quiz for lesson
- `POST /api/quizzes/:quizId/attempt` — Submit quiz attempt

### Certificates (to be implemented)
- `GET /api/certificates/:studentId` — Get student certificates
- `POST /api/certificates/generate` — Generate certificate

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the backend folder with these variables:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/elearning
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NODE_ENV=development
```

### Tailwind CSS Setup (Frontend)

After installing Tailwind, update `tailwind.config.js`:

```javascript
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

## 📦 Dependencies

### Backend
- **express** — Web framework
- **mongoose** — MongoDB ODM
- **bcryptjs** — Password hashing
- **jsonwebtoken** — JWT authentication
- **cors** — Cross-origin requests
- **dotenv** — Environment variables
- **nodemon** (dev) — Auto-restart on file changes

### Frontend
- **react** — UI library
- **react-router-dom** — Client-side routing
- **axios** — HTTP client
- **tailwindcss** — Utility-first CSS
- **react-icons** — Icon library

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -am 'Add feature'`
3. Push to branch: `git push origin feature/your-feature`
4. Submit a pull request

## 📝 License

This project is licensed under the ISC License.

## 📞 Support

For questions or issues, please open a GitHub issue or contact the development team.

---

**Happy Learning! 🚀**
=======
# E_Learning_plateform
>>>>>>> 
