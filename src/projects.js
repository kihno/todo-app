import {pubsub} from './pubsub.js';

export class Projects {

    constructor(title) {
        this.title = title;
        this.project = [];
    }

    addTodo(todo) {
        this.project.push(todo);
        pubsub.pub('todoAdded', this.project);
    }

    removeTodo(todo) {
        const index = todo.getAttribute('data-index');
        if (index > -1) {
            this.project.splice(index, 1);
        }
        pubsub.pub('todoDeleted', this.project);
    }
}