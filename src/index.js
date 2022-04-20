import './stylesheet.css';
import {Todos} from './todos.js';

let MyTodos = new Todos();
MyTodos.render();

const submit = document.getElementById('submit');
submit.addEventListener('click', () => {
    addTodo()
    render();
});