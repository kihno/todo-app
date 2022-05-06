import './stylesheet.css';
import {format, isWithinInterval, addDays, parseISO} from 'date-fns';
import TrashIcon from './trash.svg';
import EditIcon from './edit.svg';
import HexIcon from './hex.svg';
import {pubsub} from './pubsub.js';
import {Projects} from './projects';
import {Todos} from './todos.js';

(function () {

    //Cache DOM
    const title = document.getElementById('title');
    const description = document.getElementById('description');
    const dueDate = document.getElementById('dueDate');
    const priority = document.getElementsByName('priority');
    const todoList = document.getElementById('todoList');
    const todoButton = document.getElementById('addTodo');
    const submit = document.getElementById('submit');
    const projectButton = document.getElementById('newProject');
    const projectList = document.getElementById('projects');
    const projectName = document.getElementById('projectName');
    const projectSubmit = document.getElementById('projectSubmit');
    const todoModal = document.getElementById('todoModal');
    const projectModal = document.getElementById('projectModal');
    const inboxButton = document.getElementById('inboxButton');
    const todayButton = document.getElementById('today');
    const weekButton = document.getElementById('week');
    
    //Initialize Projects
    let inbox = new Projects('inbox');
    let todayInbox = new Projects('today');
    let weekInbox = new Projects('week');
    let currentProject = inbox;
    let allProjects = JSON.parse(localStorage.getItem('allProjects')) || [];

    if (allProjects.length === 0) {
        allProjects.push(inbox, todayInbox, weekInbox);
        localStorage.setItem('allProjects', JSON.stringify(allProjects));
    } else {

        inbox = new Projects(allProjects[0].title, allProjects[0].tasks);
        todayInbox = new Projects(allProjects[1].title, allProjects[1].tasks);
        weekInbox = new Projects(allProjects[2].title, allProjects[2].tasks);

        for ( let i = 3; i < allProjects.length; i++) {
            const newProject = new Projects(allProjects[i].title, allProjects[i].tasks);
            createProjectElement(newProject);
        }
        
    }

    // Events
    inboxButton.addEventListener('click', () => {
        clearProject();
        currentProject = inbox;
        render(inbox.tasks);
    });

    todayButton.addEventListener('click', () => {
        clearProject();
        currentProject = inbox;
        render(todayInbox.tasks);
    });

    weekButton.addEventListener('click', () => {
        clearProject();
        currentProject = inbox;
        render(weekInbox.tasks);
    });

    todoButton.addEventListener('click', () => {
        todoModal.style.display = 'block';
    });

    submit.addEventListener('click', () => {
        const newTodo = new Todos(title.value, description.value, dueDate.value, priorityValue());
        pushTodo(newTodo);
        todoModal.style.display = 'none';
        render(currentProject.tasks);
        localStorage.setItem(`allProjects`, JSON.stringify(allProjects));
    });

    projectButton.addEventListener('click', () => {
        projectModal.style.display = 'block';
    });

    projectSubmit.addEventListener('click', () => {
        const ul = document.createElement('ul');
        const li = document.createElement('li');
        ul.className = 'userProject';
        li.textContent = projectName.value;
        ul.appendChild(li);

        const trashIcon = new Image();
        trashIcon.src = TrashIcon;
        trashIcon.className = 'delete';
        ul.appendChild(trashIcon);

        projectList.appendChild(ul);
        const newProject = new Projects(projectName.value);

        ul.addEventListener('click', () => {
            currentProject = newProject;
            render(newProject.tasks);
        });

        currentProject = newProject;
        projectModal.style.display = 'none';
        projectName.value = '';

        allProjects.push(newProject);
        localStorage.setItem(`allProjects`, JSON.stringify(allProjects));

        clearProject();
    });

    pubsub.sub('todoAdded', render);
    pubsub.sub('todoDeleted', render);

    //Functions
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
        while (todoList.firstChild) {
            todoList.removeChild(todoList.firstChild);
        }
    } 

    function createProjectElement(project) {
        const ul = document.createElement('ul');
        const li = document.createElement('li');
        ul.className = 'userProject';
        li.textContent = project.title || projectName.value;
        ul.appendChild(li);

        const trashIcon = new Image();
        trashIcon.src = TrashIcon;
        trashIcon.className = 'delete';
        ul.appendChild(trashIcon);

        projectList.appendChild(ul);;

        li.addEventListener('click', () => {
            currentProject = project;
            render(project.tasks);
        });
    }

    function pushTodo(newTodo) {
        if (currentProject === inbox) {
            inbox.addTodo(newTodo);
        } else  {
            inbox.addTodo(newTodo);
            currentProject.addTodo(newTodo);
        }
        pushToday(newTodo);
        pushWeek(newTodo);
    }

    function pushToday(newTodo) {
        const todaysDate = format(new Date(), 'yyyy-MM-dd');

        if (newTodo.dueDate === todaysDate) {
            todayInbox.addTodo(newTodo);
            weekInbox.addTodo(newTodo);
        }
    }

    function pushWeek(newTodo) {
        if (isWithinInterval(parseISO(newTodo.dueDate), {start: new Date, end: addDays(new Date(), 6)})) {
            weekInbox.addTodo(newTodo);
            console.log(weekInbox);
        }
    }

    function render(project) {
        clearProject();
        
        project.forEach(task => {
            const ul = document.createElement('ul');
            ul.className = 'todo';
            ul.setAttribute('data-index', project.indexOf(task));
            todoList.appendChild(ul);

            const hexIcon = new Image();
            hexIcon.src = HexIcon;
            hexIcon.className = 'checkbox';
            ul.appendChild(hexIcon);
        
            hexIcon.addEventListener('click', () => {
                hexIcon.classList.toggle('checked');
            });

            for (const prop in task) {
                const li = document.createElement('li');
                li.className = prop;
                li.textContent = task[prop];
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

            trashIcon.addEventListener('click', () => {
                let taskTitle = document.querySelector('.title');

                allProjects.forEach(project => {
                    project.tasks.forEach(task => {
                        if (taskTitle.textContent === task.title) {
                            let index = project.tasks.indexOf(task);
                            project.tasks.splice(index,1);
                        }
                    });
                    
                });

                localStorage.setItem('allProjects', JSON.stringify(allProjects));
                render(currentProject.tasks);
            });
            
        });
        
        clearInput();
    }
    render(inbox.tasks);
})();