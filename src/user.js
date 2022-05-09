import {Projects} from './projects';

export const user = {
    inbox: new Projects('inbox'),
    todayInbox: new Projects('today'),
    weekInbox: new Projects('week'),
    allProjects: [],

    init() {

        if (JSON.parse(localStorage.getItem('allProjects'))) {

            let storedProjects = JSON.parse(localStorage.getItem('allProjects'));
            
            this.inbox = new Projects(storedProjects[0].title, storedProjects[0].tasks);
            this.todayInbox = new Projects(storedProjects[1].title, storedProjects[1].tasks);
            this.weekInbox = new Projects(storedProjects[2].title, storedProjects[2].tasks);
            this.allProjects.push(this.inbox, this.todayInbox, this.weekInbox);

            for (let i=3; i< storedProjects.length; i++) {
                let userProject = new Projects(storedProjects[i].title, storedProjects[i].tasks);
                this.allProjects.push(userProject);
            }

        } else {

            this.allProjects.push(this.inbox, this.todayInbox, this.weekInbox);
            localStorage.setItem('allProjects', JSON.stringify(this.allProjects));

        }
    }

    //     if (allProjects.length === 0) {

    //         this.allProjects.push(inbox, todayInbox, weekInbox);
    //         localStorage.setItem('allProjects', JSON.stringify(allProjects));

    //     } else {

    //         this.inbox = new Projects(allProjects[0].title, allProjects[0].tasks);
    //         this.todayInbox = new Projects(allProjects[1].title, allProjects[1].tasks);
    //         this.weekInbox = new Projects(allProjects[2].title, allProjects[2].tasks);

    //         // events.renderProjectList();
    //     }
    //     // events.renderTasks(inbox.tasks);
    // }
};