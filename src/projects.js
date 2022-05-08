import {pubsub} from './pubsub.js';

export class Projects {

    constructor(title, tasks) {
        this.title = title;
        this.tasks = tasks || [];
    }

    addTask(task) {
        this.tasks.push(task);
        pubsub.pub('taskAdded', this.tasks);
    }

    removeTask(task) {
        // const index = task.getAttribute('data-index');
        // if (index > -1) {
        //     this.tasks.splice(index, 1);
        // }
        let index = this.tasks.indexOf(task);
        this.tasks.splice(index,1);
        pubsub.pub('taskDeleted', this.tasks);
    }
}