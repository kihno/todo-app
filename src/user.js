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
            if (task.dueDate < date && task.complete != false) {
                task.priority = 'high';
                allTasks.push({...task});
                todayTasks.push({...task});
                weekTasks.push({...task});
            } else if (task.dueDate === date) {
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
        }
            
    },
};