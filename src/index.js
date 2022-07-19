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
import { getFirebaseConfig } from './firebase-config.js';

async function signIn() {
    var provider = new GoogleAuthProvider();
    await signInWithPopup(getAuth(), provider);
}

events.signInButton.addEventListener('click', () => {
    signIn();
});

function signOutUser() {
    signOut(getAuth());
}

function getProfilePicUrl() {
    return getAuth().currentUser.photoURL || '/images/profile_placeholder.png';
}

function getUserName() {
    return getAuth().currentUser.displayName;
}

function isUserSignedIn() {
    return !!getAuth().currentUser;
}

const firebaseAppConfig = getFirebaseConfig();
initializeApp(firebaseAppConfig);

window.onload = function() {
    events.renderProjectList();
    events.renderTasks(user.inbox.tasks);
};