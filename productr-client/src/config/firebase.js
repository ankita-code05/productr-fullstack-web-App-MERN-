// src/config/firebase.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBlns7T9dUSjTSMgMIyQ_qDoiRXHmbbq0o",
  authDomain: "productr-a1654.firebaseapp.com",
  projectId: "productr-a1654",
  storageBucket: "productr-a1654.firebasestorage.app",
  messagingSenderId: "151708762519",
  appId: "1:151708762519:web:a6d65d6e1bd9d26d3504d2"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);