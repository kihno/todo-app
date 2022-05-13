import './stylesheet.css';
import {user} from './user.js';
import {events} from './events.js';

window.onload = function() {
    events.renderProjectList();
    events.renderTasks(user.inbox.tasks);
};