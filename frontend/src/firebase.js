import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAv9mQcMijaKgGEC2jlJcoBevhgZ-W__Iw",
  authDomain: "facebook-clone-14e3a.firebaseapp.com",
  projectId: "facebook-clone-14e3a",
  storageBucket: "facebook-clone-14e3a.firebasestorage.app",
  messagingSenderId: "604297319645",
  appId: "1:604297319645:web:281ce0da6b942bbbf37734",
  measurementId: "G-YTF604SLQ6"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

export const storage = getStorage();
export const db = getFirestore(app);
