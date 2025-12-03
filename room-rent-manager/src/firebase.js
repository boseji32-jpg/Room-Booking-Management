// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAek7JAJgwC1Ue3NNxygCmo8FHqtXeitCM",
    authDomain: "room-management-6c53f.firebaseapp.com",
    projectId: "room-management-6c53f",
    storageBucket: "room-management-6c53f.firebasestorage.app",
    messagingSenderId: "788167083306",
    appId: "1:788167083306:web:7d5357a7c61618022a0a53"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Authentication
export const auth = getAuth(app);

// Initialize Storage
export const storage = getStorage(app);

export default app;
