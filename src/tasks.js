import pubsub from './pubsub.js';

export class Tasks {
    
    constructor(title, description, dueDate, priority, project) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.project = project;
    }

    // get title() {
    //     return this.title;
    // }

    // set title(newTitle) {
    //     this._title = newTitle;
    // }
   
    // get description() {
    //     return this.description;
    // }

    // set description(newdescription) {
    //     this._description = newdescription;
    // }

    // get dueDate() {
    //     if (dueDate !== null){
    //         return this.dueDate;
    //     }
    // }

    // set dueDate(newdueDate) {
    //     this._dueDate = newdueDate;
    // }

    // get priority() {
    //     return this.priority;
    // }

    // set priority(newpriority) {
    //     this._priority = newpriority;
    // }
}