titleInput = document.querySelector("#sidebar__form1-title-input");
sidebarTaskList = document.querySelector(".sidebar__tasklist")
sidebarListItems = document.querySelector(".sidebar__tasklist-insert");
itemInput = document.querySelector("#sidebar__form1-item-input");
sidebarTaskAdd = document.querySelector(".sidebar__form1-plus");
makeListButton = document.querySelector(".sidebar__form1-make");
clearAllButton = document.querySelector(".sidebar__form1-clear");
filterButton = document.querySelector(".sidebar__form2-filter")
listPrompt = document.querySelector(".todo__listprompt");
cardarea = document.querySelector(".cardarea");

var toDoCollection = JSON.parse(localStorage.getItem("savedTodos")) || [];

window.addEventListener('load', loadPage);
sidebarTaskAdd.addEventListener('click', displaySidebarTasks);
makeListButton.addEventListener('click', addTaskToCollection);
clearAllButton.addEventListener('click', clearSidebar);
sidebarTaskList.addEventListener('click', deleteSidebarTasks);
cardarea.addEventListener('click', cardButtons);

function loadPage() {
  makeListButton.disabled = true;
  clearAllButton.disabled = true;
  filterButton.disabled = true;
  reinstantiateToDos(toDoCollection);
}

function reinstantiateToDos(toDoCollection) {
  var newToDoInstances = toDoCollection.map(function (data) {
    var newData = new ToDo(data.id, data.title, data.task, data.urgent, data.completed);
    return newData;
  })

  displaySavedToDos(newToDoInstances);
}

function displaySavedToDos(newToDoInstances) {
  newToDoInstances.forEach(function (data) {
    displayToDos(data);
  });
}

function displayToDos(toDoInstance) {
  hidePrompt();
  var toDoCard = `
    <div class="todo__card todo__card-regular" data-id=${toDoInstance.id}>
        <h2 class="todo__top">${toDoInstance.title}</h2>
        <section class="todo__middle-display">
        ${collectTaskList(toDoInstance)}
        </section>
        <section class="todo__bottom">
          <article class="card-bottom-urgent">
            <img class="todo__bottom-urgent" src="images/urgent.svg" alt="urgent">
            <p class="todo__bottom-urgent">URGENT</p>
          </article>
          <article class="card-bottom-delete">
            <img class="todo__bottom-delete" src="images/delete.svg" alt="delete">
            <p class="todo__bottom-delete">DELETE</p>
          </article>
        </section>
    </div>`;
  cardarea.insertAdjacentHTML('afterbegin', toDoCard);
}

function collectTaskList(toDoInstance, toDoCard) {
  var cardTasks = "";
  toDoInstance.task.forEach(function (data) {
    cardTasks += `
    <div class="todo__middle-div">
				<img class="todo__middle-checkbox" src="images/checkbox.svg">
				<p class="todo__middle-text">${data.text}</p>
		</div>`
  })

  return cardTasks;
}

function displaySidebarTasks() {
  sidebarTaskList.innerHTML += `
	  <div class="sidebar__tasklist-insert">
		  <img class="task-item__icon-delete" src="images/delete.svg">
		  <p class="task-item__text" data-id=${Date.now()}>${itemInput.value}</p>
    </div>`;
  clearTaskInput();
  makeListButton.disabled = false;
  clearAllButton.disabled = false;
}

function addTaskToCollection(newTask) {
  var secondTaskArray = [];
  var newTaskArray = document.querySelectorAll(".task-item__text");
  for (i = 0; i < newTaskArray.length; i++) {
    var taskObj = {
      text: newTaskArray[i].innerText,
      id: newTaskArray[i].dataset.id,
      checked: false
    }

    secondTaskArray.push(taskObj);
  }
  
  instantiateToDo(secondTaskArray);
}

function instantiateToDo(secondTaskArray) {
  var toDoInstance = new ToDo(Date.now(), titleInput.value, secondTaskArray);
  toDoCollection.push(toDoInstance);
  toDoInstance.saveToStorage(toDoCollection);
  displayToDos(toDoInstance);
  makeListButton.disabled = true;
}

function clearSidebar() {
  clearTitleInput();
  clearSidebarList();
}

function clearTitleInput() {
  titleInput.value = "";
  clearAllButton.disabled = true;
}

function clearTaskInput() {
  itemInput.value = "";
}

function clearSidebarList() {
  sidebarTaskList.innerHTML = "";
}

function deleteSidebarTasks(e) {
  e.target.closest("div").remove();
}

function hidePrompt() {
  if (toDoCollection.length > 0) {
    listPrompt.classList.add("hidden");
  }
}

function showPrompt() {
  listPrompt.classList.remove("hidden");
}

// Card update click functions

function cardButtons(e) {
  var parentCard = e.target.parentNode.parentNode.parentNode.dataset.id;

  if (e.target.className === 'todo__bottom-urgent') {
    console.log(parentCard);
    updateToUrgent(parentCard);
  }
  if (e.target.className === 'todo__bottom-delete') {
    console.log(parentCard);
    deleteDisplayedCards(parentCard);
  }
  if (e.target.className === 'todo__middle-checkbox') {
    console.log(parentCard);
    checkOffATask(parentCard, e);
  }
}




function findCardIndex(card) {
  var cardId = card.dataset.id;
  console.log(cardId);
  return toDoCollection.findIndex(function (item) {
    return item.id == cardId;
  });
}

function updateToUrgent(e) {
  // might need to add class at reinstantiation, use conditional logic based on stored value
  // todo__card.classList.add("todo__urgent")
  var card = e.target.closest('.todo__card');
  var index = findCardIndex(card);
  storeUrgentCard(index);
}

function storeUrgentCard(index) {
  var card = toDoCollection[index];
  card.updateToDo();
  cardarea.innerHTML = '';
  reinstantiateToDos(toDoCollection);
}

function deleteDisplayedCards(e) {
  // this function needs to be unavailable(button is disabled) until all tasks on the list are checked
  // need function to check for this.checked of ALL task items
  if (e.target.className === "todo__bottom-delete") {
    e.target.closest('.todo__card').remove();
    var targetId = parseInt(e.target.closest('.todo__card').dataset.id);
    let foundObj = toDoCollection.find(function (foundObj) {
      foundObj.id === targetId
      foundObj.deleteFromStorage();
    })
    
    showPrompt();
  }
}

function checkOffATask(parentCard, e) {

  var task = parentCard.childNodes.dataset.id;
  // var task = e.target.closest('.todo__middle-div');
  console.log("task on 207", task);
  var index = findCardIndex(parentCard);
  var toDoObject = toDoCollection[index];
  var specificTaskIndex = findItemIndex(toDoObject, taskId);
  toDoObject.updateTask(specificTaskIndex);
  cardArea.innerHTML = '';
  reinstantiateToDos();
}

function findItemIndex(toDoObject, taskId) {
  console.log(toDoObject);
  return toDoObject.task.findIndex(function (item) {
    return item.id == taskId;
  });
}