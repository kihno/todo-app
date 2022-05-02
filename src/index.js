import './stylesheet.css';
import {format, isToday} from 'date-fns';
import {pubsub} from './pubsub.js';
import {Projects} from './projects';
import {Todos} from './todos.js';

(function () {

const inbox = new Projects('inbox');
let currentProject = inbox;

const today = new Projects('today');
const week = new Projects('week');

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

//Events
inboxButton.addEventListener('click', () => {
    clearProject();
    currentProject = inbox;
    render(inbox.project);
});

todayButton.addEventListener('click', () => {
    clearProject();
    currentProject = today;
    render(today.project);
});

weekButton.addEventListener('click', () => {
    clearProject();
    currentProject = week;
    render(week.project);
});

todoButton.addEventListener('click', () => {
    todoModal.style.display = 'block';
});

submit.addEventListener('click', () => {
    const newTodo = new Todos(title.value, description.value, dueDate.value, priorityValue());
    pushTodo(newTodo);
    todoModal.style.display = 'none';
    render(currentProject.project);
});

projectButton.addEventListener('click', () => {
    projectModal.style.display = 'block';
});

projectSubmit.addEventListener('click', () => {
    const li = document.createElement('li');
    li.textContent = projectName.value;
    projectList.appendChild(li);
    const newProject = new Projects(projectName.value);

    li.addEventListener('click', () => {
        currentProject = newProject;
        render(newProject.project);
    });

    currentProject = newProject;
    projectModal.style.display = 'none';
    projectName.value = '';

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

function pushTodo(newTodo) {
    if (currentProject === inbox) {
        inbox.addTodo(newTodo);
    } else {
        inbox.addTodo(newTodo);
        currentProject.addTodo(newTodo);
    }
    pushToday(newTodo);
}

function pushToday(newTodo) {
    const todaysDate = format(new Date(), 'yyyy-MM-dd');

    if (newTodo.dueDate === todaysDate) {
        today.addTodo(newTodo);
    }
}

function pushWeek(newTodo) {
    
}

function render(project) {
    clearProject();
    
    project.forEach(todo => {
        const ul = document.createElement('ul');
        ul.className = 'todo';
        ul.setAttribute('data-index', project.indexOf(todo));
        todoList.appendChild(ul);

        const button = document.createElement('button');
        button.className = 'delete';
        button.textContent = 'X';
        ul.appendChild(button);

        button.addEventListener('click', (e) => {
            inbox.removeTodo(e.target.parentNode);
        });

        for (const prop in todo) {
            const li = document.createElement('li');
            li.className = prop;
            li.textContent = todo[prop];
            ul.appendChild(li);
        }
    });
    
    clearInput();
}

})();