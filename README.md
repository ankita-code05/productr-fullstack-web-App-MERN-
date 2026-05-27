# Productr — Full Stack Web App

A full-stack product management platform built with **React.js**, **Node.js**, **Express.js**, and **MongoDB**, developed as part of the Orufy Technologies Full Stack Developer Assignment.

## 🔗 Live Demo

- **Frontend:** [https://productr-fullstack-web-app-mern.vercel.app](https://productr-fullstack-web-app-mern.vercel.app)
- **Backend API:** [https://productr-fullstack-web-app-mern.onrender.com/api](https://productr-fullstack-web-app-mern.onrender.com/api)

---

## 📁 Folder Structure

```
Productr/
├── productr-client/       # React.js Frontend
│   ├── public/
│   └── src/
│       ├── components/    # Reusable UI components
│       ├── config/        # Firebase configuration
│       ├── context/       # React context (auth, products)
│       ├── hooks/         # Custom hooks
│       ├── pages/         # Page components
│       ├── services/      # API & auth service calls
│       ├── styles/        # CSS files
│       └── utils/         # Utility functions
│
└── productr-server/       # Node.js + Express Backend
    ├── config/            # DB & Cloudinary config
    ├── controllers/       # Route controllers
    ├── middleware/        # Auth & error middleware
    ├── models/            # Mongoose models
    ├── routes/            # Express routes
    └── services/          # Email service (Resend)
```

---

## ⚙️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js, Axios, React Router |
| Backend | Node.js, Express.js |
| Database | MongoDB (Mongoose) |
| Auth | Firebase (Phone OTP) + Custom Email OTP |
| Email | Resend API |
| Image Upload | Cloudinary |
| Deployment | Vercel (frontend), Render (backend) |

---

## 🚀 How to Run Locally

### Prerequisites
- Node.js v18+
- MongoDB URI (Atlas or local)
- Firebase project
- Resend API key
- Cloudinary account

---

### 1. Clone the Repository

```bash
git clone https://github.com/ankita-code05/productr-fullstack-web-App-MERN-.git
cd productr-fullstack-web-App-MERN-
```

---

### 2. Run the Backend

```bash
cd productr-server
npm install
```

Create a `.env` file in `productr-server/`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

# Resend (Email OTP)
RESEND_API_KEY=your_resend_api_key

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Start the server:

```bash
npm run dev
```

Backend runs on: `http://localhost:5000`

---

### 3. Run the Frontend

```bash
cd productr-client
npm install
```

Create a `.env` file in `productr-client/`:

```env
REACT_APP_API_BASE_URL=http://localhost:5000/api

# Firebase
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

Start the app:

```bash
npm start
```

Frontend runs on: `http://localhost:3000`

---

## 🌐 Deployment

### Frontend — Vercel
- Root directory: `productr-client`
- Build command: `npm run build`
- Output directory: `build`
- Environment variables: same as `.env` above (with production backend URL)

### Backend — Render
- Root directory: `productr-server`
- Build command: `npm install`
- Start command: `npm start`
- Environment variables: same as `.env` above

---

## 📌 API Endpoints

### Auth Routes `/api/auth`
| Method | Endpoint | Description |
|---|---|---|
| POST | `/request-otp` | Send OTP to email |
| POST | `/verify-otp` | Verify email OTP |
| POST | `/resend-otp` | Resend OTP to email |
| POST | `/phone-login` | Login via phone number |

### Product Routes `/api/products`
| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Get all products |
| POST | `/` | Create a product |
| PUT | `/:id` | Update a product |
| DELETE | `/:id` | Delete a product |

---

## ✅ Features

- 🔐 Dual authentication — Email OTP & Phone OTP (Firebase)
- 📦 Full CRUD for product management
- 🖼️ Image upload via Cloudinary
- 📱 Responsive design for desktop & mobile
- ⚡ Loading states and error handling throughout
- 🌍 Fully deployed and accessible online

---

## 👩‍💻 Developed By

**Ankita Tiwari**  
Full Stack Developer  
GitHub: [@ankita-code05](https://github.com/ankita-code05)