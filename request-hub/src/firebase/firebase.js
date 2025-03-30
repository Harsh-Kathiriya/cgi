import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, addDoc, setDoc, getDocs, query, where, updateDoc, serverTimestamp } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyD8JO4LNOiECVW5vIMclHPZTT7tJ-Rvtng",
    authDomain: "uainnovatecgi.firebaseapp.com",
    projectId: "uainnovatecgi",
    storageBucket: "uainnovatecgi.firebasestorage.app",
    messagingSenderId: "935719518395",
    appId: "1:935719518395:web:72f6bb74ef7a7affc3a99e",
    measurementId: "G-KQVTYYR1BV"
  };

  const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { db, auth, provider, doc, setDoc, updateDoc, collection, addDoc, getDocs, query, where, serverTimestamp };