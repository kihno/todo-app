import './stylesheet.css';
import {user} from './user.js';
import {events} from './events.js';

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, getDocs } from 'firebase/firestore/lite';

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

const colRef = collection(db, 'tasks');

getDocs(colRef)
.then((snapshot) => {
    let tasks = [];
    snapshot.docs.forEach((doc) => {
        tasks.push({ ...doc.data(), id: doc.id })
    });

    console.log(tasks);
}).catch((err) => { console.log(err) });

window.onload = function() {
    events.renderProjectList();
    events.renderTasks(user.inbox.tasks);
};