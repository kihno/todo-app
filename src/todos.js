import pubsub from './pubsub.js';

export class Todos {
    myTodos = [
        {
            title: 'Do Things',
            description: 'Things need to get done.',
            dueDate: '04/20/22',
            priority: 'low',
        }
    ];
    
    constructor(title, description, dueDate, priority) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
    }
    
    //cache DOM
    // title = document.getElementById('title');
    // description = document.getElementById('description');
    // dueDate = document.getElementById('dueDate');
    // submit = document.getElementById('submit');
    // todoList = document.getElementById('todoList');
    
    //bind events
    
    
    //functions
    // get priorityValue() {
    //     const priority = document.getElementsByName('priority');
    //     let value;
    
    //     for(let i = 0; i < priority.length; i++) {
    //         if (priority[i].checked)
    //         value = priority[i].value;
    //     }
    //     return value;
    // }
    
    // render() {
        
    //     myTodos.forEach(todo => {
    //         const ul = document.createElement('ul');
    //         ul.className = 'todo';
    //         ul.setAttribute('data-index', myTodos.indexOf(todo));
    //         todoList.appendChild(ul);
    
    //         for (const prop in todo) {
    //             const li = document.createElement('li');
    //             li.className = prop;
    //             li.textContent = todo[prop];
    //             ul.appendChild(li);
    //         }
    //     });
    // }
    
    addTodo() {
        const newTodo = new Todos(title.value, description.value, dueDate.value, priorityValue);
    
        myTodos.push(newTodo);
        pubsub.pub('todoAdded', newTodo);
    }
    
    completeTodo() {
    
    }
    
    removeTodo() {
    
    }
    
}