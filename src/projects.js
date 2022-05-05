import {pubsub} from './pubsub.js';

export class Projects {

    constructor(title, tasks) {
        this.title = title;
        this.tasks = tasks || [];
    }

    addTodo(todo) {
        this.tasks.push(todo);
        pubsub.pub('todoAdded', this.tasks);
    }

    removeTodo(task) {
        const index = task.getAttribute('data-index');
        if (index > -1) {
            this.tasks.splice(index, 1);
        }
        pubsub.pub('todoDeleted', this.tasks);
    }s
}