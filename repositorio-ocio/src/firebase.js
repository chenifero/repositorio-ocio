// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import {getAuth, GoogleAuthProvider} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC8mopmCBzjIVJtKVu6rqK-LtTkts1VPbY",
  authDomain: "repositoriopeliculas-c946f.firebaseapp.com",
  projectId: "repositoriopeliculas-c946f",
  storageBucket: "repositoriopeliculas-c946f.firebasestorage.app",
  messagingSenderId: "925200997614",
  appId: "1:925200997614:web:c9d149ede1b1fe28c3e7ff",
  measurementId: "G-2KY5PJJ9JV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();