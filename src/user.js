import {Projects} from './projects';
import { getFirestore, collection, doc, addDoc, getDocs, deleteDoc } from 'firebase/firestore/lite';
import { usersRef } from './firebase';

export const user = {
    inbox: new Projects('inbox'),
    todayInbox: new Projects('today'),
    weekInbox: new Projects('week'),
    allProjects: [],
    id: '',


    init() {
        let loggedIn = true;
        let authUser = 'user@email.com';

        if (loggedIn === true) {
            getDocs(usersRef)
            .then((snapshot) => {
                let users = [];
                snapshot.docs.forEach((doc) => {
                   users.push({ ...doc.data(), id: doc.id });
                });
        
                console.log(users);

                users.forEach(user => {
                    if (user.email === authUser) {

                        user.allProjects.forEach(project => {
                            if (project.title === "inbox"){
                                this.inbox = new Projects(project.title, project.tasks);
                            } else if (project.title === "today") {
                                this.todayInbox = new Projects(project.title, project.tasks);
                            } else if (project.title === "week") {
                                this.weekInbox = new Projects(project.title, project.tasks);
                            }
                        });

                        this.allProjects.push(this.inbox, this.todayInbox, this.weekInbox);
                        console.log(this.allProjects);
                    }
                });
    
            }).catch((err) => { console.log(err) });
        } else {
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
        }
    },
};