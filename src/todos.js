const todos = (function() {
    const myTodos = [];

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
    const priority = document.getElementById('priority');
    const submit = document.getElementById('submit');

    //bind events
    submit.addEventListener('click', addTodo());

    //functions
    function render() {

    }

    function addTodo() {
        const newTodo = object.create(Todo);
        newTodo.title = title;
        newTodo.description = description;
        newTodo.dueDate = dueDate;
        newTodo.priority = priority;

    }

    function completeTodo() {

    }

    function removeTodo() {

    }

    return {
        myTodos,
    }
})();