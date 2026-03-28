# ♻️ Waste Management System

A full-stack multi-platform Waste Management System consisting of:

* 🚀 **Backend (Spring Boot)** — REST API for authentication, complaints, and admin operations
* 🖥️ **Admin Dashboard (React + TypeScript)** — Web interface for administrators
* 📱 **Mobile App (React Native)** — User-facing app for submitting and tracking complaints

---

## 🏗️ Project Structure

```
.
├── backend/                # Spring Boot API
├── admin/                  # React Admin Dashboard
├── wastagemangementapp/    # React Native Mobile App
└── .gitignore
```

---

## ⚙️ Tech Stack

### Backend

* Java 17
* Spring Boot 4
* PostgreSQL
* JWT Authentication
* Cloudinary (Image Upload)
* Gmail SMTP (Email Service)

### Admin Dashboard

* React 19 + TypeScript
* Vite
* Redux Toolkit
* TailwindCSS + shadcn/ui
* Chart.js

### Mobile App

* React Native 0.84
* React Navigation
* Axios
* AsyncStorage
* Camera & Geolocation APIs

---

## 🔗 System Architecture

```
Mobile App / Admin Panel
          ↓
      REST API (Spring Boot)
          ↓
     PostgreSQL Database
          ↓
   Cloudinary (Images)
```

---

## 🚀 Getting Started

### 1️⃣ Clone Repository

```bash
git clone <your-repo-url>
cd wastagemanagmentapp
```

---

## 🔧 Backend Setup (Spring Boot)

```bash
cd backend
```

### Create `.env`

```
POSTGRES_URL=jdbc:postgresql://localhost:5432/wastemanagement
POSTGRES_USER=your_db_user
POSTGRES_PASSWORD=your_db_password
JWT_SECRET_KEY=your_secret_key

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

EMAIL=your_email@gmail.com
EMAIL_PASSWORD=your_email_password

FRONTEND_URL=http://localhost:5173
```

### Run Backend

```bash
mvn clean install
mvn spring-boot:run
```

### API Base URL

```
http://localhost:8080/api
```

---

## 🖥️ Admin Dashboard Setup

```bash
cd admin
npm install
npm run dev
```

### Runs on:

```
http://localhost:5173
```

---

## 📱 Mobile App Setup (React Native)

```bash
cd wastagemangementapp
npm install
npm start
```

### Run on Android

```bash
npm run android
```

### Run on iOS

```bash
npm run ios
```

---

## 📸 App Screenshots

### 🔑 Authentication Screens

![Login Screen](screenshots/login.jpg)
![Signup Screen](screenshots/signup.jpg)

### 📱 User App Screens

![Report Issue](screenshots/report.jpg)
![Add Complaint](screenshots/add.jpg)
![Location Detection](screenshots/location.jpg)
![Success Popup](screenshots/success.jpg)

> 💡 These screens demonstrate real-time complaint submission, image capture, and GPS-based location tracking.

---

## 🔐 Features

### Authentication

* JWT-based login/signup
* OTP-based password reset
* Role-based access (Admin / District Admin / User)

### Complaint System

* Create complaints with images
* Track complaint status
* District-wise filtering
* Admin status updates

### Admin Dashboard

* Manage district admins
* View complaint statistics
* Monitor all complaints

### Media & Email

* Cloudinary image uploads
* Gmail SMTP email notifications

---

## 📡 API Overview

### Auth

```
POST /auth/signup
POST /auth/login
POST /auth/forgot-password
POST /auth/reset-password
```

### Complaints

```
GET /complaints
POST /complaints
GET /complaints/{id}
PUT /complaints/{id}
```

### Admin

```
POST /admin/district-admin
GET /admin/complaints
PUT /admin/complaints/{id}/status
GET /admin/stats
```

---

## 🗄️ Database Tables

### User

* id
* email
* password
* role
* district_id

### Complaint

* id
* title
* description
* status
* image_url

### District

* id
* name

---

---

## ⚠️ Known Issues / Improvements

* Add proper README for `admin/` and `mobile/`
* Fix naming typo: `wastagemangementapp` → `wastemanagementapp`
* Add centralized environment config for frontend
* Improve error handling UI

---

## 🤝 Contributing

```bash
git checkout -b feature/your-feature
git commit -m "Add feature"
git push origin feature/your-feature
```

---

## 📄 License

MIT License

---

## ❤️ Author

**Biraj Roy**

---

## ⭐ If you like this project

Give it a star on GitHub ⭐
