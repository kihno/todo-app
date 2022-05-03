import './stylesheet.css';
import {format, isWithinInterval, addDays, parseISO} from 'date-fns';
import AddIcon from './add.svg';
import TrashIcon from './trash.svg';
import EditIcon from './edit.svg';
import HexIcon from './hex.svg';
import {pubsub} from './pubsub.js';
import {Projects} from './projects';
import {Todos} from './todos.js';

(function () {

const inbox = new Projects('inbox');
let currentProject = inbox;

const todayInbox = new Projects('today');
const weekInbox = new Projects('week');

//Test
const testTodo = new Todos('Task1', 'Do stuff', '2022-05-02', 'high');
inbox.addTodo(testTodo);
console.log(testTodo);
console.log(inbox);


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

//Images
const addIcon = new Image();
addIcon.src = AddIcon;

const trashIcon = new Image();
trashIcon.src = TrashIcon;

const editIcon = new Image();
editIcon.src = EditIcon;

const hexIcon = new Image();
hexIcon.src = HexIcon;

//Events
inboxButton.addEventListener('click', () => {
    clearProject();
    currentProject = inbox;
    render(inbox.project);
});

todayButton.addEventListener('click', () => {
    clearProject();
    currentProject = inbox;
    render(todayInbox.project);
});

weekButton.addEventListener('click', () => {
    clearProject();
    currentProject = inbox;
    render(weekInbox.project);
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
    
    project.forEach(todo => {
        const ul = document.createElement('ul');
        ul.className = 'todo';
        ul.setAttribute('data-index', project.indexOf(todo));
        todoList.appendChild(ul);

        hexIcon.className = 'checkbox';
        ul.appendChild(hexIcon);
    
        hexIcon.addEventListener('click', () => {
            hexIcon.classList.toggle('checked');
        });

        for (const prop in todo) {
            const li = document.createElement('li');
            li.className = prop;
            li.textContent = todo[prop];
            ul.appendChild(li);
        }
        editIcon.className = 'edit';
        ul.appendChild(editIcon);

        editIcon.addEventListener('click', () => {
            
        });

        trashIcon.className = 'delete';
        ul.appendChild(trashIcon);

        trashIcon.addEventListener('click', (e) => {
            inbox.removeTodo(e.target.parentNode);
        });
        
    });
    
    clearInput();
}

render(inbox.project);
})();