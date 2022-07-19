import './stylesheet.css';
import {user} from './user.js';
import {events} from './events.js';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  onSnapshot,
  setDoc,
  updateDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { getPerformance } from 'firebase/performance';

const firebaseApp = initializeApp({
    apiKey: "AIzaSyCwWjjkVEmHINHnKaa_q6eLe2vcQd45vDs",
    authDomain: "taskmaster-ea636.firebaseapp.com",
    projectId: "taskmaster-ea636",
    storageBucket: "taskmaster-ea636.appspot.com",
    messagingSenderId: "181039207649",
    appId: "1:181039207649:web:51255b586d79ecea9d53a0",
    measurementId: "G-TN47PFL09T"
});

async function signIn() {
    var provider = new GoogleAuthProvider();
    await signInWithPopup(getAuth(), provider);
}

function signOutUser() {
    // Sign out of Firebase.
    signOut(getAuth());
}

initializeApp(firebaseApp);

window.onload = function() {
    events.renderProjectList();
    events.renderTasks(user.inbox.tasks);
};