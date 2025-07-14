🏃‍♂️ Athlete Health & Performance Tracking System 💡
An integrated real-time system designed to monitor, manage, and predict athlete performance and health metrics using IoT devices, AI models, and a full-stack web platform with cloud deployment.

🔍 Project Overview
This system addresses a growing need in sports technology: enabling continuous, real-time health tracking and AI-driven decision support for athletes.
The solution connects wearable sensors, artificial intelligence, and a modern web application to give doctors and admins immediate access to player status and predictions.

🧩 System Components
1. Embedded Systems
Built using ESP32 microcontrollers and biometric sensors (heart rate, distance tracking)

Sends real-time data to the cloud over Wi-Fi using MQTT/HTTP

2. Artificial Intelligence
Real-Time Fatigue Detection Model
Triggers alerts during gameplay or training when overexertion is detected.

Post-Match Prediction Model
Analyzes performance history to predict the player's safe maximum playtime.

3. 🌐 Web Application (Main Component)
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

4. ☁️ Cloud Infrastructure
Deployment: AWS EC2 instance hosting Node.js + React frontend + Flask AI service

AI Inference: Served via Flask REST API

Database: MongoDB Atlas (cloud-hosted, secured, scalable)

Reverse Proxy: NGINX setup for routing and scalability

🚀 Key Features
📡 Real-time biometric tracking from embedded devices

🔍 AI-powered insights (fatigue alerts + max playtime prediction)

👥 Role-based login for Doctors and Admins

🧠 AI integration through Flask API

🗂️ Doctor and player data management dashboard

☁️ Scalable cloud deployment using AWS
