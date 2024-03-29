import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, addDoc, deleteDoc, updateDoc, getDoc } from 'firebase/firestore/lite';
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { pubsub } from './pubsub';

const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    databaseUrl: process.env.REACT_APP_DATABASE_URL,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID,
    measurementId: process.env.REACT_APP_MEASUREMENT_ID,
};

initializeApp(firebaseConfig);

const db = getFirestore();
const auth = getAuth();
const provider = new GoogleAuthProvider;

export const usersRef = collection(db, 'users');
export const taskRef = collection(db, 'tasks');
export const projectRef = collection(db, 'projects');

export const storeTask = (task) => {
    addDoc(taskRef, task);
}

export const updateTask = (id, updatedTask) => {
    const docRef = doc(db, 'tasks', id);

    updateDoc(docRef, updatedTask)
}

export const deleteStoredTask = (id) => {
    const docRef = doc(db, 'tasks', id);
    deleteDoc(docRef);
}

export const storeProject = (project) => {
    addDoc(projectRef, project);
}

export const deleteStoredProject = (id) => {
    const docRef = doc(db, 'projects', id);
    deleteDoc(docRef);
}

export const signInUser = () => {
    signInWithPopup(auth, provider)
        .then((result) => {
            console.log('login successful')
        }).catch((err) => {
            console.log(err);
        });
}

export const signOutUser = () => {
    signOut(auth)
        .then(() => {
            console.log('user signed out');
        }).catch((err) => {
            console.log(err);
        });
}

onAuthStateChanged(auth, (authUser) => {
    if (authUser) {
        pubsub.pub('userLoggedIn', authUser);
    } else {
        pubsub.pub('userLoggedOut');
    }
});
