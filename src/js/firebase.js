import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";


const firebaseConfig = {
  apiKey: "AIzaSyAe5KeqrUZ1odHfmd7cWwqkWTzeFE_exMI",
  authDomain: "board-dcffd.firebaseapp.com",
  projectId: "board-dcffd",
  storageBucket: "board-dcffd.firebasestorage.app",
  messagingSenderId: "220056896693",
  appId: "1:220056896693:web:ed70b899565e79f0292afc",
  measurementId: "G-YVZSLSFK5T"
};


const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);