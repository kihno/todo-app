import {format, isWithinInterval, addDays, parseISO} from 'date-fns';
import TrashIcon from './images/trash.svg';
import EditIcon from './images/edit.svg';
import HexIcon from './images/hex.svg';
import {user} from './user.js';
import {pubsub} from './pubsub.js';
import {Projects} from './projects.js';
import {Tasks} from './tasks.js';

export const events = (() => {

    //Cache DOM
    const title = document.getElementById('title');
    const description = document.getElementById('description');
    const dueDate = document.getElementById('dueDate');
    const priority = document.getElementsByName('priority');
    const taskList = document.getElementById('taskList');
    const taskButton = document.getElementById('addTask');
    const submit = document.getElementById('submit');
    const projectButton = document.getElementById('newProject');
    const projectList = document.getElementById('projects');
    const projectName = document.getElementById('projectName');
    const projectSubmit = document.getElementById('projectSubmit');
    const taskModal = document.getElementById('taskModal');
    const projectModal = document.getElementById('projectModal');
    const inboxButton = document.getElementById('inboxButton');
    const todayButton = document.getElementById('today');
    const weekButton = document.getElementById('week');
    
    //Initialize Projects
    // let inbox = new Projects('inbox');
    // let todayInbox = new Projects('today');
    // let weekInbox = new Projects('week');
    // let allProjects = JSON.parse(localStorage.getItem('allProjects')) || [];

    // if (allProjects.length === 0) {

    //     allProjects.push(inbox, todayInbox, weekInbox);
    //     localStorage.setItem('allProjects', JSON.stringify(allProjects));

    // } else {

    //     inbox = new Projects(allProjects[0].title, allProjects[0].tasks);
    //     todayInbox = new Projects(allProjects[1].title, allProjects[1].tasks);
    //     weekInbox = new Projects(allProjects[2].title, allProjects[2].tasks);

    //     renderProjectList();
    // }
 
    // let inbox = user.inbox;
    // let todayInbox = user.todayInbox;
    // let weekInbox = user.weekInbox;
    // let allProjects = user.allProjects;
    let currentProject = user.inbox;

    // Events
    inboxButton.addEventListener('click', () => {
        clearProject();
        currentProject = user.inbox;
        taskButton.style.display = 'flex';
        renderTasks(user.inbox.tasks);
    });

    todayButton.addEventListener('click', () => {
        clearProject();
        currentProject = user.inbox;
        taskButton.style.display = 'none';
        renderTasks(user.todayInbox.tasks);
    });

    weekButton.addEventListener('click', () => {
        clearProject();
        currentProject = user.inbox;
        taskButton.style.display = 'none';
        renderTasks(user.weekInbox.tasks);
    });

    taskButton.addEventListener('click', () => {
        taskModal.style.display = 'block';
    });

    submit.addEventListener('click', () => {
        const newTask = new Tasks(title.value, description.value, dueDate.value, priorityValue(), currentProject.title);
        pushTask(newTask);
        taskModal.style.display = 'none';
    });

    projectButton.addEventListener('click', () => {
        projectModal.style.display = 'block';
    });

    projectSubmit.addEventListener('click', () => {
        const newProject = new Projects(projectName.value);
        createProjectElement(newProject);

        currentProject = newProject;
        projectModal.style.display = 'none';
        projectName.value = '';

        user.allProjects.push(newProject);
        pubsub.pub('projectAdded', newProject);

        clearProject();
    });

    pubsub.sub('taskAdded', setStorage);
    pubsub.sub('taskDeleted', setStorage);
    pubsub.sub('projectAdded', setStorage);
    pubsub.sub('projectDeleted', setStorage);

    //Functions
    function setStorage() {
        localStorage.setItem(`allProjects`, JSON.stringify(user.allProjects));
        renderTasks(currentProject.tasks);
    }

    function priorityValue() {
        let value;

        for(let i = 0; i < priority.length; i++) {
            if (priority[i].checked)
            value = priority[i].value;
        }
        return value;
    }

    function clearInput() {
        for (let i = 0; i < priority.length; i++) {
            priority[i].checked = false;
        }

        title.value = '';
        description.value = '';
        dueDate.value = '';
    }

    function clearProject() {
        while (taskList.firstChild) {
            taskList.removeChild(taskList.firstChild);
        }
    } 

    function createProjectElement(project) {
        const ul = document.createElement('ul');
        const li = document.createElement('li');
        ul.className = 'userProject';
        li.className = 'projectTitle';
        li.textContent = project.title || projectName.value;
        ul.appendChild(li);

        const trashIcon = new Image();
        trashIcon.src = TrashIcon;
        trashIcon.className = 'delete';
        ul.appendChild(trashIcon);

        trashIcon.addEventListener('click', deleteProject); 

        projectList.appendChild(ul);;

        ul.addEventListener('mouseover', () => {
            ul.lastChild.style.display = 'inline';
        });

        ul.addEventListener('mouseout', () => {
            ul.lastChild.style.display = 'none';
        });

        li.addEventListener('click', () => {
            currentProject = project;
            console.log(currentProject);
            taskButton.style.display = 'flex';
            renderTasks(project.tasks);
        });
    }

    function pushTask(newTask) {
        if (currentProject === user.inbox) {
            user.inbox.addTask(newTask);
        } else  {
            user.inbox.addTask(newTask);
            currentProject.addTask(newTask);
        }
        pushToday(newTask);
        pushWeek(newTask);
    }

    function pushToday(newTask) {
        const todaysDate = format(new Date(), 'yyyy-MM-dd');

        if (newTask.dueDate === todaysDate) {
            user.todayInbox.addTask(newTask);
            user.weekInbox.addTask(newTask);
        }
    }

    function pushWeek(newTask) {
        if (isWithinInterval(parseISO(newTask.dueDate), {start: new Date, end: addDays(new Date(), 6)})) {
            user.weekInbox.addTask(newTask);
        }
    }

    function deleteProject(e) {
        let projectUl = e.target.parentNode;
        let projectTitle = projectUl.querySelector('.projectTitle');

        user.allProjects.forEach(project => {
            if (projectTitle.textContent === project.title) {
                let deadProject = project.title;

                user.allProjects.forEach(project => {
                    project.tasks.forEach(task => {
                        if (task.project === deadProject) {
                            project.removeTask(task)
                        }
                    });
                });

                let index = user.allProjects.indexOf(project);
                user.allProjects.splice(index,1);
                pubsub.pub('projectDeleted', project);
            }
        });

        projectUl.remove();
    }

    function deleteTask(e) {
        let taskUl = e.target.parentNode;
        let taskTitle = taskUl.querySelector('.title').textContent;
        let taskDescription = taskUl.querySelector('.description').textContent;
        let taskDueDate = taskUl.querySelector('.dueDate').textContent;

        user.allProjects.forEach(project => {
            project.tasks.forEach(task => {
                if (taskTitle === task.title && taskDescription === task.description && taskDueDate === task.dueDate) {
                    project.removeTask(task);
                    // project.removeTask(task);
                    // let index = project.tasks.indexOf(task);
                    // project.tasks.splice(index,1);
                    // pubsub.pub('taskDeleted', project);
                }
                
            });
            
        });
    }


    function renderProjectList() {
        for ( let i = 3; i < user.allProjects.length; i++) {
            const newProject = new Projects(user.allProjects[i].title, user.allProjects[i].tasks);
            createProjectElement(newProject);
        }
    }

    function renderTasks(project) {
        clearProject();
        
        project.forEach(task => {
            const ul = document.createElement('ul');
            ul.className = 'task';
            ul.setAttribute('data-index', project.indexOf(task));
            taskList.appendChild(ul);

            const hexIcon = new Image();
            hexIcon.src = HexIcon;
            hexIcon.className = 'checkbox';
            ul.appendChild(hexIcon);
        
            hexIcon.addEventListener('click', () => {
                hexIcon.classList.toggle('checked');
            });

            for (let prop in task) {
                const li = document.createElement('li');
                li.className = prop;

                if (prop === dueDate && dueDate !== null) {
                    li.textContent = format(parseISO(task[prop]), 'MM-dd-yyyy');
                } else if (prop === project) {
                    return
                } else {
                    li.textContent = task[prop];
                }
                
                ul.appendChild(li);
            }

            const editIcon = new Image();
            editIcon.src = EditIcon;
            editIcon.className = 'edit';
            ul.appendChild(editIcon);

            editIcon.addEventListener('click', () => {
           
            });

            const trashIcon = new Image();
            trashIcon.src = TrashIcon;
            trashIcon.className = 'delete';
            ul.appendChild(trashIcon);

            trashIcon.addEventListener('click', deleteTask);

        });
        
        clearInput();
    }
    
    return {
        renderProjectList, renderTasks
    }
})();