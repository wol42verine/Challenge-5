// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId")) || 1;

// create a function to generate a unique task id
function generateTaskId() {
    return nextId++;
}

// create a function to create a task card
function createTaskCard(task) {
    let today = new Date().toISOString().slice(0,10);
        let dateClass = '';
        if (task.dueDate < today) {
            dateClass = 'bg-white';
        } else if (task.dueDate === today) {
            dateClass = 'bg-yellow';
        } else {
            dateClass = 'bg-red';
        }

        return `
        <div class="card mb-3 ${dateClass}">
            <div class="card-body">
                <h5 class="card-title">${task.title}</h5>
                <p class="card-text">Due Date: ${task.dueDate}</p>
                <p class="card-text">Status: ${task.status}</p>
                <button class="btn-danger delete-btn" data-task-id="${task.id}">Delete</button>
            </div>
        </div>
        `;
    }

    function renderTaskList(){
        $('#todo.cards').empty();
        $('#in-progress-cards').empty();
        $('#done-cards').empty();

        taskList.forEach(task => {
            let card = createTaskCard(task);
            if (task.status === "To Do"){
                $('#todo-cards').append(card);
            } else if (task.status === "In Progress") {
                $('#in-progress-cards').append(card);
            } else {
                $('#done-cards').append(card);
            }
        });

        $(".card").draggable({
            revert:true,
            revertDuration:0
        });
    }

// create a function to handle deleting a task
function handleDeleteTask(event){
    let taskId = $(this).data('task-id');
    taskList=taskList.filter(task => task.id !== taskId);
    localStorage.setItem("tasks", JSON.stringify(taskList));
    renderTaskList();
}

// create a function to handle dropping a task into a new status lane
//Todo: Issue dropping into new lane
function handleDrop(event, ui) {
    let taskId = ui.draggable.find('.delete-btn').data('task-id');
    let newStatus =$(this).attr('id');
    let taskIndex = taskList.findIndex(task => task.id === taskId);
    taskList[taskIndex].status = newStatus;
    localStorage.setItem("tasks", JSON.stringify(taskList));
    ui.draggable.appendTo($(this)).css({top:0, left: 0});
    ui.draggable.find('.card-text:contains("Status")').text('Status:' + newStatus); 
}


// when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    renderTaskList();

    $('#taskForm').submit(handleAddTask);
    $(document).on('click', '.delete-btn', handleDeleteTask);

    $(".lane").droppable({
        drop:handleDrop
    });

    $('#dueDate').datepicker();

    $('#formModal').on('show.bs.modal', function (event) {
        $('#taskTitle').val('');
        $('#dueDate').val('');
        $('#status').val('To Do');
    });
});

// create a function to handle adding a new task
//Save data to local storage
function handleAddTask(event){
    event.preventDefault();
    let taskTitle = $('#taskTitle').val();
    let dueDate = $('#dueDate').val();
    let status = $('#status').val();
    let taskId = generateTaskId();
    let task = {
        id: taskId,
        title: taskTitle,
        dueDate: dueDate,
        status: status
    };
    taskList.push(task);
    localStorage.setItem("tasks", JSON.stringify(taskList));
    localStorage.setItem("nextId",JSON.stringify(nextId));
    renderTaskList();
    $('#formModal').modal('hide');

}
//Todo: Artifacts with dragging columns and Datepicker
