# my-notes-app

This is a collaborative note taking app built with MERN stack + JWT auth + Tailwind CSS

# Features

JWT Authentication (Register & Login)
Create, Edit, Delete Notes
Rich Text Editor (Bold, Italic, Underline, Lists)
Full-Text Search
Collaborator Management (share notes by email)
Responsive Design with Tailwind CSS

# Tech Stack

Frontend - React 19, Vite, Tailwind CSS, Axios
Backend - Node.js, Express.js
Database - MongoDB + Mongoose
Auth - JSON Web Tokens (JWT)

# Prerequisites

Node.js v18+
MongoDB (local) or MongoDB Atlas
Git

# Getting Started

# 1. Setup Backend

bash,
-> cd backend
-> npm install

Create a `.env` file inside `backend/` ,
env,
-MONGO_URI=mongodb://localhost:27017/database_name
-JWT_SECRET=your_jwt_secret_key_here
-PORT=5000
-NODE_ENV=development

Start backend
bash,
-> npm run dev

# 2. Setup Frontend

bash,
-> cd ../frontend
-> npm install --legacy-peer-deps
-> npm run dev

# 3. Open the app

Visit `http://localhost:5173`

# Environment Variables

See `backend/.env.example` for reference.

| Variable | Description | Example |
|----------|-------------|---------|
| MONGO_URI | MongoDB connection string | mongodb://localhost:27017/my_notes_app_db |
| JWT_SECRET | Secret key for JWT | mysecretkey123 |
| PORT | Backend port | 5000 |
| NODE_ENV | Environment | development |

# API Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | /api/auth/register | Register user | no |
| POST | /api/auth/login | Login user | no |
| GET | /api/notes | Get all notes | yes |
| POST | /api/notes | Create note | yes |
| PUT | /api/notes/:id | Update note | yes |
| DELETE | /api/notes/:id | Delete note | yes |
| GET | /api/notes/search?q= | Search notes | yes |
| POST | /api/notes/:id/collaborators | Add collaborator | yes |

# Project Structure

my-notes-app/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   └── Note.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── notes.js
│   ├── .env.example
│   └── server.js
├── frontend/
│   └── src/
│       ├── components/
│       │   └── Navbar.jsx
│       ├── context/
│       │   └── AuthContext.jsx
│       └── pages/
│           ├── Login.jsx
│           ├── Register.jsx
│           ├── Dashboard.jsx
│           └── NoteDetail.jsx
└── README.md