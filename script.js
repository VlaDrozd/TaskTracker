class Task {
  title = '';
  text = '';
  priority = '';
  isComleted = false;

  constructor(title, text, priority, color, number) {
    this.title = title;
    this.text = text;
    this.priority = priority;
    this.number = number;
    this.color = color;
    this.node = document.createElement('li');
    this.node.style.backgroundColor = color;
    this.time = new Date();
    this.node.classList.add('list-group-item');
    this.node.classList.add('d-flex');
    this.node.classList.add('w-100');
    this.node.classList.add('mb-2');
  }

  complite() {
    this.node.innerHTML = `
    <div class="w-100 mr-2">
        <div class="d-flex w-100 justify-content-between">
            <h5 class="mb-1">${this.title}</h5>
            <div>
                <small class="mr-2">${this.priority} priority</small>
                <small>${getTime(this.time)}</small>
            </div>

        </div>
        <p class="mb-1 w-100">${this.text}</p>
    </div>`
  }

  update(number) {
    this.number = number;
    this.node.innerHTML = `
    <div class="w-100 mr-2">
        <div class="d-flex w-100 justify-content-between">
            <h5 class="mb-1">${this.title}</h5>
            <div>
                <small class="mr-2">${this.priority} priority</small>
                <small>${getTime(this.time)}</small>
            </div>

        </div>
        <p class="mb-1 w-100">${this.text}</p>
    </div>
    <div class="dropdown m-2 dropleft">
        <button class="btn btn-secondary h-100" type="button" id="dropdownMenuItem1"
            data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            <i class="fas fa-ellipsis-v" aria-hidden="true"></i>
        </button>
        <div class="dropdown-menu p-2 flex-column" aria-labelledby="dropdownMenuItem1">
            <button onClick="controller.completeTask(${number})" type="button" class="complete btn btn-success w-100">Complete</button>
            <button onClick="controller.startTaskEditing(${number})" type="button" class="edit btn btn-info w-100 my-2">Edit</button>
            <button onClick="controller.deleteTask(${number})" type="button" class="delete btn btn-danger w-100">Delete</button>
        </div>
    </div>`
  }

  edit() {
    this.node.innerHTML = `
    <div class="w-100 mr-2">
        <div class="d-flex w-100 justify-content-between">
            <input id="editTitle" placeholder="Title" class="mb-1" vlaue="${this.title}">
            <div>
                Priority:
                <select name="priority" id="editPriority" value="${this.value}">
                  <option value="Low" selected="selected">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
                Color:
                <select name="color" id="editColor" value="${this.color}">
                  <option selected value="">Default</option>
                  <option style="background-color: #6DF06D" value="#6DF06D">Green</option>
                  <option style="background-color: #FBC969" value="#FBC969">Orange</option>
                  <option style="background-color: #E35B43" value="#E35B43">Red</option>
                </select>
                <small>${getTime(this.time)}</small>
            </div>
        </div>
        <input id="editText" placeholder="Text" class="mb-1 w-100" vlaue="${this.text}">
    </div>
    <div class="dropdown m-2 dropleft">
        <button class="btn btn-secondary h-100" type="button" id="dropdownMenuItem1"
            data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            <i class="fas fa-ellipsis-v" aria-hidden="true"></i>
        </button>
        <div class="dropdown-menu p-2 flex-column" aria-labelledby="dropdownMenuItem1">
            <button onClick="controller.finishTaskEditing()" type="button" class="edit btn btn-info w-100 my-2">Save</button>
        </div>
    </div>`
  }
}

class TaskController {
  ToDoList = [];
  CompliteLIst = [];

  editingTask = null;

  addTask(title, text, color, priotity) {
    this.ToDoList.push(new Task(title, text, priotity, color,this.ToDoList.length));
    this.updateLists();
  }

  completeTask(number) {
    let task = this.ToDoList[number];
    task.complite();
    this.CompliteLIst.push(task);
    this.ToDoList.splice(number, 1);
    this.updateLists();
  }

  startTaskEditing(number) {
    if (this.editingTask) {
      alert('Only one editing task in the same time!');
    }
    else {
      this.editingTask = this.ToDoList[number];
      this.editingTask.edit();
    }
  }

  finishTaskEditing() {
    this.editingTask.title = editTitle.value;
    this.editingTask.text = editText.value;
    this.editingTask.priority = editPriority.value;
    this.editingTask.color = editColor.value;
    this.editingTask.node.style.backgroundColor = editColor.value;
    this.editingTask = null;
    this.updateLists();
  }

  deleteTask(number) {
    this.ToDoList.splice(number, 1);
    this.updateLists();
  }

  updateLists() {
    currentTasks.innerHTML = '';
    this.ToDoList.forEach((li, num) => {
      li.update(num);
      currentTasks.appendChild(li.node);
    });
    completedTasks.innerHTML = '';
    this.CompliteLIst.forEach((li) => {
      completedTasks.appendChild(li.node);
    });
    todoCount.innerText = this.ToDoList.length;
    completeCount.innerText = this.CompliteLIst.length;
  }

  setSortType(type) {
    if(type === 'startOld') {
      this.ToDoList.sort((a, b) => {
        return a.time - b.time;
      });
      this.CompliteLIst.sort((a, b) => {
        return a.time - b.time;
      });
    }
    else if (type === 'startNew') {
      this.ToDoList.sort((a, b) => {
        return -(a.time - b.time);
      });
      this.CompliteLIst.sort((a, b) => {
        return -(a.time - b.time);
      });
    }
    this.updateLists();
  }
}

window.onload = () => {
  this.controller = localStorage.isObject() ? localStorage.getObject('controller') : new TaskController();
  controller.updateLists();
  addTaskForm.addEventListener('submit', function (e) {
    e.preventDefault();
    controller.addTask(inputTitle.value, inputText.value, inputColor.value, getPriority());

    function getPriority() {
      if (Low.checked) {
        return 'Low';
      }
      if (Medium.checked) {
        return 'Medium';
      }
      return 'High';
    }

    inputTitle.value = '';
    inputText.value = '';
    Low.checked = true;

    $('#exampleModal').modal('hide');

  });
}

window.onbeforeunload = () => {
  localStorage.setObject(controller);
}

Storage.prototype.isObject = function (){
  return this.getItem('ToDO') || this.getItem('Complete')
}

Storage.prototype.setObject = function (value) {
  let ToDo = value.ToDoList.map((el) => {
    let {title, text, priority, time, number, color} = el;
    return {
      title,
      text,
      priority,
      time,
      number,
      color
    }
  });
  let Complete = value.CompliteLIst.map((el) => {
    let {title, text, priority, time, number, color} = el;
    return {
      title,
      text,
      priority,
      time,
      number,
      color
    }
  });
  this.setItem('ToDo', JSON.stringify(ToDo));
  this.setItem('Complete', JSON.stringify(Complete))
}

Storage.prototype.getObject = function () {
  let ToDo = JSON.parse(this.getItem('ToDo'));
  let Complete = JSON.parse(this.getItem('Complete'));
  let value = new TaskController();
  value.ToDoList = ToDo.map((el) => {
    let task = new Task(el.title, el.text, el.priority, el.color, el.number);
    task.time = new Date(el.time);
    return task;
  });
  value.CompliteLIst = Complete.map((el) => {
    let task = new Task(el.title, el.text, el.priority, el.color, el.number);
    task.time = new Date(el.time);
    task.complite();
    return task;
  });  
  return value;
}

function getTime(time) {
  function convert(t) {
    return t < 10 ? '0'+t : t;
  }
  return `${time.getHours()}:${convert(time.getMinutes())} ${convert(time.getDate())}.${convert(time.getMonth() + 1)}.${time.getFullYear()}`;
}

function setColorTheme(type) {
  if(type === 'light') {
    styles.href = './light.min.css'
  }
  else if (type === 'dark') {
    styles.href = './dark.min.css'
  }
}