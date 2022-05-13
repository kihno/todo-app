import {pubsub} from './pubsub.js';

export class Projects {

    constructor(title, tasks) {
        this.title = title;
        this.tasks = tasks || [];
    }

    addTask(task) {
        this.tasks.push(task);
        // user.setStorage();
        pubsub.pub('taskAdded', this.tasks);
    }

    removeTask(task) {
        let index = this.tasks.indexOf(task);
        this.tasks.splice(index,1);
        // user.setStorage();
        pubsub.pub('taskDeleted', this.tasks);
    }
}