# Productr — Full Stack Web App

A full-stack product management platform built with React, Node.js, Express, and MongoDB.

## Tech Stack
- **Frontend:** React.js, Context API
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas
- **Auth:** JWT + Firebase Phone OTP
- **Image Upload:** Cloudinary

## Folder Structure
productr/
├── productr-client/    # React frontend
└── productr-server/    # Node.js backend

## Backend Setup
cd productr-server
npm install

Create .env file with:
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_gmail
EMAIL_PASS=your_gmail_app_password
FAST2SMS_API_KEY=your_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret

Run: npm run dev

## Frontend Setup
cd productr-client
npm install

Create .env file with:
REACT_APP_API_BASE_URL=http://localhost:5000/api
REACT_APP_FIREBASE_API_KEY=your_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_domain
REACT_APP_FIREBASE_PROJECT_ID=your_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_id
REACT_APP_FIREBASE_APP_ID=your_id

Run: npm start

## API Endpoints

### Auth
POST /api/auth/request-otp
POST /api/auth/verify-otp
POST /api/auth/resend-otp
POST /api/auth/phone-login

### Products
GET    /api/products
POST   /api/products
PUT    /api/products/:id
DELETE /api/products/:id
PATCH  /api/products/:id/publish
POST   /api/products/upload-images
