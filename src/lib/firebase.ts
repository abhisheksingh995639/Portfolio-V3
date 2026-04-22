import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAK851zwfCVM2oOM4cL3of433eZfLazap8",
  authDomain: "portfolio-v2-5bdb4.firebaseapp.com",
  projectId: "portfolio-v2-5bdb4",
  storageBucket: "portfolio-v2-5bdb4.firebasestorage.app",
  messagingSenderId: "138567382146",
  appId: "1:138567382146:web:dc27ac9a63a6f6215e709b",
  measurementId: "G-0ZQD04LSJJ"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
