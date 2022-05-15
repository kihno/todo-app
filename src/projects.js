import {pubsub} from './pubsub.js';

export class Projects {

    constructor(title, tasks) {
        this.title = title;
        this.tasks = tasks || [];
    }

    addTask(task) {
        this.tasks.push(task);
        pubsub.pub('taskAdded', this.tasks);
        console.log(this.tasks);
    }

    removeTask(task) {
        let index = this.tasks.indexOf(task);
        this.tasks.splice(index,1);
        pubsub.pub('taskDeleted', this.tasks);
    }
}