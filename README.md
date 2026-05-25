markdown
# 🏨 Booking System (Full Stack Web App)

A full-stack **hotel booking platform** built with:

- React (Frontend)
- Node.js + Express (Backend)
- PostgreSQL (Database)
- Cloudinary (Image Storage)
- JWT Authentication
- Zod Validation
- REST API Architecture
- Deployed with Vercel (Frontend) and Render (Backend)
- Database hosted on Neon PostgreSQL

---

## 🚀 Live Demo

👉 [https://booking-system-xi-three.vercel.app/](https://booking-system-xi-three.vercel.app/)

---

## 📌 Project Purpose

The main purpose of this project was to:

- Learn and implement **PostgreSQL (SQL) in a real-world full-stack application**
- Replace MongoDB with a **relational database approach**
- Understand:
  - Database migrations
  - SQL schema design
  - Relationships (users, rooms, bookings, images)
  - Foreign keys and constraints
- Build a production-ready booking system with authentication and admin control

---

## 🧱 Tech Stack

### Frontend
- React (Vite)
- Axios
- React Router
- Tailwind CSS

### Backend
- Node.js
- Express.js
- PostgreSQL (Neon)
- node-pg-migrate (migrations)
- JWT Authentication
- bcrypt (password hashing)
- Zod (validation)

### Cloud & Deployment
- Neon (PostgreSQL database)
- Cloudinary (image uploads)
- Render (backend hosting)
- Vercel (frontend hosting)
- GitHub (version control)

---

## 🗄️ Database Structure

### Tables:
- users
- rooms
- bookings
- room_images

### Key Relationships:
- A user can have many bookings
- A room can have many bookings
- A room can have multiple images
- Bookings reference users and rooms via foreign keys

---

## 🔐 Authentication

- JWT-based authentication
- Passwords hashed using bcrypt
- Role-based access control:
  - `user`
  - `admin`

Admin can:
- Create rooms
- Manage bookings
- Change booking status

---

## 🏨 Features

### User Features
- Register / Login
- Browse rooms
- View room details
- Book rooms
- Upload images (via Cloudinary)

### Admin Features
- Create / update rooms
- Manage bookings
- Change booking status after payment
- Upload multiple images per room

---

## 📸 Image System

- Images stored using **Cloudinary**
- PostgreSQL stores only image URLs
- Each room supports multiple images via `room_images` table

---

## 📦 API Structure

### Auth
- POST `/api/auth/register`
- POST `/api/auth/login`

### Rooms
- GET `/api/rooms`
- POST `/api/admin/createRoom`

### Bookings
- POST `/api/bookings`

---

## 🧠 Key Learning Outcomes

This project helped me deeply understand:

- SQL vs MongoDB differences
- Database normalization
- Foreign key constraints
- Migrations workflow
- Backend architecture (services → controllers → routes)
- Production deployment with separate frontend/backend
- Handling CORS in production
- JWT authentication flow

---

## ⚙️ Environment Variables

### Backend `.env`

```env
DATABASE_URL=
JWT_SECRET=
CLOUDINARY_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
🚀 How to Run Locally
Backend
bash
cd server
npm install
npm run migrate:up
npm run dev
Frontend
bash
cd client
npm install
npm run dev
📌 Deployment Architecture
text
Frontend (Vercel)
   ↓
Backend (Render)
   ↓
Database (Neon PostgreSQL)
   ↓
Cloudinary (Images)
👨‍💻 Author
Built by Amjad Khan

GitHub: https://github.com/amjadKha-n1
