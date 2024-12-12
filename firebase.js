// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCiVY3ST9SI9Bs7SIH_pCs9h1P13OfY4LQ",
  authDomain: "final-project-cd114.firebaseapp.com",
  projectId: "final-project-cd114",
  storageBucket: "final-project-cd114.firebasestorage.app",
  messagingSenderId: "638750250746",
  appId: "1:638750250746:web:c5d16e5a3504a0163a9b43",
  measurementId: "G-LY1LTBN4HG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { db };