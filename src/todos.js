
const myTodos = [
    // {
    //     title: 'Do Things',
    //     description: 'Things need to get done.',
    //     dueDate: '04/20/22',
    //     priority: 'low',
    // }
];

function Todo(title, description, dueDate, priority) {
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
}

//cache DOM
const title = document.getElementById('title');
const description = document.getElementById('description');
const dueDate = document.getElementById('dueDate');

const submit = document.getElementById('submit');
const todoList = document.getElementById('todoList');

//bind events


//functions
function priorityValue() {
    const priority = document.getElementsByName('priority');
    let value;

    for(let i = 0; i < priority.length; i++) {
        if (priority[i].checked)
        value = priority[i].value;
    }
    return value;
}

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

function addTodo() {
    const newTodo = Object.create(Todo);
    newTodo.title = title.value;
    newTodo.description = description.value;
    newTodo.dueDate = dueDate.value;
    newTodo.priority = priorityValue();

    myTodos.push(newTodo);
    console.log(myTodos);
}

function completeTodo() {

}

function removeTodo() {

}


export {myTodos, render, addTodo};