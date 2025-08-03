This is a secure RESTful API backend for a Doctor Prescription Management System. It provides functionality for Admins, Doctors, and Users (Patients) with robust authentication, role-based authorization, and features like secure password hashing and JWT-based session management.

🚀 Features
🔐 Authentication & Authorization

>JWT (JSON Web Token) authentication

>Role-based access (Admin, Doctor, User)

>Secure login and protected routes

🧑‍⚕️ Doctor Module

>Doctor registration and login

>View assigned patients and prescriptions

>Create and update prescriptions

👨‍💼 Admin Module

>Admin login

>Manage users and doctors

>Approve or remove doctors

🧑 User Module

>User registration and login

>Book appointments

>View personal prescriptions and doctor info

🔐 Security

>Passwords hashed using bcrypt

>Protected routes using middleware

>JWT token validation for all requests

🛠️ Tech Stack
>Backend Framework: Node.js + Express

>Database: MongoDB + Mongoose

>Authentication: JWT

>Password Hashing: bcrypt

>Environment Config: dotenv

📁 Folder Structure

├── controllers/       # Business logic for each module
├── models/            # Mongoose schemas
├── routes/            # API route handlers
├── middlewares/       # Auth & role check middleware
├── utils/             # Utility functions
├── config/            # DB and environment setup
├── .env               # Environment variables
├── server.js          # Entry point
