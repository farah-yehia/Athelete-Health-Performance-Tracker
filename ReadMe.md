# Athlete Health & Performance Tracking System 🏃‍♂️💡

An integrated real-time system to monitor and predict the health and performance of athletes using IoT, AI, and cloud-based technologies.

## 🔍 Project Overview

This system addresses the need for continuous health tracking of athletes during training or matches by combining wearable sensors, AI analysis, and a real-time web dashboard.

## 🧩 System Components

### 1. Embedded Systems
- ESP32-based sensors collect biometric data (heart rate, distance, etc.)
- Real-time transmission to the server

### 2. Artificial Intelligence
- Real-time fatigue detection model
- Post-match AI model predicts safe maximum playtime

### 3. Web Application
The web dashboard acts as the central interface for doctors and admins, offering visualization, user management, and access to AI results.

Tech Stack:

Frontend: React.js with Material-UI

Backend: Node.js with Express.js

Database: MongoDB Atlas

Authentication: JSON Web Token (JWT) with role-based access control

Key Functionalities:

🧑‍⚕️ Doctor View

View assigned players’ health stats in real-time

Edit player profiles (age, weight, contact info, availability)

Monitor fatigue alerts and post-match AI reports

🛠️ Admin View

Full control over all doctors and player assignments

Add/remove doctors and manage roles

📊 Dashboard Features

Live health data: Heart rate, calories, distance, BMI

Health lifecycle tracking for each player

Role-aware UI (admin vs doctor)

🔐 Security

Encrypted JWT token authentication

Protected routes based on user roles

Secure API endpoints
### 4. Cloud Infrastructure
- Deployed on AWS EC2
- Flask-based AI API for predictions
- MongoDB Atlas for remote data storage

## 🚀 Features
📡 Real-time biometric tracking from embedded devices

🔍 AI-powered insights (fatigue alerts + max playtime prediction)

👥 Role-based login for Doctors and Admins

🧠 AI integration through Flask API

🗂️ Doctor and player data management dashboard

☁️ Scalable cloud deployment using AWS

