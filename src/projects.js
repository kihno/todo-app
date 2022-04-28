import {pubsub} from './pubsub.js';

export class Projects {
    // project = [];

    constructor(title) {
        this.title = title;
        this.project = [];
    }

    addTodo(todo) {
        this.project.push(todo);
        pubsub.pub('todoAdded', this.project);
    }

    removeTodo(todo) {
        const index = this.project.indexOf[todo];
        if (index > -1) {
            this.project.splice(index, 1);
        }
    }
}