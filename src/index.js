import './stylesheet.css';
import {pubsub} from './pubsub.js';
import {Projects} from './projects';
import {Todos} from './todos.js';

(function () {

const inbox = new Projects('inbox');

//Cache DOM
const title = document.getElementById('title');
const description = document.getElementById('description');
const dueDate = document.getElementById('dueDate');
const priority = document.getElementsByName('priority');
const todoList = document.getElementById('todoList');

//Events
const submit = document.getElementById('submit');
submit.addEventListener('click', () => {
    const newTodo = new Todos(title.value, description.value, dueDate.value, priorityValue());
    inbox.addTodo(newTodo);
});

pubsub.sub('todoAdded', render);

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