// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyD2CA5jNOuqMfwUj8mfSArmv5DEt4n3uuo",
    authDomain: "project-caffeine-tracker.firebaseapp.com",
    databaseURL: "https://project-caffeine-tracker-default-rtdb.firebaseio.com",
    projectId: "project-caffeine-tracker",
    storageBucket: "project-caffeine-tracker.firebasestorage.app",
    messagingSenderId: "158864637773",
    appId: "1:158864637773:web:c5b41950bc1be1c3c08104",
    measurementId: "G-F7BHTNZYPP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const rtdb = getDatabase(app);

export { app, analytics, db, rtdb };