let todosList = [];
let filters = {
    searchText: ''
};

let editButtonFlag = true;

function myCreateElement(element, parent, className) {
    const childElement = document.createElement(element);
    if (className !== undefined)
        childElement.className = className;

    parent.appendChild(childElement);

    return childElement;
}

function myArrayOfObjectsSearch(array, key) {
    for (let i = 0; i < array.length; i++) {
        if (array[i].text.toLowerCase() === key.toLowerCase()) {
            return i;
        }
    }

    return -1;
};

function renderTodos(todos, filters) {
    let filteredTodos = todos.filter(function (todo) {
        return todo.text.toLowerCase().includes(filters.searchText.toLowerCase());
    });

    return filteredTodos;
}

document.querySelector('.add-button').addEventListener('click', function () {
    const addInputValue = document.querySelector('.add-todo-input').value;
    const lowPriorityDiv = document.querySelector('.low-priority-div');

    if (addInputValue === '') {
        alert('Type something and then hit add...!');
    } else {
        if (myArrayOfObjectsSearch(todosList, addInputValue) !== -1)
            alert('This was already entered... Good luck on completing that!');
        else {
            if (todosList.length === 0) {
                document.querySelector('.todos-have').style.visibility = 'hidden';
            }

            const highPriorityFlag = document.querySelector('.high-priority-checkbox').checked;
            todosList.push({
                text: addInputValue,
                completed: false,
            });

            let todoDiv;
            if (highPriorityFlag) {
                todoDiv = myCreateElement('div', highPriorityDiv, 'todo');

                document.querySelector('.high-priority-checkbox').checked = false;

            } else {
                todoDiv = myCreateElement('div', lowPriorityDiv, 'todo');
            }

            const rowDiv = myCreateElement('div', todoDiv, 'row');

            const todoContentDiv = myCreateElement('div', rowDiv, 'todo-content text-left shadow-sm offset-2 col-6');

            const todoButtonsDiv = myCreateElement('div', rowDiv, 'todo-buttons text-left col-2');

            const todoContentValue = myCreateElement('input', todoContentDiv, 'todo-content-value');
            todoContentValue.value = addInputValue;
            todoContentValue.readOnly = true;

            myCreateElement('i', todoButtonsDiv, 'btn btn-warning fas fa-pen edit-button').title = 'Edit';

            myCreateElement('i', todoButtonsDiv, 'btn btn-success fas fa-check done-button').title = 'Done';

            myCreateElement('i', todoButtonsDiv, 'btn btn-danger fas fa-trash-alt delete-button').title = 'Delete';

            document.querySelector('.add-todo-input').value = '';
        }
    }
});

document.addEventListener('click', function (e) {
    const doneBtn = e.target;
    if (doneBtn && doneBtn.classList.contains('done-button')) {
        const todoRowDiv = doneBtn.parentElement.parentElement;
        const todoContent = todoRowDiv.querySelector('.todo-content-value');
        const index = myArrayOfObjectsSearch(todosList, todoContent.value);
        if (!todosList[index].completed) {
            todosList[index].completed = true;
            if (document.querySelector('.hide-completed').querySelector('span').textContent === ' Unhide completed')
                todoRowDiv.parentElement.style.display = 'none';
        } else {
            todosList[index].completed = false;
        }

        todoContent.classList.toggle('completed');
    }
});

let todoContentOldValue;
document.addEventListener('click', function (e) {
    const editBtn = e.target;
    if (editBtn && editBtn.classList.contains('edit-button')) {
        const todoRowDiv = editBtn.parentElement.parentElement;
        const todoContentDiv = todoRowDiv.querySelector('.todo-content');
        const todoContentDivValue = todoContentDiv.querySelector('.todo-content-value');
        let todoContentNewValue;

        if (editBtn.textContent !== 'Save') {

            todoContentOldValue = todoContentDivValue.value;
            todoRowDiv.querySelector('.done-button').classList.add('disabled-button');
            todoRowDiv.querySelector('.delete-button').classList.add('disabled-button');

            todoContentDivValue.readOnly = false;
            todoContentDivValue.style.background = '#fff';

            todoContentDivValue.focus();
            todoContentDivValue.select();

            editBtn.textContent = 'Save';
            editBtn.classList.remove('fa-pen');
        } else {

            todoContentNewValue = todoContentDivValue.value;
            if (todoContentNewValue !== null && todoContentNewValue !== '') {

                if (todoContentNewValue === todoContentOldValue) {
                }

                else if (myArrayOfObjectsSearch(todosList, todoContentNewValue) !== -1) {
                    alert('This was already entered... Good luck on completing that!');
                    todoContentDivValue.value = todoContentOldValue;
                } else {

                    const index = myArrayOfObjectsSearch(todosList, todoContentOldValue);
                    todosList[index].text = todoContentNewValue;
                    todoContentDivValue.value = todoContentNewValue;
                    todoContentDivValue.readOnly = true;
                }

                todoRowDiv.querySelector('.done-button').classList.remove('disabled-button');
                todoRowDiv.querySelector('.delete-button').classList.remove('disabled-button');

                todoContentDivValue.readOnly = true;
                todoContentDivValue.style.background = 'transparent';

                editBtn.textContent = '';
                editBtn.classList.add('fa-pen');
            }
        }
    }
});

document.addEventListener('click', function (e) {
    const deleteBtn = e.target;
    if (deleteBtn && deleteBtn.classList.contains('delete-button')) {
        const todoDiv = deleteBtn.parentElement.parentElement.parentElement;
        const todoContentValue = todoDiv.querySelector('.todo-content-value').value;
        const index = myArrayOfObjectsSearch(todosList, todoContentValue);

        todosList.splice(index, 1);

        todoDiv.remove();

        if (todosList.length === 0) {
            document.querySelector('.todos-have').style.visibility = 'visible';
        }
    }
});

document.querySelector('.delete-all-todos').addEventListener('click', function () {

    if (todosList.length === 0) {
        alert('Nothing to delete :)');
    } else if (confirm('Are you sure you want to delete all your inputs?')) {

        const todosDiv = document.querySelector('.todos');

        todosList = [];
       
        document.querySelector('.high-priority-div').remove();
        document.querySelector('.low-priority-div').remove(); 

        myCreateElement('div', todosDiv, 'high-priority-div');

        myCreateElement('div', todosDiv, 'low-priority-div');

        document.querySelector('.todos-have').style.visibility = 'visible';
    }
});


document.querySelector('.hide-completed').addEventListener('click', function () {
    const completedTodos = todosList.filter(function (todo) {
        return todo.completed;
    });
    if (completedTodos.length > 0) {
        const todoArray = document.querySelectorAll('.todo');
        if (this.querySelector('span').textContent === ' Hide completed') {

            this.querySelector('i').classList.remove('fa-eye-slash');
            this.querySelector('i').classList.add('fa-eye');
            this.querySelector('span').textContent = ' Unhide completed';

            for (let i = 0; i < todoArray.length; i++) {
                if (todoArray[i].querySelector('.todo-content-value').classList.contains('completed')) {
                    todoArray[i].style.display = 'none';
                }
            }
        } else {
            this.querySelector('i').classList.remove('fa-eye');
            this.querySelector('i').classList.add('fa-eye-slash');
            this.querySelector('span').textContent = ' Hide completed';

            for (let i = 0; i < todoArray.length; i++) {
                if (todoArray[i].style.display == 'none') {
                    todoArray[i].style.display = 'block';
                }
            }
        }
    } else {
        alert('There are no completed tasks... but you still got this!');
    }
});