import {Projects} from './projects';
import {events} from './events.js';

export const user = (() => {
    let inbox = new Projects('inbox');
    let todayInbox = new Projects('today');
    let weekInbox = new Projects('week');
    let allProjects = JSON.parse(localStorage.getItem('allProjects')) || [];

    function init() {
        if (allProjects.length === 0) {

            allProjects.push(inbox, todayInbox, weekInbox);
            localStorage.setItem('allProjects', JSON.stringify(allProjects));

        } else {

            inbox = new Projects(allProjects[0].title, allProjects[0].tasks);
            todayInbox = new Projects(allProjects[1].title, allProjects[1].tasks);
            weekInbox = new Projects(allProjects[2].title, allProjects[2].tasks);

            events.renderProjectList();
        }
        events.renderTasks(inbox.tasks);
    }

    return {inbox, todayInbox, weekInbox, allProjects, init}
})();