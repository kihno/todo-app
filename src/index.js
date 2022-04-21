import './stylesheet.css';
import {pubsub} from './pubsub.js';
import {Projects} from './projects';
import {Todos} from './todos.js';



// const submit = document.getElementById('submit');
// submit.addEventListener('click', () => {
//     addTodo()
//     render();
// });

// (function () {
    // let inbox = new Projects('inbox');

   const title = document.getElementById('title');
   const description = document.getElementById('description');
   const dueDate = document.getElementById('dueDate');
   const submit = document.getElementById('submit');
   const todoList = document.getElementById('todoList');

    pubsub.sub('todoAdded', render);

    function render() {
        myTodos.forEach(todo => {
            const ul = document.createElement('ul');
            ul.className = 'todo';
            ul.setAttribute('data-index', myTodos.indexOf(todo));
            todoList.appendChild(ul);
    
            for (const prop in todo) {
                const li = document.createElement('li');
                li.className = prop;
                li.textContent = todo[prop];
                ul.appendChild(li);
            }
        });
    }

// })();