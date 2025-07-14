# 🌐 Athlete Health & Performance Tracking Real Time Dashboard

This repository contains the **Web Application** component of our graduation project:  
**“Athlete Health & Performance Tracking System”** — a full-stack solution for real-time athlete monitoring, health insights, and AI-driven performance prediction.

This platform enables **doctors** and **admins** to monitor player health data collected via wearable devices, access AI insights, and manage athlete records through a secure, role-based web dashboard.

---

## 📌 Repository Purpose

🔗 **This repository is dedicated to the Web App only**, which includes:
- Frontend (React.js)
- Backend (Node.js, Express)
- Role-based JWT authentication
- Real-time dashboard UI
- Cloud deployment setup


## 🧩 Web App Overview

### 🔐 Authentication
- **Role-based login**: Admin & Doctor
- JWT-based token system for secure access
- Separate signup/login flows with protected routes

### 👥 User Roles

#### Doctor
- View assigned players' health data in real-time
- Edit player information (age, weight, availability, contact)
- View fatigue risk alerts and AI-predicted max playtime

#### Admin
- Manage doctor accounts (add/edit/delete)
- Assign or reassign doctors to teams
- View all players across all doctors

### 📊 Real-Time Dashboard
- Displays live data:  
  - Heart Rate  
  - Distance Covered  
  - Calories Burned  
  - BMI  
- Health status updates using color indicators
- AI result pop-ups for fatigue prediction or safe playtime estimation

---

## 🧱 Tech Stack

| Layer        | Technology              |
|--------------|--------------------------|
| Frontend     | React.js, Material-UI    |
| Backend      | Node.js, Express.js      |
| Database     | MongoDB Atlas (Cloud)    |
| Auth         | JWT (Role-based access)  |
| Deployment   | AWS EC2 + NGINX          |

---

## ☁️ Deployment Overview

- Frontend and backend deployed on **AWS EC2**
- Reverse proxy via **NGINX**
- MongoDB Atlas used for **secure, scalable data storage**
- Real-time AI insights fetched from a Flask API hosted on the cloud

---

## 📁 Folder Structure (Web Repo Only)

```

athlete-web/
│
├── client/               # React.js frontend
│   ├── components/       # Dashboard UI components
│   ├── pages/            # Auth, Doctor, Admin pages
│   └── services/         # API handling
│
├── server/               # Node.js backend
│   ├── controllers/      # Auth, Doctor, Player logic
│   ├── models/           # Mongoose schemas (Doctor, Player, Admin)
│   ├── routes/           # Auth, Doctor, Admin API routes
│   └── middleware/       # JWT, error handling
│
├── .env.example          # Sample environment variables
└── README.md             # Project documentation (this file)

```

---

## 🚀 Features Summary

- Real-time health monitoring via UI
- Doctor/Admin account management
- Player data editing
- Role-specific dashboards
- Integration with embedded system and AI API
- Deployed securely on AWS

---

## 🔒 Security Notes

- All routes are secured with JWT
- Role-based protection is implemented both on the frontend and backend
- Sensitive environment variables are stored securely and never pushed to the repo

---


