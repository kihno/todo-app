import {pubsub} from './pubsub.js';

export class Tasks {
    
    constructor(title, description, dueDate, priority, project) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.project = project;
    }

    // set taskTitle(title) {
    //     this.title = title;
    //     pubsub.pub('taskUpdated', this.title);
    // }

    //  set taskDescription(description) {
    //     this.description = description;
    //     pubsub.pub('taskUpdated', this.description);
    // }

    // set taskDueDate(dueDate) {
    //     this.dueDate = dueDate;
    //     pubsub.pub('taskUpdated', this.dueDate);
    // }

    // set taskPriority(priority) {
    //     this.priority = priority;
    //     pubsub.pub('taskUpdated', this.priority);
    // }
}