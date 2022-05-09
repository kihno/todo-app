import './stylesheet.css';
import {user} from './user.js';
import {events} from './events.js';
import {pubsub} from './pubsub.js';
import {Projects} from './projects.js';
import {Tasks} from './tasks.js';

window.onload = function() {
    user.init();
    events.renderProjectList();
    events.renderTasks(user.inbox.tasks);
};