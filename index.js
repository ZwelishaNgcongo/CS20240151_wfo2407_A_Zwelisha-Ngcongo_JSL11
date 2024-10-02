// TASK: import helper functions from utils
import { getTasks,createNewTask,patchTask,putTask,deleteTask } from "./utils/taskFunctions.js";
// TASK: import initialData
import {initialData} from "./initialData.js";

/*************************************************************************************************************************************************
 * FIX BUGS!!!
 * **********************************************************************************************************************************************/


// Function checks if local storage already has data, if not it loads initialData to localStorage
function initializeData() {
  if (!localStorage.getItem('tasks')) {
    localStorage.setItem('tasks', JSON.stringify(initialData)); 
    localStorage.setItem('showSideBar', 'true')
  } else {
    console.log('Data already exists');
  }
}
initializeData()

// TASK: Get elements from the DOM
const elements = { /* inside of an object make use of ":" to assign values to keys/property names e.g sideBarDiv...all the DOM elments have been stored*/
  sideBarDiv: document.getElementById('side-bar-div'),
  logoDiv: document.getElementById('side-logo-div'),
  logoImage: document.getElementById('logo'),
  boardsNavLinksDiv: document.getElementById('boards-nav-links-div'),
  headlineSidepanel: document.getElementById('headline-sidepanel'),
  switchToggle: document.getElementById('switch'),
  hideSidebarBtn: document.getElementById('hide-side-bar-btn'),
  showSidebarBtn: document.getElementById('show-side-bar-btn'),
  headerBoardName: document.getElementById('header-board-name'),
  addNewTaskBtn: document.getElementById('add-new-task-btn'),
  editBoardBtn: document.getElementById('edit-board-btn'),
  deleteBoardBtn: document.getElementById('deleteBoardBtn'),
  newTaskModalWindow: document.getElementById('new-task-modal-window'),
  titleInput: document.getElementById('title-input'),
  descInput: document.getElementById('desc-input'),
  statusSelect: document.getElementById('select-status'),
  createTaskBtn: document.getElementById('create-task-btn'),
  cancelAddTaskBtn: document.getElementById('cancel-add-task-btn'),
  editTaskModalWindow: document.querySelector('.edit-task-modal-window'),
  editTaskForm: document.getElementById('edit-task-form'),
  editTaskTitleInput: document.getElementById('edit-task-title-input'),
  editTaskDescInput: document.getElementById('edit-task-desc-input'),
  editStatusSelect: document.getElementById('edit-select-status'),
  saveTaskChangesBtn: document.getElementById('save-task-changes-btn'),
  cancelEditBtn: document.getElementById('cancel-edit-btn'),
  todoTasksContainer: document.querySelector('[data-status="todo"] .tasks-container'),
  doingTasksContainer: document.querySelector('[data-status="doing"] .tasks-container'),
  doneTasksContainer: document.querySelector('[data-status="done"] .tasks-container'),
  filterDiv: document.getElementById('filterDiv'),
  columnDivs: document.querySelectorAll(".column-div"),
  darkThemeIcon: document.getElementById('icon-dark'),
  lightThemeIcon: document.getElementById('icon-light'),
  newTaskModalWindow: document.getElementById('new-task-modal-window'),
  cancelAddTaskBtn: document.getElementById('cancel-add-task-btn'),
 
}

let activeBoard = "" /* activeBoard acts a global varaible */

// Extracts unique board names from tasks
// TASK: FIX BUGS
function fetchAndDisplayBoardsAndTasks() {
  const tasks = getTasks(); /* fetching all of the task from loacal Storage */
  const boards = [...new Set(tasks.map(task => task.board).filter(Boolean))]; /* we are maping through the tasks in order to extract the board field, new set() removes duplicate boardNames */
  displayBoards(boards);

  if (boards.length > 0) {
    const localStorageBoard = JSON.parse(localStorage.getItem("activeBoard"))
    /* activeBoard = localStorageBoard ? localStorageBoard :  boards[0];  */
    activeBoard = localStorageBoard || boards[0]; // Set to the first board if none is active
    elements.headerBoardName.textContent = activeBoard
    styleActiveBoard(activeBoard)
    filterAndDisplayTasksByBoard(activeBoard); /* funtctions ensures the correct display in relation to boards tasks */
  }
}

// Creates different boards in the DOM
// TASK: Fix Bugs
function displayBoards(boards) {
  const boardsContainer = document.getElementById("boards-nav-links-div");
  boardsContainer.innerHTML = ''; // Clears the container
  boards.forEach(board => {
    const boardElement = document.createElement("button");
    boardElement.textContent = board;
    boardElement.classList.add("board-btn");
    boardElement.addEventListener("click",() =>  { /* add an eventlister for click */
     
      elements.headerBoardName.textContent = board;// Update board name in header/*  */
      
      activeBoard = board //assigns active board
      localStorage.setItem("activeBoard", JSON.stringify(activeBoard))
      styleActiveBoard(activeBoard)
      filterAndDisplayTasksByBoard(activeBoard); // Filter and display tasks for this board/*  */
    });
    boardsContainer.appendChild(boardElement);
  });

}

// Filters tasks corresponding to the board name and displays them on the DOM.
// TASK: Fix Bugs
function filterAndDisplayTasksByBoard(boardName) {
  const tasks = getTasks(); // Fetch tasks from a simulated local storage function
  const filteredTasks = tasks.filter(task => task.board === boardName); /* === to compare the task at hand */

  // Ensure the column titles are set outside of this function or correctly initialized before this function runs

  elements.columnDivs.forEach(column => {
    const status = column.getAttribute("data-status");
    // Reset column content while preserving the column title
    column.innerHTML = `<div class="column-head-div">
                          <span class="dot" id="${status}-dot"></span>
                          <h4 class="columnHeader">${status.toUpperCase()}</h4>
                        </div>`;

   // Filter tasks based on the current column status
   const tasksContainer = column.querySelector('.tasks-container');
   const taskForColumn = filteredTasks.filter(task => task.status === status);

   taskForColumn .forEach(task => {  /* fixed comparison operator for status */
      const taskElement = document.createElement("div");
      taskElement.classList.add("task-div");
      taskElement.innerHTML = `
        <h4>${task.title}</h4>
       
      `;
      taskElement.setAttribute('data-task-id', task.id);

      // Listen for a click event on each task and open a modal
     taskElement.addEventListener("click", (event) => {
        event.stopPropagation();
        openEditTaskModal(task);
        
      });

      column.appendChild(taskElement);
    });
  
  });
}


function refreshTasksUI() {
  const tasks = getTasks();
  const filteredTasks = tasks.filter(task => task.board === activeBoard);
  
// Loop through each column (todo, doing, done) and clear existing tasks
  elements.columnDivs.forEach(column => {
    const status = column.getAttribute("data-status");
    const tasksContainer = column.querySelector('.tasks-container') || column.appendChild(document.createElement('div'));
    tasksContainer.className = 'tasks-container';
  })
   // Clear existing tasks in the container
   tasksContainer.innerHTML = '';

   // Add tasks for this column
   const tasksForColumn = filteredTasks.filter(task => task.status === status);
   tasksForColumn.forEach(task => {
     const taskElement = createTaskElement(task);// Create a task element for each task
     tasksContainer.appendChild(taskElement); // Add each task to the column's container
   });   
  
  };
 

// Styles the active board by adding an active class
// TASK: Fix Bugs
function styleActiveBoard(boardName) {
  document.querySelectorAll('.board-btn').forEach(btn => { 
    
    if(btn.textContent === boardName) {
      btn.classList.add('active') 
    }
    else {
      btn.classList.remove('active'); 
    }
  });
}
fetchAndDisplayBoardsAndTasks(); /* function initiates the board and display tasks */
function addTaskToUI(task) {
  const column = document.querySelector(`.column-div[data-status=${task.status}]`); 
  if (!column) {
    console.error(`Column not found for status: ${task.status}`);
    return;
  }

  let tasksContainer = column.querySelector('.tasks-container');
  if (!tasksContainer) {
   
    tasksContainer = document.createElement('div');
    tasksContainer.className = 'tasks-container';
    column.appendChild(tasksContainer);
  }
/* // Create the new task element */
  const taskElement = document.createElement('div');
  taskElement.className = 'task-div';
  taskElement.innerHTML =  `
  <h4>${task.title}</h4>   
`; /* only displaying the title of the task and not the descriptions as well. */

  taskElement.setAttribute('data-task-id', task.id);
/* // Add event listener to edit the task when clicked */
  taskElement.addEventListener("click", (event) => {
    event.stopPropagation();  // Prevent event bubbling    
    openEditTaskModal(task); // Open the edit modal with the task details  
  });
  /* // Append the new task to the tasks container */
  tasksContainer.appendChild(taskElement); 
 
}

function setupEventListeners() {
  // Cancel editing task event listener
  elements.cancelEditBtn.addEventListener("click", closeEditModal)
  elements.cancelAddTaskBtn.addEventListener('click', () => {
    toggleModal(false, elements.newTaskModalWindow);
    resetNewTaskForm();
  });

  // Clicking outside the modal to close it
  elements.filterDiv.addEventListener('click', () => {
    toggleModal(false);
    elements.filterDiv.style.display = 'none'; // Also hide the filter overlay
  });

  // Show sidebar event listener
  elements.hideSidebarBtn.addEventListener("click", () => toggleSidebar(false));
  elements.showSidebarBtn.addEventListener("click", () => toggleSidebar(true));
  elements.switchToggle.addEventListener('change', toggleTheme);
  elements.addNewTaskBtn.addEventListener('click', () => {
    toggleModal(true, elements.newTaskModalWindow);
    elements.filterDiv.style.display = 'block';
  })

  /* // Show Add New Task Modal event listener */

 elements.editTaskModalWindow = document.querySelector('.edit-task-modal-window');
 elements.editTaskTitleInput = document.getElementById('edit-task-title-input');
 elements.editTaskDescInput = document.getElementById('edit-task-desc-input');
 elements.editStatusSelect = document.getElementById('edit-select-status');
 elements.saveTaskChangesBtn = document.getElementById('save-task-changes-btn');
 elements.cancelEditBtn = document.getElementById('cancel-edit-btn');
 elements.deleteTaskBtn = document.getElementById('delete-task-btn');

  // Add new task form submission event listener
  elements.newTaskModalWindow.addEventListener('submit',  (event) => {
    addTask(event)
  });
 
}
setupEventListeners()

// Toggles tasks modal
// Task: Fix bugs
/* // Make sure toggleModal function is updated to handle different modals: */
function toggleModal(show, modal = elements.modalWindow) {
  if (modal){
    modal.style.display = show ? 'block':'none'; /* tenary operator had to add ":" for alternative option to return */ // Show or hide the modal
  elements.filterDiv.style.display = show ? 'block' : 'none';

  }
  
}
/* // Add a new function to reset the new task form */
function resetNewTaskForm() {
  elements.titleInput.value = '';
  elements.descInput.value = '';
  elements.statusSelect.value = ''; 
}

/*************************************************************************************************************************************************
 * COMPLETE FUNCTION CODE
 * **********************************************************************************************************************************************/

function addTask(event) {
  event.preventDefault(); 

  //Assign user input to the task object
    const task = {
      id:Date.now(), /* // Unique ID for each task */

      title: elements.titleInput.value.trim(),
      description: elements.descInput.value.trim(), /* targeted input in the form by relative id's */
      status: elements.statusSelect.value, /* // Selected status from dropdown */
      board:activeBoard /* tasks are being filtered by the board
 */
      
    };
    const newTask = createNewTask(task);
    if (newTask) {
      addTaskToUI(newTask); /* displaying new task in the UI */
      toggleModal(false,elements.newTaskModalWindow); /* closing the modal window */
   
      resetNewTaskForm();
      refreshTasksUI();  // This line ensures the UI is updated
    }else{
      alert("Failed to create new task!!!");
    }

}


function toggleSidebar(show) {
  const sidebar = document.getElementById('side-bar-div');
  const showSidebarBtn = document.getElementById('show-side-bar-btn');

  if (show) {
    sidebar.style.display = 'block';
    showSidebarBtn.style.display = 'none';
    localStorage.setItem('showSideBar', 'true');
  } else {
    sidebar.style.display = 'none';
    showSidebarBtn.style.display = 'block';
    localStorage.setItem('showSideBar', 'false');
  } 
 
}
toggleSidebar()


function toggleTheme() {
  const themeSwitch = document.getElementById('switch');
  const isDarkTheme = themeSwitch.checked;
  const logo = document.getElementById('logo');

  if (isDarkTheme) {
    document.body.classList.add('dark-theme');  /* Adding the dark theme class to body */
    document.body.classList.remove('light-theme');
    localStorage.setItem('theme', 'dark'); /*  Store theme in localStorage */
    logo.src = './assets/logo-dark.svg'; /* targeting the svg for light theme */
  } else {
    document.body.classList.add('light-theme');
    document.body.classList.remove('dark-theme'); /*  Removing the dark theme  */
    localStorage.setItem('theme', 'light'); /*  Store theme in localStorage */
    logo.src = './assets/logo-light.svg'; /* targeting the svg for light theme */
  }
 
}
 /* created a Function to set initial theme */
function setInitialTheme() {
  const savedTheme = localStorage.getItem('theme');
  const themeSwitch = document.getElementById('switch');

  if (savedTheme === 'dark') {
    themeSwitch.checked = true;
  } else {
    themeSwitch.checked = false;
  }

  toggleTheme(); // Apply the theme based on the switch state
}

 /* Add event listener to the switch */
document.getElementById('switch').addEventListener('change', toggleTheme);

 /* Set initial theme when the page loads */
window.addEventListener('DOMContentLoaded', setInitialTheme);


function openEditTaskModal(task) {
  // Set task details in modal inputs
  elements.editTaskTitleInput.value = task.title;
  elements.editTaskDescInput.value = task.description;
  elements.editStatusSelect.value = task.status;


  // Get button elements from the task modal
  const saveChangesBtn = document.getElementById('save-task-changes-btn');
  const cancelBtn = document.getElementById('cancel-edit-btn');
  const deleteTaskBtn = document.getElementById('delete-task-btn');

   // Clear previous event listeners
   elements.saveTaskChangesBtn.removeEventListener('click', saveTaskChanges);
   elements.cancelEditBtn.removeEventListener('click', closeEditModal);
   elements.deleteTaskBtn.removeEventListener('click', deleteTaskHandler);

   // Set up new event listeners
   elements.saveTaskChangesBtn.onclick = () => saveTaskChanges(task.id);
   elements.cancelEditBtn.onclick = closeEditModal;
   elements.deleteTaskBtn.onclick = () => deleteTaskHandler(task.id);
     /* Show the edit modal */
     toggleModal(true, elements.editTaskModalWindow);
     elements.filterDiv.style.display = 'block';  
  }

  /* // Cancel adding new task event listener */
 elements.cancelAddTaskBtn.addEventListener('click', () => {
  toggleModal(false, elements.newTaskModalWindow); // Hide the modal
  elements.filterDiv.style.display = 'none'; // Also hide the filter overlay
  document.getElementById('title-input').value = ""; // Clear form inputs
  document.getElementById('desc-input').value = "";
});

  
  // Call saveTaskChanges upon click of Save Changes button
   /* Set up new event listeners */
   saveTaskChangesBtn.onclick = () => {
    const updatedTask = {
      title: editTaskTitleInput.value,
      description: editTaskDescInput.value,
      status: editSelectStatus.value,
    };
    patchTask(task.id, updatedTask);
    toggleModal(false, elements.editTaskModal);
    refreshTasksUI();
  };

  // Delete task using a helper function and close the task modal
  function deleteTaskHandler(taskId) {
    if(confirm("Are you sure you want to delete this task?")) {
      deleteTask(taskId);
     // Remove the task element from the UI /*  */
    const taskElement = document.querySelector(`[data-task-id='${taskId}']`);
    if (taskElement) {
      taskElement.remove();  // Remove the task element from the DOM /*  */
    }
    closeEditModal();  // Close the edit modal if open
    }
  }


 


function saveTaskChanges(taskId) {
  // Get new user inputs
  const updatedTask = {   
    title: elements.editTaskTitleInput.value,
    description: elements.editTaskDescInput.value, 
    status: elements.editStatusSelect.value,
    board: activeBoard  // Preserve the board of the task 
  };

  // Use putTask to replace the entire task
  putTask(taskId, updatedTask);
  
  // Now update the task directly in the UI without refreshing the whole UI 
  const taskElement = document.querySelector(`[data-task-id='${taskId}']`); 
  if (taskElement) {
    taskElement.querySelector('h4').textContent = updatedTask.title;

    // Move the task to the correct column if status changed 
    const newColumn = document.querySelector(`.column-div[data-status="${updatedTask.status}"]`);
    if (newColumn) {
      const tasksContainer = newColumn.querySelector('.tasks-container');
      tasksContainer.appendChild(taskElement);
    }
  }


  closeEditModal();
  refreshTasksUI();   /* Refresh the entire UI to ensure that there is consistency */
}

  // Close the modal and refresh the UI to reflect the changes
  
  function closeEditModal() {
    toggleModal(false, elements.editTaskModalWindow); 
    elements.filterDiv.style.display = 'none';
    refreshTasksUI();

  }
  
/*************************************************************************************************************************************************/

document.addEventListener('DOMContentLoaded', function() {
  init(); // init is called after the DOM is fully loaded
});

function init() {
  setupEventListeners();
  const showSidebar = localStorage.getItem('showSideBar') === 'true';
  toggleSidebar(showSidebar);
  const isLightTheme = localStorage.getItem('light-theme') === 'enabled';
  document.body.classList.toggle('light-theme', isLightTheme);
  fetchAndDisplayBoardsAndTasks(); // Initial display of boards and tasks
}
window.addEventListener('DOMContentLoaded', () => {
  setupEventListeners(); // Ensures that all listeners are attached /*  */
});

