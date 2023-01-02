import {Projects} from './projects';
import { getFirestore, collection, doc, addDoc, getDocs, deleteDoc } from 'firebase/firestore/lite';
import { usersRef, taskRef } from './firebase';
import {format, isWithinInterval, addDays, parseISO} from 'date-fns';

export const user = {
    displayName: '',
    imageUrl: '',
    inbox: new Projects('inbox'),
    todayInbox: new Projects('today'),
    weekInbox: new Projects('week'),
    allProjects: [],
    loggedIn: false,
    tasks: [],
    id: '',

    login() {
        getDocs(usersRef)
            .then((snapshot) => {
                let users = [];

                snapshot.docs.forEach((doc) => {
                    users.push({...doc.data(), id: doc.id});
                });

                users.forEach((user) => {
                    if (user.username == 'testUser') {
                        this.id = user.id;
                        this.loggedIn = true;
                    }
                });

            }).catch((err) => { console.log(err) });
    },

    sortTasks() {
        let date = format(new Date(), 'yyyy-MM-dd');;
          
        let week = format(addDays(parseISO(date), 7), 'yyyy-MM-dd')

        let todayTasks = [];
        let weekTasks = [];
        let allTasks = [];
        this.tasks.forEach((task) => {
            if (task.dueDate === date) {
                allTasks.push({...task});
                todayTasks.push({...task});
                weekTasks.push({...task});
            } else if (task.dueDate < week) {
                allTasks.push({...task});
                weekTasks.push({...task});
            } else {
                allTasks.push({...task});
            }
        });

        this.inbox = new Projects('inbox', allTasks);
        this.todayInbox = new Projects('today', todayTasks);
        this.weekInbox = new Projects('week', weekTasks);
        this.allProjects.push(this.inbox, this.todayInbox, this.weekInbox);
    },

    init(callback) {
        // this.login();

        // let loggedIn = true;
        // let authUser = 'user@email.com';
        if (this.loggedIn) {
            getDocs(taskRef)
                .then((snapshot) => {
                    let allTasks = [];
                    snapshot.docs.forEach((doc) => {
                        allTasks.push({...doc.data(), id: doc.id});
                    });

                    allTasks.forEach(task => {
                        if (task.user === this.id) {
                            this.tasks.push({ ...task});
                        }
                    });
                    
                    this.sortTasks();

                    callback();

                }).catch((err) => { console.log(err) });
            // getDocs(usersRef)
            // .then((snapshot) => {
            //     let users = [];
            //     snapshot.docs.forEach((doc) => {
            //        users.push({ ...doc.data(), id: doc.id });
            //     });
        
            //     console.log(users);

            //     users.forEach(user => {
            //         if (user.email === authUser) {

            //             user.allProjects.forEach(project => {
            //                 if (project.title === "inbox"){
            //                     this.inbox = new Projects(project.title, project.tasks);
            //                 } else if (project.title === "today") {
            //                     this.todayInbox = new Projects(project.title, project.tasks);
            //                 } else if (project.title === "week") {
            //                     this.weekInbox = new Projects(project.title, project.tasks);
            //                 }
            //             });

            //             this.allProjects.push(this.inbox, this.todayInbox, this.weekInbox);
            //             console.log(this.allProjects);
            //         }
            //     });
    
            // }).catch((err) => { console.log(err) });
        }
        // else {
        //     if (JSON.parse(localStorage.getItem('allProjects')) !== null) {

        //         let storedProjects = JSON.parse(localStorage.getItem('allProjects'));
                
        //         this.inbox = new Projects(storedProjects[0].title, storedProjects[0].tasks);
        //         this.todayInbox = new Projects(storedProjects[1].title, storedProjects[1].tasks);
        //         this.weekInbox = new Projects(storedProjects[2].title, storedProjects[2].tasks);
        //         this.allProjects.push(this.inbox, this.todayInbox, this.weekInbox);
        
        //         for (let i=3; i< storedProjects.length; i++) {
        //             let userProject = new Projects(storedProjects[i].title, storedProjects[i].tasks);
        //             this.allProjects.push(userProject);
        //         }
    
        //     } else {
    
        //         this.allProjects.push(this.inbox, this.todayInbox, this.weekInbox);
        //         localStorage.setItem('allProjects', JSON.stringify(this.allProjects));
    
        //     } 
        // }
    },
};