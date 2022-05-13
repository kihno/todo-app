export class Tasks {
    
    constructor(title, description, dueDate, priority, project) {
        this.complete = false;
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.project = project;
    }
}