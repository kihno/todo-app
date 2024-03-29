import {format, isWithinInterval, addDays, parseISO} from 'date-fns';
import TrashIcon from './images/trash.svg';
import TrashGreyIcon from './images/trash-grey.svg';
import HexIcon from './images/hex.svg';
import LowPriority from './images/low-priority.png';
import MediumPriority from './images/medium-priority.png';
import HighPriority from './images/high-priority.png';
import Logo from './images/taskmaster.png';
import PlusIcon from './images/add.svg';
import {user} from './user.js';
import {pubsub} from './pubsub.js';
import {Projects} from './projects.js';
import {Tasks} from './tasks.js';
import {storeTask, deleteStoredTask, signInUser, signOutUser, updateTask, storeProject, deleteStoredProject} from './firebase.js';

export const events = (() => {

    //Cache DOM
    const title = document.getElementById('title');
    const description = document.getElementById('description');
    const dueDate = document.getElementById('dueDate');
    const priority = document.getElementsByName('priority');
    const taskList = document.getElementById('taskList');
    const taskButton = document.getElementById('addTask');
    const submit = document.getElementById('submit');
    const titleError =  document.getElementById('titleError');
    const projectButton = document.getElementById('newProject');
    const projectList = document.getElementById('projects');
    const projectName = document.getElementById('projectName');
    const projectSubmit = document.getElementById('projectSubmit');
    const projectError = document.getElementById('projectError');
    const taskModal = document.getElementById('taskModal');
    const projectModal = document.getElementById('projectModal');
    const inboxButton = document.getElementById('inboxButton');
    const todayButton = document.getElementById('today');
    const weekButton = document.getElementById('week');
    const projectElements = document.getElementsByClassName('project');
    const projectElementArray = document.querySelectorAll('.project');
    const signInButton = document.getElementById('sign-in');
    const signOutButton = document.getElementById('sign-out');
    const userInfo = document.getElementById('user-info');
    // const userPic = document.getElementById('user-pic');
    const userName = document.getElementById('user-name');

    let currentProject
    user.init(() => {
        currentProject = user.inbox;
        renderMain();
    });

    // Events
    signInButton.addEventListener('click', () => {
        signInUser();
    });

    signOutButton.addEventListener('click', () => {
        signOutUser();
    });

    inboxButton.addEventListener('click', () => {
        removeProjectClass();
        inboxButton.classList.add('current');
        clearProject();
        currentProject = user.inbox;
        taskButton.style.display = 'flex';
        renderTasks(user.inbox.tasks);
        clearModals();
    });

    todayButton.addEventListener('click', () => {
        removeProjectClass();
        todayButton.classList.add('current');
        clearProject();
        currentProject = user.todayInbox;
        taskButton.style.display = 'none';
        renderTasks(user.todayInbox.tasks);
        clearModals();
        noTasksDue();
    });

    weekButton.addEventListener('click', () => {
        removeProjectClass();
        weekButton.classList.add('current');
        clearProject();
        currentProject = user.weekInbox;
        taskButton.style.display = 'none';
        renderTasks(user.weekInbox.tasks);
        clearModals();
        noTasksDue();
    });

    taskButton.addEventListener('click', toggleTaskModal);

    submit.addEventListener('click', validateTask);

    projectButton.addEventListener('click', toggleProjectModal);

    projectSubmit.addEventListener('click', validateProject);

    pubsub.sub('userLoggedIn', authenticateUser);
    pubsub.sub('userLoggedOut', logOutUser);

    pubsub.sub('taskAdded', renderMain);
    pubsub.sub('taskDeleted', renderMain);
    pubsub.sub('projectAdded', renderSidebar);
    pubsub.sub('projectDeleted', renderSidebar);

    //Functions
    function authenticateUser(authUser) {
        user.loggedIn = true;
        user.id = authUser.uid;
        
        userName.textContent = authUser.displayName;
        // userPic.src = authUser.photoURL;

        user.init(() => {
            currentProject = user.inbox;
            userInfo.classList.remove('hide');
            signInButton.classList.add('hide');
            renderMain();
            renderSidebar();
        });
    }

    function logOutUser() {
;       user.inbox = new Projects('inbox');
        user.todayInbox = new Projects('today');
        user.weekInbox = new Projects('week');
        user.allProjects = [];
        user.tasks = [];

        user.loggedIn = false;
        user.id = '';
        
        userName.textContent = '';
        // userPic.src = '';

        userInfo.classList.add('hide');
        signInButton.classList.remove('hide');

        currentProject = user.inbox;
        renderMain();
        clearProjectList();
    }

    function setStorage() {
        localStorage.setItem(`allProjects`, JSON.stringify(user.allProjects));
    }

    function renderSidebar() {
        if (user.loggedIn === false) {
            setStorage();
            renderProjectList();
            renderTasks(currentProject.tasks);
        }

        renderProjectList();
        renderTasks(currentProject.tasks);
    }

    function renderMain() {
        if (user.loggedIn === false) {
            setStorage();
            renderTasks(currentProject.tasks);
        }
        renderTasks(currentProject.tasks);
    }

    function priorityValue(priority) {
        let value = '';

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

    function toggleTaskModal() {
        clearProjectModal();

        if (taskModal.style.display === 'none') {
            taskModal.style.display = 'flex';
        } else {
            clearTaskModal();
        }
    }

    function clearTaskModal() {
        if (taskModal.style.display === 'flex') {
            clearInput();
            clearTitleError();
            taskModal.style.display = 'none';
        }
    }

    function clearProjectModal() {
        if (projectModal.style.display === 'block') {
            projectName.value = '';
            clearProjectError();
            projectModal.style.display = 'none';
        }
    }

    function clearModals() {
        clearTaskModal();
        clearProjectModal();
    }

    function toggleProjectModal() {
        clearTaskModal();

        if (projectModal.style.display === 'none') {
            projectModal.style.display = 'block';
        } else {
            clearProjectModal();
        }
    }

    function noTasksDue() {
        let h2 = document.createElement('h2');

        if (!taskList.firstChild) {
            if (currentProject === user.todayInbox) {
                h2.textContent = 'No Tasks Due Today';
                taskList.appendChild(h2);
            } else if (currentProject === user.weekInbox) {
                h2.textContent = 'No Tasks Due This Week';
                taskList.appendChild(h2);
            }
        }
    }

    function validateProject() {
        if (projectName.value === '') {
            projectError.textContent = 'Please enter project name';
        } else {
            let authUser = null;
            if (user.loggedIn) {
                authUser = user.id;
            }

            let newProject = new Projects(projectName.value, authUser);
            currentProject = newProject;
            taskButton.style.display = 'flex';
    
            clearProject();
            removeProjectClass();
            toggleProjectModal();
            clearProjectError();
    
            storeProject(JSON.parse(JSON.stringify(newProject)));
            user.allProjects.push(newProject);
            pubsub.pub('projectAdded', newProject);
        }
    }

    function clearProjectError() {
        projectError.textContent = '';
    }

    function validateTask() {
        if (title.value === '') {
            titleError.textContent = 'Please enter task name'
        } else {
            let authUser = null;
            if (user.loggedIn) {
                authUser = user.id;
            }

            const newTask = new Tasks(title.value, description.value, dueDate.value, priorityValue(priority), currentProject.title, authUser);
            pushTask(newTask);
            storeTask(JSON.parse(JSON.stringify(newTask)));
            toggleTaskModal();
            clearTitleError();
        }
    }

    function clearTitleError() {
        titleError.textContent = '';
    }

    function clearProject() {
        while (taskList.firstChild) {
            taskList.removeChild(taskList.firstChild);
        }
    } 

    function removeProjectClass() {
        for (let i = 0; i < projectElements.length; i++) {
            projectElements[i].classList.remove('current');
        }
    }

    function createProjectElement(project) {
        const ul = document.createElement('ul');
        ul.className = 'project';
        ul.setAttribute('data-id', project.id);
        if (project.title === currentProject.title) {
            ul.classList.add('current');
        }

        const li = document.createElement('li');
        li.className = 'projectTitle';
        li.textContent = project.title || projectName.value;
        ul.appendChild(li);

        const trashIcon = new Image();
        trashIcon.src = TrashIcon;
        trashIcon.className = 'delete';
        ul.appendChild(trashIcon);

        trashIcon.addEventListener('click', deleteProject); 

        projectList.appendChild(ul);

        ul.addEventListener('mouseover', () => {
            ul.lastChild.style.display = 'inline';
        });

        ul.addEventListener('mouseout', () => {
            ul.lastChild.style.display = 'none';
        });

        li.addEventListener('click', () => {
            removeProjectClass();
            ul.classList.add('current');
            currentProject = project;
            taskButton.style.display = 'flex';
            renderTasks(project.tasks);
        });
    }

    function pushTask(newTask) {
        if (currentProject.title === 'inbox') {
            user.inbox.addTask(newTask);
        } else {
            user.inbox.tasks.push(newTask);
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
        let projectId = projectUl.getAttribute('data-id');
        let deadProject = projectTitle.textContent;

        user.allProjects.forEach(project => {
            if (deadProject === project.title) {
                let index = user.allProjects.indexOf(project);
                user.allProjects.splice(index,1);

                //Running allProjects search/removeTask twice because removing task shifts index and tasks were being missed.
                user.allProjects.forEach(project => {
                    project.tasks.forEach(task => {
                        if (task.project === deadProject) {
                            project.removeTask(task);
                            deleteStoredTask(task.id);
                            user.allProjects.forEach(project => {
                                project.tasks.forEach(task => {
                                    if (task.project === deadProject) {
                                        project.removeTask(task);
                                        deleteStoredTask(task.id);
                                    }
                                });
                            });
                        }
                    });
                });

                pubsub.pub('projectDeleted', project);
            }
        });

        projectUl.remove();

        if (currentProject.title === deadProject) {
            currentProject = user.inbox;
            inboxButton.classList.add('current');
            renderTasks(currentProject.tasks);
        } else {
            renderTasks(currentProject.tasks);
        }

        deleteStoredProject(projectId);
    }

    function deleteTask(e) {
        let taskUl = e.target.parentNode;
        let taskDueDate = taskUl.querySelector('.task-dueDate').textContent;
        let taskId = taskUl.getAttribute('data-id');

        let reformatDate;
        if (taskDueDate !== '') {
            reformatDate = format(new Date(taskDueDate), 'yyyy-MM-dd');
        }

        user.allProjects.forEach(project => {
            project.tasks.forEach(task => {
                if (taskId === task.id) {
                    project.removeTask(task);
                }
            });
        });

        deleteStoredTask(taskId);
    }

    function checkTask(e) {
        let checkbox = e.target;
        let task = e.target.parentNode.parentNode;
        let id = task.getAttribute('data-id');

        checkbox.classList.toggle('checked');
        task.classList.toggle('complete');

        user.allProjects.forEach(project => {
            project.tasks.forEach(task => {
                if (task.id === id) {
                    if (task.complete === false) {
                        task.complete = true;
                        updateTask(id, task);
                        renderMain(currentProject.tasks);
                        
                    } else {
                        task.complete = false;
                        updateTask(id, task);
                        renderMain(currentProject.tasks);
                    }
                }
            });
        });
    }

    function renderProjectList() {
        for ( let i = projectElements.length; i < user.allProjects.length; i++) {
            let authUser = null;
            if (user.loggedIn) {
                authUser = user.id;
            }

            const newProject = new Projects(user.allProjects[i].title, authUser, user.allProjects[i].id, user.allProjects[i].tasks);
            createProjectElement(newProject);
        }
    }

    function clearProjectList() {
        while (projectList.children[3]) {
            projectList.removeChild(projectList.children[3]);
        }
    }

    function renderTasks(project) {
        clearProject();

        project.sort((a,b) => (a.dueDate > b.dueDate) ? 1 : ((b.dueDate > a.dueDate) ? -1 : 0))

        project.forEach(task => {
            const ul = document.createElement('ul');
            ul.className = 'task';
            ul.setAttribute('data-index', project.indexOf(task));
            ul.setAttribute('data-id', task.id);
            taskList.appendChild(ul);

            const hexIcon = new Image();
            hexIcon.src = HexIcon;
            hexIcon.className = 'checkbox';
        
            hexIcon.addEventListener('click', (e) => {
                checkTask(e);
            });

            for (let prop in task) {
                const li = document.createElement('li');
                li.className = 'task-' + prop;

                if (prop === 'complete') {
                    li.appendChild(hexIcon);
                    if (task['complete'] === true) {
                        hexIcon.classList.toggle('checked');
                        ul.classList.toggle('complete');
                    }
                } else if (prop === 'dueDate' && task[prop] !== "") {
                    let date = format(new Date(), 'yyyy-MM-dd');
                    if (task[prop] < date && task.complete === false) {
                        li.classList.add('overdue');
                    }

                    li.textContent = format(parseISO(task[prop]), 'MM-dd-yyyy');
                } else if (prop === 'priority') {
                    li.className += ' ' + task[prop];

                    if (task['priority'] === 'low' ) {
                        const lowPriority = new Image();
                        lowPriority.src = LowPriority;
                        li.appendChild(lowPriority);
                    } else if (task['priority'] === 'medium' ) {
                        const mediumPriority = new Image();
                        mediumPriority.src = MediumPriority;
                        li.appendChild(mediumPriority);
                    } else if (task['priority'] === 'high' ) {
                        const highPriority = new Image();
                        highPriority.src = HighPriority;
                        li.appendChild(highPriority);
                    }
                } else if (prop === 'project' && task[prop] === 'inbox') {
                    li.textContent = '';
                } else if (prop === 'id' || prop === 'user') {
                    continue;
                } else {
                    li.textContent = task[prop];
                }
                
                ul.appendChild(li);
            }

            const trashGreyIcon = new Image();
            trashGreyIcon.src = TrashGreyIcon;
            trashGreyIcon.className = 'task-delete';
            ul.appendChild(trashGreyIcon);

            trashGreyIcon.addEventListener('click', deleteTask);

        });
        
        clearInput();
    }
    
    return {
        renderProjectList, renderTasks
    }
})();