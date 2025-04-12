// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyBQM63yuwWpfS6Fw373pYioMn5H2cP-M4s",
    authDomain: "fixsite.firebaseapp.com",
    projectId: "fixsite",
    storageBucket: "fixsite.firebasestorage.app",
    messagingSenderId: "501209400097",
    appId: "1:501209400097:web:b484a8f81c730fa40fb460"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut };