import './stylesheet.css';
import {myTodos, render, addTodo} from './todos.js';

render();
const submit = document.getElementById('submit');
console.log(myTodos);
submit.addEventListener('click', () => {
    addTodo()
    render();
});