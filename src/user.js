import {Projects} from './projects';

export const user = {
    inbox: new Projects('inbox'),
    todayInbox: new Projects('today'),
    weekInbox: new Projects('week'),
    allProjects: [],

    init() {

        if (JSON.parse(localStorage.getItem('allProjects')) !== null) {

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
    },

    // setStorage () {
    //     localStorage.setItem('allProjects', JSON.stringify(this.allProjects));
    // },

    // getStorage() {
    //     let storedProjects = JSON.parse(localStorage.getItem('allProjects'));
            
    //     this.inbox = new Projects(storedProjects[0].title, storedProjects[0].tasks);
    //     this.todayInbox = new Projects(storedProjects[1].title, storedProjects[1].tasks);
    //     this.weekInbox = new Projects(storedProjects[2].title, storedProjects[2].tasks);
    //     this.allProjects.push(this.inbox, this.todayInbox, this.weekInbox);

    //     for (let i=3; i< storedProjects.length; i++) {
    //         let userProject = new Projects(storedProjects[i].title, storedProjects[i].tasks);
    //         this.allProjects.push(userProject);
    //     }
    // },
};