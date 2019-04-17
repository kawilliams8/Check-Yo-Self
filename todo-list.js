class ToDo {
  constructor(id, title, taskObj, urgent) {
    this.id = id,
    this.title = title,
    this.task = taskObj || [],
    this.urgent = urgent || false
  }

  saveToStorage(toDoCollection) {
    localStorage.setItem("savedTodos", JSON.stringify(toDoCollection));
  }

  deleteFromStorage(index) {
    toDoCollection.splice(index, 1);
     this.saveToStorage(toDoCollection);
  }

  updateToDo() {
    this.urgent = !this.urgent;
    this.saveToStorage(toDoCollection);
  }

  updateTask(checked) {
    this.checked = checked || false;
    this.saveToStorage(toDoCollection);
  }
}