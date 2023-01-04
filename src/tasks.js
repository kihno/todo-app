export class Tasks {
    
    constructor(title, description, dueDate, priority, project, user) {
        this.complete = false;
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.project = project;
        this.user = user;
    }
}