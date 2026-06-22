# 🏥 MedCare — Hospital Management System

A full-stack Hospital Management System built to streamline patient care, doctor scheduling, billing, and hospital operations through a clean, modern dashboard.

![Tech](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react)
![Tech](https://img.shields.io/badge/Node.js-Express-339933?style=flat&logo=node.js)
![Tech](https://img.shields.io/badge/MySQL-Database-4479A1?style=flat&logo=mysql)
![Tech](https://img.shields.io/badge/JWT-Auth-black?style=flat&logo=jsonwebtokens)

---

## 📌 Overview

MedCare is a complete Hospital Management System designed for hospital staff to manage patients, doctors, appointments, billing, and reports — all from a single, secure dashboard. It replaces manual record-keeping with a centralized digital workflow.

---

## ✨ Features

- 🔐 **Secure Authentication** — JWT-based login with bcrypt password hashing
- 📊 **Interactive Dashboard** — Real-time stats, patient trends, and appointment overview with charts
- 👤 **Patient Management** — Add, search, and manage patient records with downloadable PDF reports
- 👨‍⚕️ **Doctor Management** — Maintain doctor profiles with specialization-based filtering
- 📅 **Appointment Scheduling** — Book appointments linking patients and doctors with live status tracking
- 💰 **Billing & Invoicing** — Generate and track patient bills with downloadable PDF invoices
- 📈 **Statistics & Analytics** — Visual insights including weekly trends and a top-doctors leaderboard
- 🔔 **Real-Time Notifications** — Click-to-navigate alerts for new patients, appointments, and payments
- 🤖 **AI Assistant** — Symptom-based guidance powered by the Groq LLM API
- ⚙️ **Hospital Settings** — Profile customization, logo upload, staff management, and data backup

---

## 🛠️ Tech Stack

**Frontend**
- React.js (Create React App)
- Recharts (data visualization)
- React Icons
- jsPDF (PDF generation)

**Backend**
- Node.js + Express.js
- MySQL (relational database)
- JWT + bcrypt.js (authentication & security)
- Groq SDK (AI integration)

---

## 📂 Project Structure

---

## 🚀 Getting Started

### Prerequisites
- Node.js installed
- MySQL Server installed

### 1. Clone the repository
```bash
git clone https://github.com/naushadkhan18072003-cyber/medcare-hospital-management.git
cd medcare-hospital-management
```

### 2. Set up the database
Create a MySQL database named `hospital_db` and run the schema (tables: `patients`, `doctors`, `appointments`, `users`, `bills`).

### 3. Configure environment variables
Create a `.env` file inside the `backend` folder:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=hospital_db
PORT=5000
JWT_SECRET=your_jwt_secret
GROQ_API_KEY=your_groq_api_key
```

### 4. Install dependencies & run

**Backend:**
```bash
cd backend
npm install
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
npm start
```

App will be available at `http://localhost:3000`, API at `http://localhost:5000`.

---

## 🔮 Future Enhancements

- Role-based access control (Doctor / Receptionist / Admin views)
- SMS/Email appointment reminders
- Pharmacy & inventory management module

---

## 👤 Author

**Naushad Khan**
[GitHub](https://github.com/naushadkhan18072003-cyber)

---

⭐ If you found this project useful, consider giving it a star!