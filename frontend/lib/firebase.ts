// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCr2TjJIpXdR5Uq4WBjZF6yZmmgN2TfytE",
  authDomain: "employee-attendance-syst-1b302.firebaseapp.com",
  projectId: "employee-attendance-syst-1b302",
  storageBucket: "employee-attendance-syst-1b302.firebasestorage.app",
  messagingSenderId: "1094147594900",
  appId: "1:1094147594900:web:ea8aa9f1e85059f2707281"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;