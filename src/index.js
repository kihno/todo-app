import './stylesheet.css';
import {user} from './user.js';
import {events} from './events.js';
import {getData} from './firebase.js';

// getData();

window.onload = function() {
    events.renderProjectList();
    events.renderTasks(user.inbox.tasks);
};