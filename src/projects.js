import {pubsub} from './pubsub.js';

export class Projects {

    constructor(title, user, id, tasks) {
        this.title = title;
        this.user = user;
        this.id = id;
        this.tasks = tasks || [];
    }

    addTask(task) {
        this.tasks.push(task);
        pubsub.pub('taskAdded', this.tasks);
    }

    removeTask(task) {
        let index = this.tasks.indexOf(task);
        this.tasks.splice(index,1);
        pubsub.pub('taskDeleted', this.tasks);
    }
}