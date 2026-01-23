# Yubi

Yubi is a campus-focused MERN application that enables students within the same organization to securely authenticate and communicate in real time. The project is designed with scalability in mind and serves as a foundation for future peer-to-peer resource sharing features.

---

## Overview

Yubi provides a secure, real-time communication platform for students using modern full-stack technologies. The application emphasizes clean architecture, protected routes, and persistent real-time interactions.

---

## Features

- Campus-restricted user authentication using JWT
- Secure login and signup with HTTP-only cookies
- Real-time one-to-one chat using Socket.IO
- Online and offline user presence detection
- Persistent message storage with MongoDB
- Protected backend routes with middleware
- Responsive UI built with Tailwind CSS
- Modular backend structure for scalability

---

## Tech Stack

### Frontend
- React (Vite)
- Tailwind CSS
- Zustand
- Axios

### Backend
- Node.js
- Express.js
- Socket.IO
- JWT Authentication

### Database
- MongoDB Atlas
- Mongoose

### Tools
- Git and GitHub
- REST APIs
- Cloudinary (media handling)

---


## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas
- npm


```bash
# Backend Setup
cd backend
npm install

# Create a .env file inside the backend directory:

PORT=5000
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret

# Start the backend server:

npm run dev

# Frontend Setup:

cd frontend
npm install
npm run dev


# The frontend will run at:

http://localhost:5173

```

### Authentication Flow:

- Users sign up using a campus email ID
- JWT tokens are issued and stored in HTTP-only cookies
- Protected routes ensure authenticated access
- Session persistence is handled using /auth/check

---

## Author

Tanya Kudaisya
